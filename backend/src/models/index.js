// Database Models Associations & Aggregator (Simplified version)
// CHGOURI CAR Marrakech Car Rental

const sequelize = require('../config/db');
const User = require('./User');
const Car = require('./Car');
const Booking = require('./Booking');
const Message = require('./Message');

// 1. Car & Booking Relations (direct request mapping)
Car.hasMany(Booking, { foreignKey: 'carId', as: 'bookings' });
Booking.belongsTo(Car, { foreignKey: 'carId', as: 'car' });

module.exports = {
  sequelize,
  User,
  Car,
  Booking,
  Message
};
