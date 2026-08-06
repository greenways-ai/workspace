#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")/../lib" && pwd)/common.sh"

push_repo() {
  if ! has_origin .; then
    echo "  skipped: no origin remote"
    return 2
  fi
  if ! upstream_ref >/dev/null; then
    echo "  skipped: no upstream tracking branch"
    return 2
  fi
  local ahead
  ahead="$(git rev-list --count '@{u}..HEAD' 2>/dev/null || echo 0)"
  if [ "$ahead" -eq 0 ]; then
    echo "  skipped: nothing to push"
    return 2
  fi
  git push
}

each_repo push -- push_repo
