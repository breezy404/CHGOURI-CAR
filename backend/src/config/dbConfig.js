const { isRailwayRuntime } = require('./loadEnv');

const isProduction = process.env.NODE_ENV === 'production';
const isRailway = isRailwayRuntime();
const isCloudRuntime = isRailway || Boolean(process.env.PORT);

function envStatus(key) {
  const v = process.env[key];
  if (v === undefined) return 'MISSING';
  if (v === '') return 'EMPTY';
  if (String(v).includes('${{')) return 'UNRESOLVED_REF';
  return 'set';
}

function logEnvDiagnostics() {
  const keys = [
    'MYSQLHOST',
    'MYSQLPORT',
    'MYSQLUSER',
    'MYSQLPASSWORD',
    'MYSQLDATABASE',
    'MYSQL_URL',
    'DATABASE_URL',
    'RAILWAY_SERVICE_NAME',
    'RAILWAY_ENVIRONMENT',
    'RAILWAY_SERVICE_ID',
    'PORT'
  ];
  console.log(
    '🔎 Env:',
    keys.map((k) => `${k}=${envStatus(k)}`).join(' | ')
  );
  const mysqlKeys = Object.keys(process.env).filter((k) => /mysql/i.test(k));
  console.log(
    `🔎 Service: ${process.env.RAILWAY_SERVICE_NAME || '(unknown)'} | MySQL-related env keys in container: ${mysqlKeys.length ? mysqlKeys.join(', ') : '(none — vars are NOT on this deploying service)'}`
  );
}

function parseDatabaseUrl(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return {
      host: parsed.hostname,
      port: parseInt(parsed.port || '3306', 10),
      user: decodeURIComponent(parsed.username || 'root'),
      password: decodeURIComponent(parsed.password || ''),
      database: parsed.pathname.replace(/^\//, '') || 'railway'
    };
  } catch {
    return null;
  }
}

function pickEnv(...names) {
  for (const name of names) {
    const v = process.env[name];
    if (v && !String(v).includes('${{')) return v;
  }
  return undefined;
}

function getDbConfigFromVars() {
  const host = pickEnv('MYSQLHOST', 'MYSQL_HOST');
  if (!host) return null;

  return {
    host,
    port: parseInt(pickEnv('MYSQLPORT', 'MYSQL_PORT') || '3306', 10),
    user: pickEnv('MYSQLUSER', 'MYSQL_USER') || 'root',
    password: pickEnv('MYSQLPASSWORD', 'MYSQL_PASSWORD', 'MYSQL_ROOT_PASSWORD') || '',
    database: pickEnv('MYSQLDATABASE', 'MYSQL_DATABASE', 'MYSQL_DATABASE_NAME') || 'railway',
    source: 'MYSQLHOST'
  };
}

function getDbConfig() {
  // 1) Individual Railway MySQL variables
  const fromVars = getDbConfigFromVars();
  if (fromVars) return fromVars;

  // 2) Connection URL — internal *.railway.internal works on Railway
  const url =
    pickEnv('MYSQL_URL', 'DATABASE_URL', 'MYSQL_PUBLIC_URL') ||
    null;
  const fromUrl = parseDatabaseUrl(url);
  if (fromUrl) {
    if (isCloudRuntime && /\.proxy\.rlwy\.net$/i.test(fromUrl.host)) {
      logEnvDiagnostics();
      throw new Error(
        'Only the internal MYSQL_URL works on Railway (host *.railway.internal). ' +
        'On CHGOURI-CAR add variable reference: MYSQL_URL → ${{YourMySQLService.MYSQL_URL}} ' +
        '(the one with mysql-sh4f.railway.internal, NOT interchange.proxy.rlwy.net).'
      );
    }
    return { ...fromUrl, source: 'MYSQL_URL' };
  }

  // 3) Cloud without any DB config
  if (isCloudRuntime || isProduction) {
    logEnvDiagnostics();
    throw new Error(
      `No MySQL env vars reached this container (service: ${process.env.RAILWAY_SERVICE_NAME || 'unknown'}). ` +
      'Your dashboard may show MYSQLHOST on CHGOURI-CAR, but this deploy is a different service/environment. ' +
      'Fix: open the service that GitHub deploys → Variables → add MYSQLHOST,MYSQLPORT,MYSQLUSER,MYSQLPASSWORD,MYSQLDATABASE ' +
      'OR add MYSQL_URL referencing internal mysql-sh4f.railway.internal URL. Then Redeploy.'
    );
  }

  // 4) Local development
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'chgouri_db',
    source: 'local'
  };
}

function logDbConfig(config) {
  console.log(
    `📍 DB Config [${config.source}]: host=${config.host} port=${config.port} db=${config.database} user=${config.user}`
  );
}

module.exports = { getDbConfig, logDbConfig, isRailway };
