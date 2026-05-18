#!/bin/bash

# ==============================================================================
# CHGOURI CAR - Ubuntu VPS Deployment Script (Complete Log)
# Operating System: Ubuntu 22.04 LTS
# Target: Production release
# ==============================================================================

# Exit immediately if a command exits with a non-zero status
set -e

echo "🚀 Starting server preparation for CHGOURI CAR..."

# 1. Update system dependencies
sudo apt update && sudo apt upgrade -y

# 2. Install essential packages
sudo apt install -y curl git build-essential certbot python3-certbot-nginx mysql-server

# 3. Setup Node.js (v20.x LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify versions
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# 4. Install Global Production Managers
sudo npm install -g pm2

# 5. Setup MySQL Production Database
echo "🔧 Configuring local MySQL database..."
# Run standard MySQL security updates manually on VPS if needed:
# sudo mysql_secure_installation
# Create DB and Admin
sudo mysql -e "CREATE DATABASE IF NOT EXISTS chgouri_car_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -e "CREATE USER IF NOT EXISTS 'chgouri_user'@'localhost' IDENTIFIED BY 'ChgouriSecurePassword2026!';"
sudo mysql -e "GRANT ALL PRIVILEGES ON chgouri_car_db.* TO 'chgouri_user'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

# 6. Configure application directory structure
sudo mkdir -p /var/www/chgouricar
sudo chown -R $USER:$USER /var/www/chgouricar

# 7. Clone / copy code base to server (Run in chgouricar dir)
# git clone <repo_url> /var/www/chgouricar
# cd /var/www/chgouricar

# 8. Setup Backend configs
# cd backend
# npm install --production
# cp .env.example .env
# Wrote production details inside .env (DB credentials, storeKey, JWT secrets)
# Run db seeder to populate admin + economy fleet:
# node src/config/initDb.js

# 9. Setup Frontend builds
# cd ../frontend
# npm install
# npm run build
# (Vite output goes to dist/ folder ready to be served by Nginx)

# 10. Start NodeJS API Server with PM2
# cd ..
# pm2 start deployment/ecosystem.config.js
# Save state to survive server restarts:
# pm2 save
# pm2 startup

# 11. Configure Nginx Proxy
# Copy Nginx config file to sites-available:
# sudo cp deployment/nginx.conf /etc/nginx/sites-available/chgouricar
# sudo ln -s /etc/nginx/sites-available/chgouricar /etc/nginx/sites-enabled/
# Remove default nginx site:
# sudo rm -f /etc/nginx/sites-enabled/default
# Test and reload:
# sudo nginx -t
# sudo systemctl restart nginx

# 12. Firewall & SSL Setup
# Allow Nginx web traffic through UFW firewall:
# sudo ufw allow 'Nginx Full'
# sudo ufw enable
# Generate free Let's Encrypt SSL Certificate:
# sudo certbot --nginx -d chgouricar.com -d www.chgouricar.com

echo "🎉 Deployment preparations complete! CHGOURI CAR is ready for production."
