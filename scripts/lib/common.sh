#!/usr/bin/env bash
# Shared helpers for workspace repo scripts. Source this file; do not execute it.

WORKSPACE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
REPO_GROUPS=(application infra technology website)
# Reference repos are read-only migration authorities: included in status,
# fetch, pull, detection, and test operations, but excluded from push,
# force-update, and bulk commit-push.
REFERENCE_GROUPS=(reference)

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

# discover_reference_repos: print absolute path of every cloned reference repo
discover_reference_repos() {
  local group dir
  for group in "${REFERENCE_GROUPS[@]}"; do
    for dir in "$WORKSPACE_ROOT/$group"/*/; do
      [ -e "${dir}.git" ] && echo "${dir%/}"
    done
  done | sort
}

# discover_all_repos: mutable children plus read-only reference repos
# (the `|| true` guards keep a benign non-zero glob-loop status from
# short-circuiting the group under `set -e`/`pipefail` in callers)
discover_all_repos() {
  { discover_repos || true; discover_reference_repos || true; } | sort
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
  local discover="${EACH_REPO_DISCOVER:-discover_repos}"
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
  done < <("$discover")
  echo
  echo "[$label] ok=$ok skipped=$skipped failed=$failed"
  if [ "$failed" -gt 0 ]; then
    printf '  failed: %s\n' "${failed_repos[@]}"
    return 1
  fi
}

# each_repo_all: like each_repo, but includes read-only reference repos.
each_repo_all() {
  EACH_REPO_DISCOVER=discover_all_repos each_repo "$@"
}

# check_reference_pins: fail closed when a reference repo is unfit for a bulk
# workspace commit: dirty worktree, gitlink drift between the super-repo index
# and the repo HEAD, or a HEAD not reachable from any origin branch
# (potentially unpublished). Prints one error per problem; returns non-zero if
# any reference repo is unfit.
check_reference_pins() {
  local repo rel head pin rc=0
  while IFS= read -r repo; do
    rel="$(relpath "$repo")"
    if [ -n "$(git -C "$repo" status --porcelain)" ]; then
      echo "  error: $rel has uncommitted changes" >&2
      rc=1
    fi
    head="$(git -C "$repo" rev-parse HEAD)"
    pin="$(git -C "$WORKSPACE_ROOT" ls-files -s -- "$rel" | awk '{print $2}')"
    if [ -z "$pin" ]; then
      echo "  error: $rel is not recorded as a gitlink in the super-repo index" >&2
      rc=1
    elif [ "$pin" != "$head" ]; then
      echo "  error: $rel gitlink $pin differs from HEAD $head (stage or restore the pin)" >&2
      rc=1
    fi
    if has_origin "$repo" \
      && ! git -C "$repo" branch -r --contains "$head" 2>/dev/null | grep -q .; then
      echo "  error: $rel HEAD $head is not reachable from any origin branch (potentially unpublished)" >&2
      rc=1
    fi
  done < <(discover_reference_repos)
  return "$rc"
}
