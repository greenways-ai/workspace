#!/usr/bin/env bash
# Print detected project type(s) per repo based on top-level manifests.
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")/../lib" && pwd)/common.sh"

detect_types() {
  local repo="$1" types=""
  [ -f "$repo/Makefile" ] && types="$types make"
  [ -f "$repo/package.json" ] && types="$types npm"
  [ -f "$repo/Cargo.toml" ] && types="$types cargo"
  [ -f "$repo/bb.edn" ] && types="$types bb"
  [ -f "$repo/pyproject.toml" ] && types="$types python"
  [ -f "$repo/deps.edn" ] && types="$types clojure"
  [ -f "$repo/project.clj" ] && types="$types lein"
  types="${types# }"
  [ -n "$types" ] || types="none"
  echo "$types"
}

while IFS= read -r repo; do
  printf '%-40s %s\n' "$(relpath "$repo")" "$(detect_types "$repo")"
done < <(discover_repos)
