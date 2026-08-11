#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=../lib/common.sh
source "$SCRIPT_DIR/../lib/common.sh"

if ! git lfs version >/dev/null 2>&1; then
  echo "Git LFS is required. Install it from https://git-lfs.com/ and rerun make repo-lfs." >&2
  exit 1
fi

git -C "$WORKSPACE_ROOT" lfs install --local
git -C "$WORKSPACE_ROOT" lfs pull

echo
echo "Workspace LFS objects:"
git -C "$WORKSPACE_ROOT" lfs ls-files || true
