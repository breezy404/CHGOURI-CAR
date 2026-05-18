// Booking Public Routes (Simplified Commercial version)
// CHGOURI CAR Marrakech Car Rental

const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Public route to submit a reservation request
router.post('/', bookingController.createBooking);

module.exports = router;
