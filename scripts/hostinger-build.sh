#!/usr/bin/env bash
set -euo pipefail
if [[ -n "${DATABASE_URL:-}" ]]; then
  npm run db:migrate
  node scripts/seed.mjs
fi
npx next build
