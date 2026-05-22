const { Sequelize } = require('sequelize');

async function testConnection() {
  const url = 'mysql://root:gidThcvPmvEQMUYbYnVsxSKOWJFWImkv@kodama.proxy.rlwy.net:48402/railway';
  
  console.log('Testing without SSL...');
  const seqNoSSL = new Sequelize(url, {
    dialect: 'mysql',
    logging: false,
  });
  
  try {
    await seqNoSSL.authenticate();
    console.log('✅ Connected successfully WITHOUT SSL!');
  } catch (err) {
    console.error('❌ Failed WITHOUT SSL:', err.message);
  }
  
  console.log('\nTesting with SSL (rejectUnauthorized: false)...');
  const seqWithSSL = new Sequelize(url, {
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    }
  });
  
  try {
    await seqWithSSL.authenticate();
    console.log('✅ Connected successfully WITH SSL!');
  } catch (err) {
    console.error('❌ Failed WITH SSL:', err.message);
  }
  
  process.exit(0);
}

testConnection();
