const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('chgouri_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

async function fixCars() {
  try {
    await sequelize.authenticate();
    // Use raw query to update features column string to a valid JSON array format
    // For rows where it is a simple string, encapsulate it in quotes and brackets to make it a valid JSON array
    // E.g., 'Climatisation' -> '["Climatisation"]'
    // But since it failed on ALTER, the column might not be JSON yet, or it is but contains raw text.
    // Let's just forcefully convert anything that doesn't start with '[' to '[]' or similar if possible.
    const [results] = await sequelize.query("SELECT id, features FROM cars");
    for (const car of results) {
      if (car.features && !car.features.trim().startsWith('[')) {
         let validJson;
         try {
           JSON.parse(car.features);
           validJson = car.features;
         } catch(e) {
           // It's just a string, convert to array
           const arr = car.features.split(',').map(s => s.trim()).filter(Boolean);
           validJson = JSON.stringify(arr);
         }
         await sequelize.query("UPDATE cars SET features = ? WHERE id = ?", {
           replacements: [validJson, car.id]
         });
         console.log('Fixed car id:', car.id);
      }
    }
    console.log('Cars fixed');
  } catch (err) {
    console.error('Error fixing cars:', err);
  } finally {
    process.exit(0);
  }
}

fixCars();
