@echo off
REM Deploy LeetLens backend — run after: npx firebase-tools login

cd /d "%~dp0.."
echo Building extension...
call npm run build
cd functions
call npm run build
cd ..

set PROJECT=automation-of-electricity

echo Deploying Firestore...
call npx firebase-tools deploy --only firestore:rules,firestore:indexes --project %PROJECT%

if defined RESEND_API_KEY (
  echo Setting RESEND_API_KEY...
  echo %RESEND_API_KEY%| npx firebase-tools functions:secrets:set RESEND_API_KEY --project %PROJECT% --force
)
if defined EMAIL_FROM (
  echo Setting EMAIL_FROM...
  echo %EMAIL_FROM%| npx firebase-tools functions:secrets:set EMAIL_FROM --project %PROJECT% --force
)

echo Deploying functions...
call npx firebase-tools deploy --only functions --project %PROJECT%

echo Done.
