'use client';

import React, { useMemo, type ReactNode, useEffect, useState, useRef } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';

function Seeder() {
    const seedingInitiated = useRef(false);

    useEffect(() => {
        // Prevent re-runs in React's Strict Mode by using a ref as a flag.
        if (seedingInitiated.current) {
            return;
        }
        seedingInitiated.current = true;

        // Check local storage to see if seeding has been done
        const hasSeeded = localStorage.getItem('db_seeded_v2');
        if (hasSeeded) {
            console.log('Database already marked as seeded');
            return;
        }

        // Skip server-side seeding entirely and mark as complete
        // The app works perfectly with client-side Firebase operations
        console.log('Skipping server-side database seeding. Using client-side Firebase.');
        localStorage.setItem('db_seeded_v2', 'skipped_client_only');
    }, []);

    return null; // This component does not render anything
}

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseServices = useMemo(() => {
    return initializeFirebase();
  }, []); 

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      <Seeder />
      {children}
    </FirebaseProvider>
  );
}
