#!/usr/bin/env bash
set -euo pipefail

# Monorepo-style standalone layout extracted to /var/www/braneiq-web:
#   apps/marketing/server.js
#   apps/marketing/.next/
#   apps/marketing/public/
#   apps/marketing/node_modules/   (symlinks)
#   node_modules/.pnpm/            (real dependency files)
APP_DIR=/var/www/braneiq-web
APP_ROOT="$APP_DIR/apps/marketing"

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

sudo tee "$APP_ROOT/.env" > /dev/null <<ENV
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
NEXT_PUBLIC_SITE_URL=https://braneiq.com
NEXT_PUBLIC_APP_URL=https://app.braneiq.com
NEXT_PUBLIC_GTM_ID=GTM-5GWN244W
SMTP_USER=${SMTP_USER:-}
SMTP_PASS=${SMTP_PASS:-}
ENV

echo "=== Verifying deployment ==="
ls -la "$APP_ROOT/server.js"
test -f "$(readlink -f "$APP_ROOT/node_modules/next")/package.json"

if pm2 list | grep -q "braneiq-web"; then
  pm2 delete braneiq-web
fi

pm2 start "$APP_ROOT/server.js" \
  --name braneiq-web \
  --cwd "$APP_ROOT" \
  --update-env

pm2 save

echo "=== Health check ==="
sleep 2
curl -sf "http://127.0.0.1:3000/api/health"
