// Database Initialization and Seeding Script
// CHGOURI CAR Marrakech Car Rental

const mysql = require('mysql2/promise');
const { loadEnv } = require('./loadEnv');
loadEnv();

const { getDbConfig, logDbConfig } = require('./dbConfig');

const db = getDbConfig();
logDbConfig(db);

const connectionConfig = {
  host: db.host,
  port: db.port,
  user: db.user,
  password: db.password,
  database: db.database,
  multipleStatements: true
};

if (db.host !== 'localhost' && db.host !== '127.0.0.1') {
  connectionConfig.ssl = {
    rejectUnauthorized: false
  };
}

// Sleep helper
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function connectWithRetry(config, maxRetries = 20, delayMs = 4000) {
  for (let i = 1; i <= maxRetries; i++) {
    try {
      console.log(`🔄 Tentative ${i}/${maxRetries} de connexion au serveur MySQL...`);
      const conn = await mysql.createConnection(config);
      return conn;
    } catch (error) {
      console.error(`❌ Connection attempt ${i} failed: ${error.message}`);
      if (i === maxRetries) throw error;
      console.log(`⏳ Waiting ${delayMs/1000}s before next attempt (container might be starting)...`);
      await sleep(delayMs);
    }
  }
}

async function initializeDatabase() {
  let connection;

  try {
    connection = await connectWithRetry(connectionConfig);

    console.log('✅ Connected to MySQL server successfully.');

    // Drop tables in correct order
    console.log('🗑️  Dropping existing tables...');
    await connection.query('SET FOREIGN_KEY_CHECKS = 0;');
    await connection.query('DROP TABLE IF EXISTS bookings;');
    await connection.query('DROP TABLE IF EXISTS cars;');
    await connection.query('DROP TABLE IF EXISTS users;');
    await connection.query('DROP TABLE IF EXISTS messages;');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1;');

    // Create tables
    console.log('🏗️  Creating tables...');

    await connection.query(`
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        otp_code VARCHAR(255) NULL,
        otp_expires TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE cars (
        id INT AUTO_INCREMENT PRIMARY KEY,
        brand VARCHAR(100) NOT NULL,
        model VARCHAR(100) NOT NULL,
        year INT NOT NULL,
        category VARCHAR(100) DEFAULT 'Economy',
        price_per_day DECIMAL(10, 2) NOT NULL,
        price_per_week DECIMAL(10, 2) NOT NULL,
        price_per_month DECIMAL(10, 2) NOT NULL,
        image_url TEXT NOT NULL,
        features TEXT NULL,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        car_id INT NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(100) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        pickup_date DATE NOT NULL,
        return_date DATE NOT NULL,
        pickup_location VARCHAR(255) NOT NULL,
        return_location VARCHAR(255) NOT NULL,
        booking_status ENUM('pending', 'contacted', 'confirmed', 'cancelled') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
        INDEX idx_booking_status (booking_status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100) NOT NULL,
        subject VARCHAR(255) NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Seed admin user (password: ChgouriAdmin2026!)
    console.log('👤 Seeding admin user...');
    await connection.query(`
      INSERT INTO users (name, email, password_hash, phone, role) VALUES 
      ('Abdelali LACHGAR', 'admin@chgouricar.com', '$2a$12$YJz1oTzb74Ju5YFg1HExQeWy.YBURJ6oS8WF3KKAbLNd60uk5BVtS', '+212661901873', 'admin');
    `);

    // Seed cars
    console.log('🚗 Seeding cars...');
    await connection.query(`
      INSERT INTO cars (brand, model, year, category, price_per_day, price_per_week, price_per_month, image_url, features) VALUES 
      ('Hyundai', 'i10', 2024, 'Economy', 250.00, 220.00, 180.00, '["https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=600"]', 'Climatisation, Manuelle, Essence, 5 Places'),
      ('Dacia', 'Sandero Stepway', 2024, 'Economy', 300.00, 270.00, 220.00, '["https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&q=80&w=600"]', 'Climatisation, Manuelle, Diesel, 5 Places'),
      ('Renault', 'Clio 5', 2023, 'Economy', 320.00, 290.00, 240.00, '["https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=600"]', 'Climatisation, Manuelle, Diesel, 5 Places'),
      ('Kia', 'Picanto', 2024, 'Economy', 260.00, 230.00, 190.00, '["https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&q=80&w=600"]', 'Climatisation, Automatique, Essence, 5 Places');
    `);

    console.log('🎉 Database initialized and seeded successfully!');
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message || error);
    console.error('🔍 Full error:', JSON.stringify(error, null, 2));
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

initializeDatabase();
