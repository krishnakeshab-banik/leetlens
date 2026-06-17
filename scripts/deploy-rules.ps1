# Deploy only Firestore rules (fixes "Missing or insufficient permissions")
# Run once: npx firebase-tools login

$ErrorActionPreference = "Stop"
Set-Location (Split-Path -Parent $PSScriptRoot)

Write-Host "Deploying Firestore rules to automation-of-electricity..." -ForegroundColor Cyan
npx firebase-tools deploy --only firestore:rules --project automation-of-electricity
Write-Host "Done. Reload the extension and sign in again." -ForegroundColor Green
