// Database Models Associations & Aggregator
const sequelize = require('../config/db');
const User = require('./User');
const Car = require('./Car');
const Booking = require('./Booking');
const Message = require('./Message');

Car.hasMany(Booking, { foreignKey: 'carId', as: 'bookings' });
Booking.belongsTo(Car, { foreignKey: 'carId', as: 'car' });

module.exports = {
  sequelize,
  User,
  Car,
  Booking,
  Message
};
