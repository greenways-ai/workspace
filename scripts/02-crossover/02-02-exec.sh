#!/usr/bin/env bash
# Run an arbitrary command in every repo. Usage: 02-02-exec.sh <cmd...>
# Example: 02-02-exec.sh git remote -v
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")/../lib" && pwd)/common.sh"

if [ $# -lt 1 ]; then
  echo "usage: $0 <cmd...>" >&2
  exit 64
fi

each_repo "exec: $*" -- "$@"
