#!/usr/bin/env bash
# One-time emergency cleanup on EC2 when disk is full.
# Run on the server: bash ec2-disk-cleanup.sh
set -euo pipefail

echo "=== Disk before cleanup ==="
df -h / /var /tmp 2>/dev/null || df -h /

echo "Removing old deployment backups..."
sudo rm -rf /var/www/braneiq-web-backup-* /var/www/braneiq-web-staging

echo "Removing stale deploy archives..."
sudo rm -f /tmp/deploy.tar.gz /tmp/deploy.tar.gz.old

echo "Trimming systemd journal (keep 3 days)..."
sudo journalctl --vacuum-time=3d 2>/dev/null || true

echo "Clearing apt cache..."
sudo apt-get clean 2>/dev/null || true

echo "Flushing PM2 logs..."
pm2 flush 2>/dev/null || true

echo "=== Disk after cleanup ==="
df -h / /var /tmp 2>/dev/null || df -h /
