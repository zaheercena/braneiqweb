#!/usr/bin/env bash
set -euo pipefail

APP_DIR=/var/www/braneiq-web

sudo tee /etc/nginx/sites-available/braneiq-web > /dev/null <<'NGINX'
server {
    listen 80;
    server_name braneiq.com www.braneiq.com;

    location /_next/static {
        alias /var/www/braneiq-web/apps/marketing/.next/static;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINX

sudo ln -sf /etc/nginx/sites-available/braneiq-web /etc/nginx/sites-enabled/braneiq-web
sudo nginx -t
sudo systemctl reload nginx

sudo tee "$APP_DIR/.env" > /dev/null <<'ENV'
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
NEXT_PUBLIC_SITE_URL=https://braneiq.com
NEXT_PUBLIC_APP_URL=https://app.braneiq.com
NEXT_PUBLIC_GTM_ID=GTM-5GWN244W
ENV

if pm2 list | grep -q "braneiq-web"; then
  pm2 delete braneiq-web
fi

pm2 start "$APP_DIR/apps/marketing/server.js" \
  --name braneiq-web \
  --cwd "$APP_DIR" \
  --update-env

pm2 save
