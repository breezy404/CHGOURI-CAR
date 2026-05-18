// Authentication Route Mapping
// CHGOURI CAR Marrakech Car Rental

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

router.post('/login', authController.loginLimiter, authController.login);
router.get('/me', protect, authController.getProfile);

module.exports = router;
