// Load .env only for local dev — never on Railway (avoids DB_HOST=localhost override)
function isRailwayRuntime() {
  return Boolean(
    process.env.RAILWAY_ENVIRONMENT ||
    process.env.RAILWAY_PROJECT_ID ||
    process.env.RAILWAY_SERVICE_ID ||
    process.env.RAILWAY_DEPLOYMENT_ID ||
    process.env.RAILWAY_PUBLIC_DOMAIN
  );
}

function loadEnv() {
  if (!isRailwayRuntime()) {
    require('dotenv').config();
  }
}

module.exports = { loadEnv, isRailwayRuntime };
