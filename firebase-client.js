/* =============================================
   Firebase client — shared across all pages
   =============================================
   Fill in YOUR_* values from:
   Firebase Console → Project Settings → Your Apps → Web app → Config
*/
const FIREBASE_CONFIG = {
  apiKey:            'AIzaSyBlYrclarUOnhQwlyv5gybKy7ClsxVhfwI',
  authDomain:        'ripples-of-healing-3cb75.firebaseapp.com',
  projectId:         'ripples-of-healing-3cb75',
  storageBucket:     'ripples-of-healing-3cb75.firebasestorage.app',
  messagingSenderId: '834119973773',
  appId:             '1:834119973773:web:b0a5fe4581b57899201bc4',
  measurementId:     'G-GM168GZKEY',
};

firebase.initializeApp(FIREBASE_CONFIG);
const fbAuth = firebase.auth();
const fbDb   = firebase.firestore();
const fbGoogleProvider = new firebase.auth.GoogleAuthProvider();
fbGoogleProvider.setCustomParameters({ prompt: 'select_account' });

// Waits for Firebase auth to resolve the initial state, then returns user (or null)
function fbGetUser() {
  return new Promise(resolve => {
    const unsub = fbAuth.onAuthStateChanged(user => { unsub(); resolve(user); });
  });
}

// Maps Firebase error codes to human-readable messages
function fbErrorMsg(err) {
  const map = {
    'auth/wrong-password':         'Incorrect password. Please try again.',
    'auth/invalid-credential':     'Incorrect email or password.',
    'auth/user-not-found':         'No account found with that email.',
    'auth/invalid-email':          'Invalid email address.',
    'auth/email-already-in-use':   'An account with this email already exists.',
    'auth/weak-password':          'Password is too weak — use at least 8 characters.',
    'auth/too-many-requests':      'Too many attempts. Please wait a moment and try again.',
    'auth/requires-recent-login':  'For security, please log out and log back in before making this change.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/popup-closed-by-user':   '',
    'auth/popup-blocked':          'Popup blocked. Please allow popups for this site and try again.',
  };
  return map[err?.code] || err?.message || 'Something went wrong. Please try again.';
}
