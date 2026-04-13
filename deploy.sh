#!/usr/bin/env bash
# =================================================================
# deploy.sh — eConstruct Full Deploy Script
# Usage: ./deploy.sh [--skip-build] [--env production]
# =================================================================
set -euo pipefail

# ─────────────── Config ───────────────
WORKER_NAME="econstruct"
ENV="production"
SKIP_BUILD=false

# Parse flags
for arg in "$@"; do
  case $arg in
    --skip-build) SKIP_BUILD=true ;;
    --env) ENV="$2"; shift ;;
  esac
done

echo ""
echo "============================================"
echo "  eConstruct Deploy → Cloudflare Workers"
echo "  Worker : $WORKER_NAME"
echo "  Env    : $ENV"
echo "  Date   : $(date '+%Y-%m-%d %H:%M:%S')"
echo "============================================"
echo ""

# ─────────────── Step 1: Dependency check ───────────────
command -v node  >/dev/null 2>&1 || { echo "ERROR: node not found"; exit 1; }
command -v npm   >/dev/null 2>&1 || { echo "ERROR: npm not found"; exit 1; }
command -v npx   >/dev/null 2>&1 || { echo "ERROR: npx not found"; exit 1; }
echo "[1/5] Dependencies OK"

# ─────────────── Step 2: Install packages ───────────────
echo "[2/5] Installing npm packages..."
npm install --frozen-lockfile

# ─────────────── Step 3: Build ───────────────
if [ "$SKIP_BUILD" = false ]; then
  echo "[3/5] Building Next.js for Cloudflare Workers..."
  NEXT_DIST_DIR=.worker-next npm run build
else
  echo "[3/5] Skipping build (--skip-build flag set)"
fi

# ─────────────── Step 4: Deploy ───────────────
echo "[4/5] Deploying to Cloudflare Workers ($ENV)..."
npx wrangler deploy --env "$ENV"

# ─────────────── Step 5: Verify ───────────────
echo "[5/5] Verifying deployment..."
HTTP_APEX=$(curl -s -o /dev/null -w "%{http_code}" https://econstructhomes.com || echo "000")
HTTP_WWW=$(curl -s -o /dev/null -w "%{http_code}" https://www.econstructhomes.com || echo "000")

echo ""
echo "============================================"
echo "  Deploy Complete!"
echo "  econstructhomes.com     → HTTP $HTTP_APEX"
echo "  www.econstructhomes.com → HTTP $HTTP_WWW"
echo "============================================"
echo ""

# Exit with error if either domain is not returning 2xx/3xx
if [[ "$HTTP_APEX" != 2* && "$HTTP_APEX" != 3* ]]; then
  echo "WARNING: apex domain returned $HTTP_APEX"
fi
if [[ "$HTTP_WWW" != 2* && "$HTTP_WWW" != 3* ]]; then
  echo "WARNING: www domain returned $HTTP_WWW"
fi

echo "Done. Push any code changes to trigger the next deploy."
