#!/bin/bash
set -e

echo "=== Setting up EC2 for BraneIQ Website ==="

# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
sudo npm install -g pnpm@9.14.2

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt-get install -y nginx

# Create app directory
sudo mkdir -p /var/www/braneiq-web
sudo chown $USER:$USER /var/www/braneiq-web

# Setup PM2 to start on boot
pm2 startup systemd -u $USER --hp $HOME
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME

echo "=== EC2 Setup Complete ==="
echo "Next steps:"
echo "1. Configure Nginx (see nginx.conf example)"
echo "2. Set up GitHub Actions secrets"
echo "3. Push code to GitHub repository"
