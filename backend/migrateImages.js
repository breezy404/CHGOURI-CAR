/**
 * Optional script to migrate local /uploads images to Cloudinary.
 * 
 * Instructions:
 * 1. Ensure your .env is correctly filled with Cloudinary credentials.
 * 2. Run this script: `node migrateImages.js`
 * 3. It will scan the database for images starting with /uploads, upload them, and update the DB.
 */

require('dotenv').config();
const { Car } = require('./src/models');
const cloudinary = require('./src/config/cloudinary');
const path = require('path');
const fs = require('fs');

async function migrateImages() {
  try {
    console.log('Connecting to database...');
    const cars = await Car.findAll();
    
    let updatedCount = 0;

    for (const car of cars) {
      if (!car.imageUrl) continue;
      
      let imageUrls = [];
      try {
        if (car.imageUrl.startsWith('[')) {
          imageUrls = JSON.parse(car.imageUrl);
        } else {
          imageUrls = [car.imageUrl];
        }
      } catch (e) {
        imageUrls = [car.imageUrl];
      }

      let needsUpdate = false;
      const newUrls = [];

      for (let url of imageUrls) {
        if (url.startsWith('/uploads')) {
          console.log(`Migrating image ${url} for Car ID ${car.id}...`);
          
          const localPath = path.join(__dirname, url);
          if (fs.existsSync(localPath)) {
            // Upload to cloudinary
            try {
              const result = await cloudinary.uploader.upload(localPath, {
                folder: 'chgouri-car'
              });
              newUrls.push(result.secure_url);
              needsUpdate = true;
              console.log(` -> Success: ${result.secure_url}`);
            } catch (err) {
              console.error(` -> Cloudinary Error for ${url}:`, err.message);
              newUrls.push(url); // Keep old one if fails
            }
          } else {
            console.error(` -> Local file not found: ${localPath}`);
            newUrls.push(url); // Keep old one if not found locally
          }
        } else {
          newUrls.push(url);
        }
      }

      if (needsUpdate) {
        await car.update({ imageUrl: JSON.stringify(newUrls) });
        updatedCount++;
        console.log(`Car ID ${car.id} updated in DB.`);
      }
    }

    console.log(`Migration complete! ${updatedCount} cars updated.`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateImages();
