// Database Configuration - Sequelize ORM
// CHGOURI CAR Marrakech Car Rental

const { Sequelize } = require('sequelize');
require('dotenv').config();

const { getDbConfig, logDbConfig } = require('./dbConfig');

const dbLogging = process.env.DB_LOGGING === 'true' ? console.log : false;

const db = getDbConfig();
logDbConfig(db);

const sequelize = new Sequelize(db.database, db.user, db.password, {
  host: db.host,
  port: db.port,
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

module.exports = sequelize;
