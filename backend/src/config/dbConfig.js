// Shared database connection settings (local + Railway)
const isProduction = process.env.NODE_ENV === 'production';
const isRailway = Boolean(
  process.env.RAILWAY_ENVIRONMENT ||
  process.env.RAILWAY_PROJECT_ID ||
  process.env.RAILWAY_SERVICE_ID
);

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
  // 1) Railway private networking (service-to-service)
  if (process.env.MYSQLHOST) {
    return {
      host: process.env.MYSQLHOST,
      port: parseInt(process.env.MYSQLPORT || '3306', 10),
      user: process.env.MYSQLUSER || 'root',
      password: process.env.MYSQLPASSWORD || '',
      database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'railway',
      source: 'MYSQLHOST'
    };
  }

  // 2) Connection URL (public proxy — local dev only; fails inside Railway)
  const fromUrl = parseDatabaseUrl(
    process.env.MYSQL_URL || process.env.DATABASE_URL
  );
  if (fromUrl) {
    if (isRailway && /\.proxy\.rlwy\.net$/i.test(fromUrl.host)) {
      throw new Error(
        'MYSQL_URL uses the public proxy (*.proxy.rlwy.net), which does not work from inside Railway. ' +
        'On your CHGOURI-CAR service: delete MYSQL_URL, then add MYSQLHOST, MYSQLPORT, MYSQLUSER, ' +
        'MYSQLPASSWORD, MYSQLDATABASE as references from your MySQL service (e.g. ${{MySQL-sH4F.MYSQLHOST}}).'
      );
    }
    return { ...fromUrl, source: 'MYSQL_URL' };
  }

  // 3) On Railway without DB vars: fail fast (do not use bundled .env localhost)
  if (isRailway || isProduction) {
    const hint = isRailway
      ? 'On Railway: open your backend service → Variables → Add variable reference from your MySQL service (MYSQLHOST, MYSQLPORT, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE).'
      : 'Set MYSQLHOST (Railway private) or MYSQL_URL / DATABASE_URL.';
    throw new Error(`Missing database configuration. ${hint}`);
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
