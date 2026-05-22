const { isRailwayRuntime } = require('./loadEnv');

const isProduction = process.env.NODE_ENV === 'production';
const isRailway = isRailwayRuntime();
// Railway always sets PORT; catches deploys where RAILWAY_* is missing
const isCloudRuntime = isRailway || Boolean(process.env.PORT);

function logEnvDiagnostics() {
  const keys = [
    'MYSQLHOST',
    'MYSQLPORT',
    'MYSQLUSER',
    'MYSQLPASSWORD',
    'MYSQLDATABASE',
    'MYSQL_URL',
    'RAILWAY_ENVIRONMENT',
    'RAILWAY_SERVICE_ID',
    'PORT'
  ];
  console.log(
    '🔎 Env:',
    keys.map((k) => `${k}=${process.env[k] ? 'set' : 'MISSING'}`).join(' | ')
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

function getDbConfig() {
  // 1) Railway private networking (required for backend → MySQL on Railway)
  if (process.env.MYSQLHOST) {
    return {
      host: process.env.MYSQLHOST,
      port: parseInt(process.env.MYSQLPORT || '3306', 10),
      user: process.env.MYSQLUSER || 'root',
      password: process.env.MYSQLPASSWORD || '',
      database: process.env.MYSQLDATABASE || 'railway',
      source: 'MYSQLHOST'
    };
  }

  // 2) Connection URL (OK for local PC; public proxy fails inside Railway)
  const fromUrl = parseDatabaseUrl(
    process.env.MYSQL_URL || process.env.DATABASE_URL
  );
  if (fromUrl) {
    if (isCloudRuntime && /\.proxy\.rlwy\.net$/i.test(fromUrl.host)) {
      logEnvDiagnostics();
      throw new Error(
        'MYSQL_URL uses the public proxy (*.proxy.rlwy.net) and cannot be used from inside Railway. ' +
        'Delete MYSQL_URL on CHGOURI-CAR. Add MYSQLHOST, MYSQLPORT, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE ' +
        'as references from your MySQL service (e.g. ${{MySQL-sH4F.MYSQLHOST}}).'
      );
    }
    return { ...fromUrl, source: 'MYSQL_URL' };
  }

  // 3) Cloud/Railway without DB config — stop immediately (no localhost retries)
  if (isCloudRuntime || isProduction) {
    logEnvDiagnostics();
    throw new Error(
      'MYSQLHOST is not set on this service. In Railway → CHGOURI-CAR → Variables → ' +
      'add references: MYSQLHOST, MYSQLPORT, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE ' +
      'from your MySQL service. Remove MYSQL_URL and any DB_HOST=localhost from service variables.'
    );
  }

  // 4) Local development only
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
