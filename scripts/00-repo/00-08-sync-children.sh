#!/usr/bin/env bash
# Sync children from origin, including submodules registered in .gitmodules
# that have not been cloned yet. Phase A clones missing children (never via
# `git submodule update`, which would detach every child onto the recorded
# SHA). Phase B switches every cloned child onto main (dirty worktrees are
# left alone and reported). Phase C delegates to 00-03-pull.sh.
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")/../lib" && pwd)/common.sh"

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

submodule_entries() {
  local name path url
  while IFS= read -r name; do
    path="$(git config -f "$WORKSPACE_ROOT/.gitmodules" --get "submodule.$name.path")"
    url="$(git config -f "$WORKSPACE_ROOT/.gitmodules" --get "submodule.$name.url")"
    printf '%s\t%s\n' "$path" "$url"
  done < <(git config -f "$WORKSPACE_ROOT/.gitmodules" --name-only --get-regexp '^submodule\..*\.url$' \
    | sed -E 's/^submodule\.(.*)\.url$/\1/' | sort)
}

cloned=0 onmain=0 skipped=0 failed=0
failed_paths=()

note_skip() { echo "  skipped: $1"; skipped=$((skipped + 1)); }
note_fail() { echo "  FAILED: $1"; failed=$((failed + 1)); failed_paths+=("$2"); }

# Phase A: clone children registered in .gitmodules but not yet present.
while IFS=$'\t' read -r path url; do
  target="$WORKSPACE_ROOT/$path"
  [ -e "$target/.git" ] && continue
  echo "==> $path"
  if [ -d "$target" ] && [ -n "$(ls -A "$target" 2>/dev/null)" ]; then
    note_skip "non-empty placeholder without .git; not cloning over it"
    continue
  fi
  mkdir -p "$target"
  if git clone "$url" "$target"; then
    cloned=$((cloned + 1))
  else
    note_fail "git clone failed" "$path"
  fi
done < <(submodule_entries)

# Phase B: every cloned child on main.
while IFS=$'\t' read -r path _url; do
  target="$WORKSPACE_ROOT/$path"
  [ -e "$target/.git" ] || continue
  echo "==> $path"
  (
    cd "$target"
    current="$(git symbolic-ref --short -q HEAD || true)"
    if [ "$current" = "main" ]; then
      exit 0
    fi
    if [ -n "$(git status --porcelain)" ]; then
      echo "  skipped: dirty worktree; left on ${current:-detached HEAD}"
      exit 2
    fi
    if git show-ref --verify --quiet refs/heads/main; then
      git switch main
    else
      git fetch origin --prune --quiet
      if git show-ref --verify --quiet refs/remotes/origin/main; then
        git switch -c main --track origin/main
      else
        echo "  skipped: no local or origin main branch; left on ${current:-detached HEAD}"
        exit 2
      fi
    fi
  )
  rc=$?
  case "$rc" in
    0) onmain=$((onmain + 1)) ;;
    2) skipped=$((skipped + 1)) ;;
    *) note_fail "could not switch to main (rc=$rc)" "$path" ;;
  esac
done < <(submodule_entries)

echo
echo "[sync-children] cloned=$cloned on-main=$onmain skipped=$skipped failed=$failed"
if [ "$failed" -gt 0 ]; then
  printf '  failed: %s\n' "${failed_paths[@]}"
  exit 1
fi

# Phase C: pull the newest version of every cloned child.
"$DIR/00-03-pull.sh"
