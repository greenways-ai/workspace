#!/usr/bin/env bash
# Force-update the super-repo and every child repo to its upstream.
# Modes:
#   --stash (default)  stash uncommitted changes before resetting (recoverable
#                      via 'git stash pop' in the repo)
#   --hard             discard uncommitted changes in tracked files permanently
#                      (untracked files are left alone)
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")/../lib" && pwd)/common.sh"

mode="${1:---stash}"
case "$mode" in
  --stash|--hard) ;;
  *)
    echo "usage: $0 [--stash|--hard]" >&2
    exit 64
    ;;
esac

# 1. Super-repo
echo "==> workspace (super-repo)"
if git -C "$WORKSPACE_ROOT" rev-parse --abbrev-ref '@{u}' >/dev/null 2>&1; then
  git -C "$WORKSPACE_ROOT" pull --rebase --autostash
else
  echo "  skipped: no upstream tracking branch"
fi

# 2. Initialize not-yet-initialized submodules (status lines starting with '-').
# Plain 'git submodule update' is deliberately NOT run on initialized ones: it
# would detach every child onto the recorded SHA. Children are force-updated
# on their own branches below instead. Nested submodules (registered inside a
# child repo, not the super-repo) are initialized per-repo in step 3.
init_missing_submodules() {
  git submodule status --recursive 2>/dev/null | while IFS= read -r line; do
    case "$line" in
      -*)
        path="$(echo "$line" | awk '{print $2}')"
        echo "  init: $path"
        git submodule update --init --recursive -- "$path" \
          || echo "  warning: failed to init $path"
        ;;
    esac
  done
}

echo
echo "==> initializing missing submodules (super-repo)"
(cd "$WORKSPACE_ROOT" && init_missing_submodules)

# 3. Children
echo
force_repo() {
  if ! has_origin .; then
    echo "  skipped: no origin remote"
    return 2
  fi
  git fetch --prune origin
  # Deal with uncommitted changes first so branch switching cannot fail.
  if [ -n "$(git status --porcelain)" ]; then
    if [ "$mode" = "--stash" ]; then
      git stash push -u -m "force-update $(date +%Y%m%d-%H%M%S)"
    else
      git reset --hard HEAD
    fi
  fi
  # Ensure we're on main, tracking and matching origin/main, when it exists.
  if git show-ref --verify --quiet refs/remotes/origin/main; then
    if [ "$(git branch --show-current)" != "main" ]; then
      if git show-ref --verify --quiet refs/heads/main; then
        git checkout main
      else
        git checkout --track origin/main
      fi
    fi
    git reset --hard origin/main
  elif upstream_ref . >/dev/null; then
    # No origin/main: fall back to the current branch's upstream.
    git reset --hard '@{u}'
  else
    echo "  skipped: no origin/main and no upstream tracking branch"
    return 2
  fi
  # Initialize nested submodules registered inside this repo.
  init_missing_submodules
}

each_repo "force-update ($mode)" -- force_repo
