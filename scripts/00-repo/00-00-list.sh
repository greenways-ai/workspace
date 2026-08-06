#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")/../lib" && pwd)/common.sh"

echo "Repositories:"
discover_repos | while IFS= read -r repo; do echo "  $(relpath "$repo")"; done

echo
echo "Placeholder dirs (not cloned):"
empty_dirs | while IFS= read -r dir; do echo "  $(relpath "$dir")"; done
