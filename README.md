# BraneIQ Website

BraneIQ Website deployed on AWS EC2 via GitHub Actions.

## Overview

This repository contains only the Website (Next.js app) from the main BraneIQ monorepo, isolated for deployment on EC2.

## Structure

```
braneiqweb/
├── apps/
│   └── web/              # Next.js website application
├── packages/
│   └── shared-types/     # Shared TypeScript types (dependency of web)
├── .github/
│   └── workflows/
│       └── deploy.yml    # GitHub Actions deployment workflow
├── scripts/
│   └── setup-ec2.sh      # EC2 server setup script
├── ecosystem.config.js   # PM2 configuration
├── nginx.conf            # Nginx reverse proxy config
├── package.json
├── pnpm-workspace.yaml
└── pnpm-lock.yaml
```

## Prerequisites

- Node.js 20+
- pnpm 9.14.2
- PM2 (for process management)
- Nginx (for reverse proxy)

## Local Development

```bash
# Install dependencies
pnpm install

# Build shared types
pnpm --filter @braneiq/shared-types build

# Run development server
pnpm --filter @braneiq/web dev
```

## EC2 Server Setup

1. **SSH into your EC2 instance:**
   ```bash
   ssh -i "/Users/zaheerahmad/ssh/FlashSaleEC2.pem" ubuntu@ec2-54-234-44-76.compute-1.amazonaws.com
   ```

2. **Run the setup script:**
   ```bash
   # Copy setup script to EC2 first
   scp -i "/Users/zaheerahmad/ssh/FlashSaleEC2.pem" scripts/setup-ec2.sh ubuntu@ec2-54-234-44-76.compute-1.amazonaws.com:/tmp/
   
   # SSH and run it
   ssh -i "/Users/zaheerahmad/ssh/FlashSaleEC2.pem" ubuntu@ec2-54-234-44-76.compute-1.amazonaws.com
   sudo bash /tmp/setup-ec2.sh
   ```

3. **Configure Nginx:**
   ```bash
   # Copy nginx config
   sudo cp nginx.conf /etc/nginx/sites-available/braneiq-web
   sudo ln -sf /etc/nginx/sites-available/braneiq-web /etc/nginx/sites-enabled/
   sudo rm -f /etc/nginx/sites-enabled/default
   
   # Test and reload
   sudo nginx -t
   sudo systemctl reload nginx
   ```

4. **Setup SSL with Let's Encrypt:**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d braneiq.com -d www.braneiq.com
   ```

## GitHub Actions Setup

Add these secrets to your GitHub repository (`braneiqweb`):

| Secret | Description |
|--------|-------------|
| `EC2_HOST` | `54.234.44.76` |
| `EC2_USER` | `ubuntu` |
| `EC2_SSH_KEY` | Contents of your `FlashSaleEC2.pem` file |
| `NEXT_PUBLIC_API_URL` | Your API Gateway URL |

## Deployment

Push to the `main` branch triggers automatic deployment:

```bash
git add .
git commit -m "Deploy website"
git push origin main
```

## Manual Deployment (if needed)

```bash
# Build locally
pnpm install
pnpm --filter @braneiq/shared-types build
pnpm --filter @braneiq/web build

# Deploy manually via SCP and SSH
scp -i "~/.ssh/FlashSaleEC2.pem" -r apps/web/.next/standalone/* ubuntu@54.234.44.76:/var/www/braneiq-web/

# Restart on server
ssh -i "~/.ssh/FlashSaleEC2.pem" ubuntu@54.234.44.76 "pm2 restart braneiq-web"
```

## PM2 Commands

```bash
# Check status
pm2 status

# View logs
pm2 logs braneiq-web

# Restart app
pm2 restart braneiq-web

# Stop app
pm2 stop braneiq-web
```

## Troubleshooting

**App won't start:**
```bash
# Check logs
pm2 logs braneiq-web

# Check if port 3000 is in use
sudo lsof -i :3000

# Kill process if needed
sudo kill -9 <PID>
```

**Nginx errors:**
```bash
# Test config
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log
```

## Domain Configuration

Domain `braneiq.com` should have an A record pointing to:
- `54.234.44.76`

## Notes

- The website runs on port 3000 internally
- Nginx reverse proxies port 80/443 to 3000
- PM2 manages the Node.js process
- GitHub Actions automates deployment on push to main
