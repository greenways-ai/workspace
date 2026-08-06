#!/usr/bin/env bash
# Build every repo, dispatched by project type. Repos with no build step are skipped.
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")/../lib" && pwd)/common.sh"

npm_has_script() { grep -A20 '"scripts"' "$1/package.json" 2>/dev/null | grep -q "\"$2\""; }

build_repo() {
  if [ -f Makefile ] && make -n build >/dev/null 2>&1; then
    make build
  elif [ -f package.json ] && npm_has_script . build; then
    npm run build
  elif [ -f Cargo.toml ]; then
    cargo build
  else
    echo "  skipped: no build step detected"
    return 2
  fi
}

each_repo build -- build_repo
