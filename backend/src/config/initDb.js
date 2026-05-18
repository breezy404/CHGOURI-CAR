// Database Initialization and Seeding Script
// CHGOURI CAR Marrakech Car Rental

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 3306;
const dbUser = process.env.DB_USER || 'root';
const dbPass = process.env.DB_PASS || '';
const dbName = process.env.DB_NAME || 'chgouri_db';

async function initializeDatabase() {
  console.log('🔄 Connecting to MySQL server to check/create database...');
  let connection;

  try {
    // 1. Establish connection to MySQL without specifying database first
    connection = await mysql.createConnection({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPass,
      multipleStatements: true
    });

    console.log('✅ Connected to MySQL server successfully.');

    // 2. Read schema.sql file
    const schemaPath = path.join(__dirname, '..', '..', 'schema.sql');
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`schema.sql not found at path: ${schemaPath}`);
    }

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    console.log('📖 Reading schema.sql contents...');

    // 3. Execute schema statements
    console.log(`⏳ Executing schema DDL & Seeding data in database "${dbName}"...`);
    await connection.query(schemaSql);
    
    console.log('🎉 Database initialized, structured, and seeded successfully!');
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initializeDatabase();
