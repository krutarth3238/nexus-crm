const admin = require('firebase-admin');
const { getAuth } = require('firebase-admin/auth');
const config = require('./env');

let firebaseApp = null;
let attempted = false;

// Lazily initializes Firebase Admin.
// Returns null if Firebase environment variables aren't configured.
function getFirebaseApp() {
  if (attempted) return firebaseApp;

  attempted = true;

  const { projectId, clientEmail, privateKey } = config.firebase;

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  // firebase-admin v14+: admin.cert() is a top-level export,
  // admin.credential.cert() was removed.
  firebaseApp = admin.initializeApp({
    credential: admin.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });

  return firebaseApp;
}

module.exports = { getFirebaseApp, admin, getAuth };

