// Multi-Image Upload Routing using Cloudinary
// CHGOURI CAR Marrakech Car Rental

const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = require('../middlewares/upload');
const { protect, restrictTo } = require('../middlewares/auth');

// Admin-only multi-file upload endpoint (key: 'images')
router.post('/', protect, restrictTo('admin'), (req, res) => {
  // Use custom upload.array handler to handle errors gracefully (like size limits)
  upload.array('images', 10)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error('Multer upload error:', err);
      return res.status(400).json({
        success: false,
        message: `Erreur de téléchargement : ${err.message}`
      });
    } else if (err) {
      console.error('General upload error:', err);
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez sélectionner au moins une image à télécharger.'
      });
    }

    // Map Cloudinary secure URLs or local paths
    const imageUrls = req.files.map(file => {
      return file.path && file.path.startsWith('http') ? file.path : `/uploads/${file.filename}`;
    });

    return res.status(200).json({
      success: true,
      message: 'Images téléchargées avec succès !',
      urls: imageUrls
    });
  });
});

module.exports = router;
