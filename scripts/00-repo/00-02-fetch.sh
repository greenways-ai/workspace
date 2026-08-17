#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")/../lib" && pwd)/common.sh"

fetch_repo() {
  if ! has_origin .; then
    echo "  skipped: no origin remote"
    return 2
  fi
  git fetch --all --prune
}

each_repo_all fetch -- fetch_repo
