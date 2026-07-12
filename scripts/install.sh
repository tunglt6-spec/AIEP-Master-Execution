#!/usr/bin/env bash
# AIEP install (macOS/Linux). Installs the `aiep` CLI globally from this repo.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "Installing AIEP CLI globally (npm install -g .) ..."
npm install -g .
echo "Done. Verify with: aiep --version && aiep doctor"
