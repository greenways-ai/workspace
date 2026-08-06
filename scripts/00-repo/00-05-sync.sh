#!/usr/bin/env bash
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

"$DIR/00-02-fetch.sh"
"$DIR/00-03-pull.sh"
