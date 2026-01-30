'use client';

import React, { useMemo, type ReactNode, useEffect, useState, useRef } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';

function Seeder() {
    const [isSeeding, setIsSeeding] = useState(false);
    const [seedComplete, setSeedComplete] = useState(false);
    const [error, setError] = useState<string | null>(null);
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
            setSeedComplete(true);
            return;
        }

        const seedDatabase = async () => {
            setIsSeeding(true);
            setError(null);
            try {
                const response = await fetch('/api/v1/seed', { method: 'POST' });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `Failed to seed database: ${response.statusText}`);
                }
                const result = await response.json();
                console.log(result.message);
                // Mark seeding as complete in local storage
                localStorage.setItem('db_seeded_v2', 'true');
                setSeedComplete(true);
            } catch (err: any) {
                console.error("Error seeding database:", err);
                setError(err.message);
            } finally {
                setIsSeeding(false);
            }
        };

        seedDatabase();
    }, []);

    // Optionally render seeding status to the UI for debugging
    if (isSeeding) {
        return <div style={{ position: 'fixed', top: 0, left: 0, background: 'rgba(0,0,0,0.5)', color: 'white', padding: '10px', zIndex: 1000 }}>Seeding database...</div>;
    }
    if (error) {
        return <div style={{ position: 'fixed', top: 0, left: 0, background: 'rgba(255,0,0,0.7)', color: 'white', padding: '10px', zIndex: 1000 }}>Seeding Error: {error}</div>;
    }

    return null; // This component does not render anything in production
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
