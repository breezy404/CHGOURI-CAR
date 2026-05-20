// Authentication Route Mapping
// CHGOURI CAR Marrakech Car Rental

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

router.post('/login', authController.loginLimiter, authController.login);
router.get('/me', protect, authController.getProfile);

// Password Reset Routes
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-otp', authController.verifyOTP);
router.post('/reset-password', authController.resetPassword);

// Email Change Routes
router.post('/request-email-change', protect, authController.requestEmailChange);
router.post('/verify-email-change', protect, authController.verifyEmailChange);

module.exports = router;
