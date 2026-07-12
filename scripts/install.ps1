# AIEP install (Windows PowerShell). Installs the `aiep` CLI globally from this repo.
$ErrorActionPreference = 'Stop'
Set-Location (Join-Path $PSScriptRoot '..')

Write-Host "Installing AIEP CLI globally (npm install -g .) ..."
npm install -g .
Write-Host "Done. Verify with: aiep --version; aiep doctor"
