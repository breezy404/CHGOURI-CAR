// Database Configuration - Sequelize ORM
// CHGOURI CAR Marrakech Car Rental

const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbLogging = process.env.DB_LOGGING === 'true' ? console.log : false;

let sequelize;

// Railway provides MYSQLHOST for private networking (service-to-service).
// MYSQL_URL uses the public proxy which does NOT work for internal connections.
// Always prefer individual variables for Railway private networking.
const host = process.env.MYSQLHOST || process.env.DB_HOST;
const port = process.env.MYSQLPORT || process.env.DB_PORT || 3306;
const database = process.env.MYSQLDATABASE || process.env.DB_NAME || 'chgouri_db';
const user = process.env.MYSQLUSER || process.env.DB_USER || 'root';
const password = process.env.MYSQLPASSWORD || process.env.DB_PASS || '';

if (host) {
  console.log(`🔌 DB Config: host=${host} port=${port} db=${database} user=${user}`);
  sequelize = new Sequelize(database, user, password, {
    host: host,
    port: parseInt(port),
    dialect: 'mysql',
    logging: dbLogging,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true
    }
  });
} else {
  // Local development fallback
  console.log('🔌 DB Config: local fallback (localhost)');
  sequelize = new Sequelize('chgouri_db', 'root', '', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    logging: dbLogging,
    define: {
      timestamps: true,
      underscored: true
    }
  });
}

module.exports = sequelize;
