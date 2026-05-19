// Multer Upload Middleware Configuration (Cloudinary Integration)
// CHGOURI CAR Marrakech Car Rental

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Storage options for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'chgouri-car',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    // Transformation can be added here if needed, like { width: 800, height: 600, crop: 'limit' }
  },
});

// Image file type filter
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
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

module.exports = upload;
