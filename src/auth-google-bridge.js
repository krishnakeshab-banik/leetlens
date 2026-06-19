import { initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup
} from 'firebase/auth';
import { firebaseConfig } from './config.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function postToParent(payload, parentOrigin) {
  if (!parentOrigin) return;
  window.parent.postMessage(JSON.stringify(payload), parentOrigin);
}

window.addEventListener('message', async (event) => {
  if (!event.data?.initAuth) return;

  const parentOrigin = event.data.parentOrigin
    || (document.location.ancestorOrigins && document.location.ancestorOrigins[0])
    || event.origin;

  try {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    provider.setCustomParameters({ prompt: 'select_account' });

    const result = await signInWithPopup(auth, provider);
    const cred = GoogleAuthProvider.credentialFromResult(result);
    if (!cred?.idToken) {
      postToParent({ ok: false, message: 'Google sign-in did not return an ID token.' }, parentOrigin);
      return;
    }

    postToParent({
      ok: true,
      idToken: cred.idToken,
      accessToken: cred.accessToken || null
    }, parentOrigin);
  } catch (err) {
    postToParent({
      ok: false,
      code: err?.code || '',
      message: err?.message || String(err)
    }, parentOrigin);
  }
});
