// Database Configuration - Sequelize ORM
// CHGOURI CAR Marrakech Car Rental

const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbHost = process.env.DB_HOST || process.env.MYSQLHOST || 'localhost';
const dbPort = process.env.DB_PORT || process.env.MYSQLPORT || 3306;
const dbName = process.env.DB_NAME || process.env.MYSQLDATABASE || 'chgouri_db';
const dbUser = process.env.DB_USER || process.env.MYSQLUSER || 'root';
const dbPass = process.env.DB_PASS || process.env.MYSQLPASSWORD || '';
const dbLogging = process.env.DB_LOGGING === 'true' ? console.log : false;

let sequelize;

if (process.env.DATABASE_URL || process.env.MYSQL_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL || process.env.MYSQL_URL, {
    dialect: 'mysql',
    logging: dbLogging,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    },
    define: {
      timestamps: true,
      underscored: true
    }
  });
} else {
  sequelize = new Sequelize(dbName, dbUser, dbPass, {
    host: dbHost,
    port: dbPort,
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
}

module.exports = sequelize;
