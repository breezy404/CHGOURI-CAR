// Database Configuration - Sequelize ORM
const { Sequelize } = require('sequelize');
const { loadEnv } = require('./loadEnv');
const { getDbConfig, logDbConfig } = require('./dbConfig');

loadEnv();

const dbLogging = process.env.DB_LOGGING === 'true' ? console.log : false;

let sequelizeInstance;

function getSequelize() {
  if (!sequelizeInstance) {
    const db = getDbConfig();
    logDbConfig(db);
    sequelizeInstance = new Sequelize(db.database, db.user, db.password, {
      host: db.host,
      port: db.port,
      dialect: 'mysql',
      logging: dbLogging,
      pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
      define: { timestamps: true, underscored: true }
    });
  }
  return sequelizeInstance;
}

// Proxy so models can `require('./db')` and call .define() — config loads on first use
const sequelize = new Proxy(
  {},
  {
    get(_, prop) {
      if (prop === 'getSequelize') return getSequelize;
      const s = getSequelize();
      const v = s[prop];
      return typeof v === 'function' ? v.bind(s) : v;
    }
  }
);

module.exports = sequelize;
module.exports.getSequelize = getSequelize;
