#!/usr/bin/env bash
# AIEP bootstrap (macOS/Linux). Verifies the environment and runs the quality gates.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "== AIEP bootstrap =="

node_major=$(node -p "process.versions.node.split('.')[0]" 2>/dev/null || echo 0)
if [ "$node_major" -lt 18 ]; then
  echo "ERROR: Node.js >= 18 is required (found: $(node --version 2>/dev/null || echo none))." >&2
  exit 1
fi
echo "Node.js: $(node --version)"

# Zero runtime dependencies: nothing to install. Verify the CLI loads.
node bin/aiep.js --version >/dev/null && echo "CLI: ok"

echo "-- doctor --"
node bin/aiep.js doctor || true

echo "-- validate --"
node bin/aiep.js validate

echo "Bootstrap complete. Try: node bin/aiep.js status"
