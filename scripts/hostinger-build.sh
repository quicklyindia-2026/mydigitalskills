#!/usr/bin/env bash
set -euo pipefail
if [[ -n "${DATABASE_URL:-}" ]]; then
  if npm run db:migrate; then
    node scripts/seed.mjs
  else
    echo "Database setup skipped during build. The website will still be deployed; database credentials can be corrected separately."
  fi
fi
npx next build
