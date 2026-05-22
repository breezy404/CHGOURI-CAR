// Main Application Server Entry Point
// CHGOURI CAR Marrakech Car Rental

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { loadEnv } = require('./config/loadEnv');
loadEnv();

const { sequelize } = require('./models');

// Import Routers
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const messageRoutes = require('./routes/messageRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// SECURITY & OPTIMIZATION MIDDLEWARES
// ==========================================

// Enforce standard Helmet HTTP security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: true, // This allows dynamic origins (e.g. localhost:5174, localhost:5173) to work perfectly
  credentials: true
}));

// Setup express request payload parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express global rate-limiting to protect against DDoS
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // Limit each IP to 100 requests per window
  message: {
    success: false,
    message: 'Trop de requêtes provenant de cette adresse IP. Veuillez réessayer dans 15 minutes.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use('/api/', apiLimiter);

// ==========================================
// ROUTE REGISTRATION & MOUNTING
// ==========================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CHGOURI CAR Backend API online and healthy.',
    timestamp: new Date()
  });
});

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Primary resource endpoints mounting
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/uploads', uploadRoutes);

// Catch-all 404 endpoint for unmatched routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ressource API introuvable.'
  });
});

// ==========================================
// GLOBAL ERROR HANDLER MIDDLEWARE
// ==========================================
app.use((err, req, res, next) => {
  console.error('💥 Backend server uncaught exception:', err);
  
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur interne est survenue sur le serveur.'
  });
});

// ==========================================
// DB CONNECT & SERVER INIT
// ==========================================
const startServer = async () => {
  try {
    console.log('🔄 Checking database connection...');
    let authenticated = false;
    let retries = 15;
    const delayMs = 4000;
    while (!authenticated && retries > 0) {
      try {
        await sequelize.authenticate();
        authenticated = true;
      } catch (err) {
        retries--;
        console.warn(`⚠️ Database connection attempt failed. ${retries} retries remaining... Error: ${err.message}`);
        if (retries === 0) throw err;
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
    console.log('✅ Connection to MySQL database established successfully.');
    
    // Optional: Synchronize database schema locally
    // Synchronize database schema locally and add new columns
    await sequelize.sync();
    console.log('✅ Database models synchronized with schema.');

    app.listen(PORT, () => {
      console.log(`🚀 CHGOURI CAR Server operational and listening on port ${PORT} in ${process.env.NODE_ENV} mode.`);
    });
  } catch (error) {
    console.error('❌ Database connection or server initialization failed:');
    console.error(error);
    process.exit(1);
  }
};

startServer();
