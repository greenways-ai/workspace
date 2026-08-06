#!/usr/bin/env bash
# Recursive commit + push: commit dirty repos (git add -A) with the given
# message, push repos that are ahead of upstream, then do the same for the
# super-repo last so updated submodule pointers are captured.
# Usage: 00-07-commit-push.sh "<message>"
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")/../lib" && pwd)/common.sh"

if [ $# -lt 1 ] || [ -z "$1" ]; then
  echo "usage: $0 <commit-message>" >&2
  exit 64
fi
message="$1"

commit_push_repo() {
  local committed=0 ahead=0
  if [ -n "$(git status --porcelain)" ]; then
    git add -A
    if ! git diff --cached --quiet; then
      git commit -m "$message"
      committed=1
    fi
  fi
  if has_origin . && upstream_ref . >/dev/null; then
    ahead="$(git rev-list --count '@{u}..HEAD' 2>/dev/null || echo 0)"
    [ "$ahead" -eq 0 ] || git push
  elif [ "$committed" -eq 1 ]; then
    echo "  note: committed locally only (no origin/upstream)"
  fi
  if [ "$committed" -eq 0 ] && [ "$ahead" -eq 0 ]; then
    echo "  skipped: nothing to commit or push"
    return 2
  fi
}

each_repo "commit-push: $message" -- commit_push_repo

# Super-repo last, so child HEADs (submodule pointers) are captured.
echo
echo "==> workspace (super-repo)"
(cd "$WORKSPACE_ROOT" && commit_push_repo) \
  || echo "  skipped: nothing to commit or push"
