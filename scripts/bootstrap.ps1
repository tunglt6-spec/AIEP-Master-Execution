# AIEP bootstrap (Windows PowerShell). Verifies the environment and runs the quality gates.
$ErrorActionPreference = 'Stop'
Set-Location (Join-Path $PSScriptRoot '..')

Write-Host "== AIEP bootstrap =="

try { $nodeMajor = [int](node -p "process.versions.node.split('.')[0]") } catch { $nodeMajor = 0 }
if ($nodeMajor -lt 18) {
  Write-Error "Node.js >= 18 is required (found: $(node --version 2>$null))."
  exit 1
}
Write-Host "Node.js: $(node --version)"

# Zero runtime dependencies: nothing to install. Verify the CLI loads.
node bin/aiep.js --version | Out-Null
Write-Host "CLI: ok"

Write-Host "-- doctor --"
node bin/aiep.js doctor

Write-Host "-- validate --"
node bin/aiep.js validate

Write-Host "Bootstrap complete. Try: node bin/aiep.js status"
