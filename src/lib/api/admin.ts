import admin from 'firebase-admin';

// This logic ensures that we don't try to initialize the app more than once.
if (!admin.apps.length) {
  try {
    // When deployed to a Google Cloud environment (like Cloud Run or App Hosting),
    // the Admin SDK can automatically discover credentials.
    // Locally, you must set the GOOGLE_APPLICATION_CREDENTIALS environment variable.
    admin.initializeApp();
  } catch (e) {
    console.error('Firebase admin initialization error', e);
  }
}

// Export the initialized firestore instance for use in our API routes.
export const adminDb = admin.firestore();
