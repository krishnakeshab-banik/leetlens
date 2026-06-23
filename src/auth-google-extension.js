import {
  GoogleAuthProvider,
  signInWithCredential
} from 'firebase/auth';
import { getFirebaseAuth } from './firebase-init.js';
import { ensureAuthPersistence } from './auth-shared.js';

function getGoogleWebClientId() {
  if (typeof __FIREBASE_GOOGLE_WEB_CLIENT_ID__ !== 'undefined' && __FIREBASE_GOOGLE_WEB_CLIENT_ID__) {
    return __FIREBASE_GOOGLE_WEB_CLIENT_ID__;
  }
  return '';
}

function getExtensionRedirectUri() {
  return `https://${chrome.runtime.id}.chromiumapp.org/`;
}

function parseOAuthRedirect(url) {
  const hash = url.includes('#') ? url.split('#')[1] : '';
  const query = url.includes('?') ? url.split('?').slice(1).join('?').split('#')[0] : '';
  const params = new URLSearchParams(hash || query);
  return {
    idToken: params.get('id_token'),
    accessToken: params.get('access_token'),
    error: params.get('error'),
    errorDescription: params.get('error_description')
  };
}

function launchGoogleOAuthFlow(authUrl) {
  return new Promise((resolve, reject) => {
    chrome.identity.launchWebAuthFlow({ url: authUrl, interactive: true }, (redirectUrl) => {
      const err = chrome.runtime.lastError;
      if (err) {
        if (/canceled|closed|user/i.test(err.message)) {
          reject(Object.assign(new Error('Sign-in cancelled.'), { code: 'auth/popup-closed-by-user' }));
          return;
        }
        reject(new Error(err.message));
        return;
      }
      if (!redirectUrl) {
        reject(Object.assign(new Error('Sign-in cancelled.'), { code: 'auth/popup-closed-by-user' }));
        return;
      }
      resolve(redirectUrl);
    });
  });
}

function createOAuthNonce() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

/** MV3-safe Google sign-in: chrome.identity + Firebase signInWithCredential (no remote scripts). */
export async function signInWithGoogleExtension() {
  const clientId = getGoogleWebClientId();
  if (!clientId) {
    throw new Error(
      'Firebase Google Web Client ID missing. In Firebase Console → Authentication → Sign-in method → Google, copy the Web client ID into .env as VITE_FIREBASE_GOOGLE_WEB_CLIENT_ID, then run npm run build.'
    );
  }

  const redirectUri = getExtensionRedirectUri();
  const nonce = createOAuthNonce();
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('response_type', 'id_token token');
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', 'openid email profile');
  authUrl.searchParams.set('prompt', 'select_account');
  authUrl.searchParams.set('nonce', nonce);

  const responseUrl = await launchGoogleOAuthFlow(authUrl.toString());
  const { idToken, accessToken, error, errorDescription } = parseOAuthRedirect(responseUrl);

  if (error) {
    throw new Error(errorDescription || error);
  }
  if (!idToken) {
    throw new Error('No ID token received from Google. Ensure the OAuth redirect URI is authorized for this extension.');
  }

  const auth = getFirebaseAuth();
  await ensureAuthPersistence(auth);
  const credential = GoogleAuthProvider.credential(idToken, accessToken || null);
  credential.nonce = nonce;
  const result = await signInWithCredential(auth, credential);
  return result.user;
}

export function getExtensionOAuthRedirectUri() {
  return getExtensionRedirectUri();
}
