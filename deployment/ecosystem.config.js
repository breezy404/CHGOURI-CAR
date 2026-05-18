// PM2 Ecosystem Process Manager Descriptor
// CHGOURI CAR Marrakech Car Rental

module.exports = {
  apps: [
    {
      name: 'chgouri-car-backend',
      script: './backend/src/app.js',
      
      // Node execution settings
      instances: 'max', // Leverages all available CPU cores for scale
      exec_mode: 'cluster', // Cluster execution mode for zero downtime reloading
      watch: false,
      
      // Logging
      error_file: './logs/pm2_err.log',
      out_file: './logs/pm2_out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Environmental specifications
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    }
  ]
};
