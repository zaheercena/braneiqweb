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

    location ~* \.(png|jpg|jpeg|gif|ico|svg|webp|woff|woff2|ttf|css|js)$ {
        root /var/www/braneiq-web/apps/marketing/public;
        try_files $uri @proxy;
        expires 30d;
        add_header Cache-Control "public";
    }

    location @proxy {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
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

sudo tee "$APP_DIR/.env" > /dev/null <<ENV
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
NEXT_PUBLIC_SITE_URL=https://braneiq.com
NEXT_PUBLIC_APP_URL=https://app.braneiq.com
NEXT_PUBLIC_GTM_ID=GTM-5GWN244W
SMTP_USER=${SMTP_USER}
SMTP_PASS=${SMTP_PASS}
ENV

if pm2 list | grep -q "braneiq-web"; then
  pm2 delete braneiq-web
fi

# Locate server.js — Next.js standalone puts it at the standalone root
if [ -f "$APP_DIR/server.js" ]; then
  SERVER_JS="$APP_DIR/server.js"
elif [ -f "$APP_DIR/apps/marketing/server.js" ]; then
  SERVER_JS="$APP_DIR/apps/marketing/server.js"
else
  echo "ERROR: server.js not found. Contents of $APP_DIR:"
  find "$APP_DIR" -name "server.js" | head -20
  exit 1
fi

echo "Starting PM2 with: $SERVER_JS"

pm2 start "$SERVER_JS" \
  --name braneiq-web \
  --cwd "$APP_DIR" \
  --update-env

pm2 save
