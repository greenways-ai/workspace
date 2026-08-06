#!/usr/bin/env bash
# Shared helpers for workspace repo scripts. Source this file; do not execute it.

WORKSPACE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
REPO_GROUPS=(application infra technology website)

# discover_repos: print absolute path of every cloned repo (dirs with a .git entry)
discover_repos() {
  local group dir
  for group in "${REPO_GROUPS[@]}"; do
    for dir in "$WORKSPACE_ROOT/$group"/*/; do
      [ -e "${dir}.git" ] && echo "${dir%/}"
    done
  done | sort
}

# empty_dirs: print group subdirs that are not cloned repos (placeholders)
empty_dirs() {
  local group dir
  for group in "${REPO_GROUPS[@]}"; do
    for dir in "$WORKSPACE_ROOT/$group"/*/; do
      [ -e "${dir}.git" ] || echo "${dir%/}"
    done
  done | sort
}

relpath() { echo "${1#"$WORKSPACE_ROOT"/}"; }

has_origin() { git -C "$1" remote get-url origin >/dev/null 2>&1; }

upstream_ref() { git -C "$1" rev-parse --abbrev-ref '@{u}' 2>/dev/null; }

# each_repo <label> -- <cmd...>
# Run cmd serially in every discovered repo.
# Exit-code protocol per repo: 0 = ok, 2 = skipped (with printed reason), other = failed.
# Prints a summary; returns non-zero if any repo failed.
each_repo() {
  local label="$1"; shift
  [ "${1:-}" = "--" ] && shift
  local repo rc ok=0 skipped=0 failed=0
  local failed_repos=()
  while IFS= read -r repo; do
    echo "==> $(relpath "$repo")"
    if (cd "$repo" && "$@"); then
      ok=$((ok + 1))
    else
      rc=$?
      if [ "$rc" -eq 2 ]; then
        skipped=$((skipped + 1))
      else
        failed=$((failed + 1))
        failed_repos+=("$(relpath "$repo")")
      fi
    fi
  done < <(discover_repos)
  echo
  echo "[$label] ok=$ok skipped=$skipped failed=$failed"
  if [ "$failed" -gt 0 ]; then
    printf '  failed: %s\n' "${failed_repos[@]}"
    return 1
  fi
}
