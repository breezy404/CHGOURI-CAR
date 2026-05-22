const { isRailwayRuntime } = require('./loadEnv');

const isProduction = process.env.NODE_ENV === 'production';
const isRailway = isRailwayRuntime();
const isCloudRuntime = isRailway || Boolean(process.env.PORT);

// Internal Railway MySQL host (from your MySQL service — not a secret)
const RAILWAY_INTERNAL_HOST = 'mysql-sh4f.railway.internal';

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
    'MYSQLPASSWORD',
    'MYSQL_URL',
    'DATABASE_URL',
    'DB_HOST',
    'DB_PASS',
    'JWT_SECRET',
    'CLOUDINARY_CLOUD_NAME',
    'RAILWAY_SERVICE_NAME',
    'PORT'
  ];
  console.log(
    '🔎 Env:',
    keys.map((k) => `${k}=${envStatus(k)}`).join(' | ')
  );
  const mysqlKeys = Object.keys(process.env).filter((k) => /mysql|DATABASE_URL|^DB_/i.test(k));
  console.log(
    `🔎 Service: ${process.env.RAILWAY_SERVICE_NAME || '(unknown)'} | DB-related keys: ${mysqlKeys.length ? mysqlKeys.join(', ') : '(none)'}`
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

function getDbConfigFromMysqlVars() {
  const host = pickEnv('MYSQLHOST', 'MYSQL_HOST');
  if (!host) return null;

  return {
    host,
    port: parseInt(pickEnv('MYSQLPORT', 'MYSQL_PORT') || '3306', 10),
    user: pickEnv('MYSQLUSER', 'MYSQL_USER') || 'root',
    password: pickEnv('MYSQLPASSWORD', 'MYSQL_PASSWORD', 'MYSQL_ROOT_PASSWORD') || '',
    database: pickEnv('MYSQLDATABASE', 'MYSQL_DATABASE') || 'railway',
    source: 'MYSQLHOST'
  };
}

function getDbConfigFromDbVars() {
  const host = pickEnv('DB_HOST');
  if (!host) return null;

  return {
    host,
    port: parseInt(pickEnv('DB_PORT') || '3306', 10),
    user: pickEnv('DB_USER') || 'root',
    password: pickEnv('DB_PASS', 'DB_PASSWORD') || '',
    database: pickEnv('DB_NAME') || 'railway',
    source: 'DB_*'
  };
}

/** When Railway UI shows MySQL vars but injects none — only password may work */
function getDbConfigChgouriFallback() {
  if (process.env.RAILWAY_SERVICE_NAME !== 'CHGOURI-CAR') return null;

  const password = pickEnv(
    'MYSQLPASSWORD',
    'MYSQL_PASSWORD',
    'DB_PASS',
    'DB_PASSWORD'
  );
  if (!password) return null;

  return {
    host: RAILWAY_INTERNAL_HOST,
    port: 3306,
    user: 'root',
    password,
    database: 'railway',
    source: 'CHGOURI-CAR-fallback'
  };
}

function getDbConfig() {
  // 1) MYSQLHOST / MYSQLPORT / ...
  const fromMysql = getDbConfigFromMysqlVars();
  if (fromMysql) return fromMysql;

  // 2) DB_HOST / DB_PASS / ... (works if you use these names in Railway Raw Editor)
  const fromDb = getDbConfigFromDbVars();
  if (fromDb) return fromDb;

  // 3) Single connection URL
  const url = pickEnv('MYSQL_URL', 'DATABASE_URL', 'MYSQL_PUBLIC_URL');
  const fromUrl = parseDatabaseUrl(url);
  if (fromUrl) {
    if (isCloudRuntime && /\.proxy\.rlwy\.net$/i.test(fromUrl.host)) {
      logEnvDiagnostics();
      throw new Error(
        'Use internal MYSQL_URL (mysql-sh4f.railway.internal), not the public proxy URL.'
      );
    }
    return { ...fromUrl, source: 'MYSQL_URL' };
  }

  // 4) CHGOURI-CAR: host is known; only need password in env
  const fallback = getDbConfigChgouriFallback();
  if (fallback) return fallback;

  if (isCloudRuntime || isProduction) {
    logEnvDiagnostics();
    throw new Error(
      'Railway is NOT injecting MySQL variables into CHGOURI-CAR. ' +
      'Open CHGOURI-CAR → Variables → Raw Editor → paste ALL lines below → Deploy:\n' +
      'DATABASE_URL=mysql://root:YOUR_PASSWORD@mysql-sh4f.railway.internal:3306/railway\n' +
      '(Or: MYSQLHOST, MYSQLPORT, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE as plain values — not ${{refs}})\n' +
      'Also: Project canvas → Connect MySQL service to CHGOURI-CAR.'
    );
  }

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
