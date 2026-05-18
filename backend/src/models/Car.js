// Car Database Model
// CHGOURI CAR Marrakech Car Rental

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Car = sequelize.define('Car', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    defaultValue: 'Economy'
  },
  pricePerDay: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'price_per_day'
  },
  pricePerWeek: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'price_per_week'
  },
  pricePerMonth: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'price_per_month'
  },
  imageUrl: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'image_url'
  },
  features: {
    type: DataTypes.JSON,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'maintenance', 'retired'),
    defaultValue: 'active'
  }
}, {
  tableName: 'cars'
});

module.exports = Car;
