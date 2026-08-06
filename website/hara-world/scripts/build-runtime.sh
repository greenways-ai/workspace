#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
OUT="$ROOT/extensions/hara-world/runtime"

cargo build --manifest-path "$ROOT/core/rust/Cargo.toml" \
  --target wasm32-unknown-unknown --release --lib
mkdir -p "$OUT"
wasm-bindgen --target web --out-dir "$OUT" \
  "$ROOT/core/rust/target/wasm32-unknown-unknown/release/hara_wasm.wasm"

echo "Built Hara browser runtime in $OUT"
