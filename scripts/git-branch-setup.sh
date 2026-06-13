#!/bin/bash
# Safe script to ensure we're on main branch
set -e

CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || true)

if [ "$CURRENT_BRANCH" = "main" ]; then
  echo "Already on main branch"
elif git show-ref --verify --quiet refs/heads/main; then
  echo "Switching to existing main branch"
  git checkout main
else
  echo "Creating main branch"
  git checkout -b main
fi

git push -u origin main
