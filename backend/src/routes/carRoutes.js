// Car Fleet Route Mapping
// CHGOURI CAR Marrakech Car Rental

const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const { protect, restrictTo } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.get('/', carController.getAllCars);
router.get('/:id', carController.getCarById);

// Admin-only fleet mutations (with multiple images upload support)
router.post('/', protect, restrictTo('admin'), upload.array('images', 10), carController.createCar);
router.put('/:id', protect, restrictTo('admin'), upload.array('images', 10), carController.updateCar);
router.delete('/:id', protect, restrictTo('admin'), carController.deleteCar);

module.exports = router;
