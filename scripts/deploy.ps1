# Deploy LeetLens backend to Firebase
# Prerequisites: run `npx firebase-tools login` once first

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot

Write-Host "==> Building extension bundles..." -ForegroundColor Cyan
Set-Location $Root
npm run build

Write-Host "==> Building Cloud Functions..." -ForegroundColor Cyan
Set-Location "$Root\functions"
npm run build

Set-Location $Root

$Project = "automation-of-electricity"

Write-Host "==> Deploying Firestore rules and indexes..." -ForegroundColor Cyan
npx firebase-tools deploy --only firestore:rules,firestore:indexes --project $Project

# Set secrets if env vars are present (one-time setup)
if ($env:RESEND_API_KEY) {
  Write-Host "==> Setting RESEND_API_KEY secret..." -ForegroundColor Cyan
  $env:RESEND_API_KEY | npx firebase-tools functions:secrets:set RESEND_API_KEY --project $Project --force
}
if ($env:EMAIL_FROM) {
  Write-Host "==> Setting EMAIL_FROM secret..." -ForegroundColor Cyan
  $env:EMAIL_FROM | npx firebase-tools functions:secrets:set EMAIL_FROM --project $Project --force
}

Write-Host "==> Deploying Cloud Functions..." -ForegroundColor Cyan
npx firebase-tools deploy --only functions --project $Project

Write-Host "`nDeploy complete!" -ForegroundColor Green
