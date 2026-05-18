// Admin Panel Route Mapping (Simplified version)
// CHGOURI CAR Marrakech Car Rental

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, restrictTo } = require('../middlewares/auth');

const authController = require('../controllers/authController');

// Admin Login (Public but rate-limited)
router.post('/login', authController.loginLimiter, authController.login);

// Apply protection and check admin role for the rest of admin routes
router.use(protect);
router.use(restrictTo('admin'));

// Admin Analytics
router.get('/stats', adminController.getDashboardStats);

// Booking Control
router.get('/bookings', adminController.getAllBookings);
router.put('/bookings/:id/status', adminController.updateBookingStatus);

module.exports = router;
