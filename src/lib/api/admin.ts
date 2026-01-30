import admin from 'firebase-admin';

// This logic ensures that we don't try to initialize the app more than once.
if (!admin.apps.length) {
  // The try/catch is removed. If `initializeApp` fails (e.g., due to missing
  // GOOGLE_APPLICATION_CREDENTIALS), it will now throw an exception. This prevents
  // the server from starting in a broken state and makes the root cause clear.
  admin.initializeApp();
}

// Export the initialized firestore instance for use in our API routes.
export const adminDb = admin.firestore();
