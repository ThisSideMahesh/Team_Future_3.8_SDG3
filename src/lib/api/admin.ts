import admin from 'firebase-admin';

// This logic ensures that we don't try to initialize the app more than once.
if (!admin.apps.length) {
  try {
    // Try to initialize with application default credentials or environment variables
    // For Firebase projects, this works with GOOGLE_APPLICATION_CREDENTIALS env var
    // or when running on GCP infrastructure
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || 'studio-7991718670-8b73e',
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
    // Initialize without credentials for development (will use emulator if available)
    try {
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || 'studio-7991718670-8b73e',
        credential: admin.credential.applicationDefault(),
      });
    } catch (fallbackError) {
      console.warn('Firebase Admin initialization failed. Database seeding will not work.');
    }
  }
}

// Export the initialized firestore instance for use in our API routes.
export const adminDb = admin.apps.length > 0 ? admin.firestore() : null as any;
