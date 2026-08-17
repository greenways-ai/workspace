#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")/../lib" && pwd)/common.sh"

pull_repo() {
  if ! has_origin .; then
    echo "  skipped: no origin remote"
    return 2
  fi
  if ! upstream_ref . >/dev/null; then
    echo "  skipped: no upstream tracking branch"
    return 2
  fi
  git pull --rebase --autostash
}

each_repo_all pull -- pull_repo
