// Contact Form Messages Routing Mappings
// CHGOURI CAR Marrakech Car Rental

const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { protect, restrictTo } = require('../middlewares/auth');

// Public route to submit contact forms
router.post('/', messageController.createMessage);

// Admin-protected routes
router.get('/', protect, restrictTo('admin'), messageController.getAllMessages);
router.delete('/:id', protect, restrictTo('admin'), messageController.deleteMessage);

module.exports = router;
