#!/usr/bin/env bash
# Read-only overview: branch, dirty count, ahead/behind vs upstream (not fetched;
# run 00-02-fetch.sh first for fresh numbers).
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")/../lib" && pwd)/common.sh"

while IFS= read -r repo; do
  branch="$(git -C "$repo" branch --show-current)"
  [ -n "$branch" ] || branch="(detached)"
  dirty="$(git -C "$repo" status --porcelain | wc -l | tr -d ' ')"
  line="$(relpath "$repo"): $branch"
  [ "$dirty" = "0" ] || line="$line [dirty $dirty]"
  if up="$(upstream_ref "$repo")"; then
    counts="$(git -C "$repo" rev-list --left-right --count HEAD...'@{u}' 2>/dev/null || true)"
    if [ -n "$counts" ]; then
      ahead="$(echo "$counts" | cut -f1)"
      behind="$(echo "$counts" | cut -f2)"
      [ "$ahead" = "0" ] || line="$line [ahead $ahead]"
      [ "$behind" = "0" ] || line="$line [behind $behind]"
    fi
    unset up
  fi
  has_origin "$repo" || line="$line [no-origin]"
  echo "$line"
done < <(discover_repos)

echo
echo "Note: ahead/behind is computed against the last fetch; run 00-02-fetch.sh to refresh."
