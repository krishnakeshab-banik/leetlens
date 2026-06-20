import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { getFirebaseAuth } from './firebase-init.js';

const GOOGLE_WEB_CLIENT_ID = typeof __FIREBASE_GOOGLE_WEB_CLIENT_ID__ !== 'undefined'
  ? __FIREBASE_GOOGLE_WEB_CLIENT_ID__
  : '';

function parseOAuthResponse(responseUrl) {
  const fragment = responseUrl.includes('#') ? responseUrl.split('#')[1] : '';
  const query = responseUrl.includes('?') ? responseUrl.split('?').slice(1).join('?') : '';
  const params = new URLSearchParams(fragment || query);
  return {
    idToken: params.get('id_token'),
    accessToken: params.get('access_token'),
    error: params.get('error'),
    errorDescription: params.get('error_description')
  };
}

function buildGoogleAuthUrl(redirectUri, nonce) {
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.searchParams.set('client_id', GOOGLE_WEB_CLIENT_ID);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', 'id_token token');
  url.searchParams.set('scope', 'openid email profile');
  url.searchParams.set('nonce', nonce);
  url.searchParams.set('prompt', 'select_account');
  return url.toString();
}

/** MV3-safe Google sign-in — no remote scripts, uses chrome.identity only. */
export async function signInWithGooglePlatform() {
  if (!GOOGLE_WEB_CLIENT_ID) {
    throw new Error(
      'Google Web Client ID is missing. Copy it from Firebase Console → Authentication → Google → Web client ID, set VITE_FIREBASE_GOOGLE_WEB_CLIENT_ID in .env, then run npm run build.'
    );
  }
  if (!chrome?.identity?.launchWebAuthFlow) {
    throw new Error('chrome.identity.launchWebAuthFlow is not available in this context.');
  }

  const redirectUri = chrome.identity.getRedirectURL();
  const nonce = crypto.randomUUID();
  const authUrl = buildGoogleAuthUrl(redirectUri, nonce);

  const responseUrl = await new Promise((resolve, reject) => {
    chrome.identity.launchWebAuthFlow({ url: authUrl, interactive: true }, (redirectResponse) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      if (!redirectResponse) {
        reject(new Error('Sign-in cancelled.'));
        return;
      }
      resolve(redirectResponse);
    });
  });

  const { idToken, accessToken, error, errorDescription } = parseOAuthResponse(responseUrl);
  if (error) {
    throw new Error(errorDescription || error);
  }
  if (!idToken) {
    throw new Error(
      'No Google ID token received. In Google Cloud Console, add this redirect URI for your Firebase Web OAuth client: ' + redirectUri
    );
  }

  const auth = getFirebaseAuth();
  const credential = GoogleAuthProvider.credential(idToken, accessToken || null);
  const result = await signInWithCredential(auth, credential);
  return result.user;
}
