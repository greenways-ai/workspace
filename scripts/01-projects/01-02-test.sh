#!/usr/bin/env bash
# Test every repo, dispatched by project type. Repos with no test step are skipped.
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")/../lib" && pwd)/common.sh"

npm_has_script() { grep -A20 '"scripts"' "$1/package.json" 2>/dev/null | grep -q "\"$2\""; }

test_repo() {
  # A checked-in ./lein launcher wins over Makefile: a repo with a test/
  # directory makes 'make -n test' succeed vacuously ("up to date") even when
  # no test target exists.
  if [ -f project.clj ] && [ -x ./lein ]; then
    ./lein test
  elif [ -f Makefile ] && make -n test >/dev/null 2>&1; then
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

each_repo_all test -- test_repo
