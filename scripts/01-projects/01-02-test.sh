#!/usr/bin/env bash
# Test every repo, dispatched by project type. Repos with no test step are skipped.
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")/../lib" && pwd)/common.sh"

npm_has_script() { grep -A20 '"scripts"' "$1/package.json" 2>/dev/null | grep -q "\"$2\""; }

test_repo() {
  if [ -f Makefile ] && make -n test >/dev/null 2>&1; then
    make test
  elif [ -f package.json ] && npm_has_script . test; then
    npm test
  elif [ -f Cargo.toml ]; then
    cargo test
  else
    echo "  skipped: no test step detected"
    return 2
  fi
}

each_repo test -- test_repo
