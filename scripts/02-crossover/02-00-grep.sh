#!/usr/bin/env bash
# Search a pattern in every repo. Usage: 02-00-grep.sh <pattern>
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")/../lib" && pwd)/common.sh"

if [ $# -lt 1 ] || [ -z "$1" ]; then
  echo "usage: $0 <pattern>" >&2
  exit 64
fi
pattern="$1"

while IFS= read -r repo; do
  echo "==> $(relpath "$repo")"
  if command -v rg >/dev/null 2>&1; then
    (cd "$repo" && rg --color=never -- "$pattern" .) || echo "  (no matches)"
  else
    (cd "$repo" && grep -r -I -n --exclude-dir=.git -- "$pattern" .) || echo "  (no matches)"
  fi
done < <(discover_repos)
