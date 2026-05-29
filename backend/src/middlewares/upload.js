// Multer Upload Middleware Configuration (Cloudinary Integration)
// CHGOURI CAR Marrakech Car Rental

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const fs = require('fs');
const path = require('path');

const isCloudinaryConfigured = process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_KEY !== 'your_api_key';

let storage;

if (isCloudinaryConfigured) {
  // Storage options for Cloudinary
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'chgouri-car',
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
      transformation: [{ quality: 'auto:best', fetch_format: 'auto' }],
    },
  });
} else {
  console.log('⚠️ Using local disk storage for uploads because Cloudinary is not configured.');
  const uploadsDir = path.join(__dirname, '../../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, 'car-' + uniqueSuffix + path.extname(file.originalname));
    }
  });
}

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
