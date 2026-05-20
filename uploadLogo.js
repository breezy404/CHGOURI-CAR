require('dotenv').config({ path: './backend/.env' });
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true
});

const uploadLogo = async () => {
  try {
    const result = await cloudinary.uploader.upload('./frontend/src/components/logo.png', {
      folder: 'chgouri-car/assets',
      public_id: 'logo'
    });
    console.log('Logo URL:', result.secure_url);
  } catch (error) {
    console.error('Error uploading logo:', error);
  }
};

uploadLogo();
