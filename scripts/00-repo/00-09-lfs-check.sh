#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "$0")/../lib/common.sh"
cd "$WORKSPACE_ROOT"

if ! git lfs version >/dev/null 2>&1; then
  echo "git-lfs is required. Install it, then run: git lfs install" >&2
  exit 1
fi

media_extensions='^(glb|gltf|bin|blend|blend1|fbx|obj|mtl|stl|ply|dae|abc|3ds|vox|usd|usda|usdc|usdz|mp4|m4v|mov|webm|mkv|avi|ogv)$'
lfs_files="$(git lfs ls-files --name-only)"
checked=0
failed=0

while IFS= read -r -d '' path; do
  extension="${path##*.}"
  extension="${extension,,}"
  [[ "$extension" =~ $media_extensions ]] || continue

  checked=$((checked + 1))
  filter="$(git check-attr filter -- "$path" | sed 's/^.*: filter: //')"
  if [[ "$filter" != "lfs" ]]; then
    echo "ERROR: $path is not matched by a Git LFS attribute." >&2
    failed=1
    continue
  fi

  if ! grep -Fxq -- "$path" <<<"$lfs_files"; then
    echo "ERROR: $path is tracked by ordinary Git rather than Git LFS." >&2
    failed=1
    continue
  fi

  first_line="$(git show ":$path" 2>/dev/null | sed -n '1p')"
  if [[ "$first_line" != "version https://git-lfs.github.com/spec/v1" ]]; then
    echo "ERROR: the index entry for $path is not a Git LFS pointer." >&2
    failed=1
  fi
done < <(git ls-files -z -- assets/3d assets/video)

if (( failed != 0 )); then
  exit 1
fi

echo "Git LFS media contract is valid ($checked tracked media file(s))."
