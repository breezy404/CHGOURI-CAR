// Multi-Image Upload Routing using Multer
// CHGOURI CAR Marrakech Car Rental

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect, restrictTo } = require('../middlewares/auth');

// Dynamic directory existence check & creation
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'car-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Image-only mime-type filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Format de fichier non pris en charge. Veuillez sélectionner uniquement des images (JPG, PNG, WEBP, etc.) !'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Limit each image to 5MB max
});

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

    // Map local filenames to access URLs
    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);

    return res.status(200).json({
      success: true,
      message: 'Images téléchargées avec succès !',
      urls: imageUrls
    });
  });
});

module.exports = router;
