#!/usr/bin/env bash
# Checkout (creating if needed) the same branch in every repo.
# Repos with uncommitted changes are skipped. Usage: 02-01-branch.sh <name>
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")/../lib" && pwd)/common.sh"

if [ $# -lt 1 ] || [ -z "$1" ]; then
  echo "usage: $0 <branch-name>" >&2
  exit 64
fi
branch="$1"

branch_repo() {
  if [ -n "$(git status --porcelain)" ]; then
    echo "  skipped: uncommitted changes"
    return 2
  fi
  if git rev-parse --verify --quiet "$branch" >/dev/null; then
    git checkout "$branch"
  else
    git checkout -b "$branch"
  fi
}

each_repo "branch $branch" -- branch_repo
