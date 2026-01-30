'use client';

import React, { useMemo, type ReactNode, useEffect } from 'react';
import { FirebaseProvider, useFirestore } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import { collection, doc, getDocs, writeBatch, type Firestore } from 'firebase/firestore';
import type { Institution } from '@/lib/types';


const institutionsToSeed: Omit<Institution, 'id'>[] = [
  { name: 'AarogyaNova Hospital', city: 'Devpur', state: 'Dakshin Pradesh', type: 'Hospital', registrationId: 'DEO-HOS-001', adminEmail: 'admin@aarogyanova.demo', status: 'active' },
  { name: 'JeevanPath Medical Center', city: 'Shantipur', state: 'Madhav Pradesh', type: 'Hospital', registrationId: 'SHN-HOS-002', adminEmail: 'itadmin@jeevanpath.demo', status: 'active' },
  { name: 'SwasthiCare General Hospital', city: 'Nandigram', state: 'Aryavarta', type: 'Hospital', registrationId: 'NDG-HOS-003', adminEmail: 'admin@swasthicare.demo', status: 'active' },
  { name: 'PranaSetu Health Institute', city: 'Suryanagar', state: 'Vardhan Pradesh', type: 'Clinic', registrationId: 'SYN-CLI-001', adminEmail: 'operations@pranasetu.demo', status: 'active' },
  { name: 'ArogyaDeep Community Hospital', city: 'Deepgarh', state: 'Navbharat', type: 'Hospital', registrationId: 'DPG-HOS-004', adminEmail: 'admin@arogyadeep.demo', status: 'active' },
  { name: 'JeevanRekha Rural Health Centre', city: 'Gramsetu', state: 'Uttam Pradesh', type: 'PHC', registrationId: 'GRS-PHC-001', adminEmail: 'rhc.admin@jeevanrekha.demo', status: 'active' },
  { name: 'SwasthyaKiran Diagnostic Labs', city: 'Kiranpur', state: 'Tejas Pradesh', type: 'Diagnostic', registrationId: 'KRN-LAB-001', adminEmail: 'labs.admin@swasthyakiran.demo', status: 'active' },
  { name: 'PranaVeda Multispeciality Clinic', city: 'Vednagar', state: 'Sanjeevani Pradesh', type: 'Clinic', registrationId: 'VDN-CLI-002', adminEmail: 'admin@pranaveda.demo', status: 'active' },
  { name: 'NavArogya City Hospital', city: 'Arogyapur', state: 'Samriddhi Pradesh', type: 'Hospital', registrationId: 'AGP-HOS-005', adminEmail: 'it@navarogya.demo', status: 'active' },
  { name: 'JeevanRaksha Emergency Hospital', city: 'Rakshapur', state: 'Suraksha Pradesh', type: 'Hospital', registrationId: 'RKP-HOS-006', adminEmail: 'emergency.admin@jeevanraksha.demo', status: 'active' },
];

function Seeder({ firestore }: { firestore: Firestore }) {
    useEffect(() => {
        const seedDatabase = async (db: Firestore) => {
            try {
                const institutionsRef = collection(db, 'institutions');
                const snapshot = await getDocs(institutionsRef);
                
                // Only seed if the collection is empty.
                if (snapshot.empty) {
                    console.log("Seeding database with initial institutions...");
                    const batch = writeBatch(db);
                    
                    institutionsToSeed.forEach(inst => {
                        const docRef = doc(collection(db, 'institutions'));
                        batch.set(docRef, { ...inst, id: docRef.id });
                    });
                    
                    await batch.commit();
                    console.log("Database seeded successfully with 10 institutions.");
                }
            } catch (error) {
                console.error("Error seeding database: ", error);
            }
        };

        seedDatabase(firestore);
  }, [firestore]);

  return null; // This component does not render anything.
}


interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseServices = useMemo(() => {
    // Initialize Firebase on the client side, once per component mount.
    return initializeFirebase();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      <Seeder firestore={firebaseServices.firestore} />
      {children}
    </FirebaseProvider>
  );
}
