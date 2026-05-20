const cloudinary = require('cloudinary').v2;

if (!process.env.CLOUD_NAME || !process.env.API_KEY || !process.env.API_SECRET) {
  console.warn('⚠️ WARNING: Cloudinary credentials are missing in your .env file! Image uploads will fail.');
}

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

module.exports = cloudinary;
