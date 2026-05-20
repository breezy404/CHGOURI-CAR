const { User } = require('./src/models');
const sequelize = require('./src/config/db');

async function updateAdmin() {
  try {
    await sequelize.authenticate();
    const admin = await User.findOne({ where: { role: 'admin' } });
    if (admin) {
      admin.email = 'zakariaoukhamou11@gmail.com';
      await admin.save();
      console.log('Admin email updated to zakariaoukhamou11@gmail.com');
    } else {
      console.log('Admin not found');
    }
  } catch (err) {
    console.error('Error updating admin:', err);
  } finally {
    process.exit(0);
  }
}

updateAdmin();
