// Booking Database Model (Simplified Commercial version)
// CHGOURI CAR Marrakech Car Rental

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  carId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'car_id'
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'customer_name'
  },
  customerPhone: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'customer_phone'
  },
  customerEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'customer_email'
  },
  pickupDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'pickup_date'
  },
  returnDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'return_date'
  },
  pickupLocation: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'pickup_location'
  },
  returnLocation: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'return_location'
  },
  bookingStatus: {
    type: DataTypes.ENUM('pending', 'contacted', 'confirmed', 'cancelled'),
    defaultValue: 'pending',
    field: 'booking_status'
  }
}, {
  tableName: 'bookings'
});

module.exports = Booking;
