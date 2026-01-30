import { NextRequest, NextResponse } from 'next/server';
import { withApiAuth } from '@/lib/api/auth';
import { adminDb } from '@/lib/api/admin';

/**
 * API handler for fetching a unified patient record.
 * This function is protected by `withApiAuth` which handles authentication and authorization.
 */
const getPatientRecordHandler = async (
    req: NextRequest,
    context: { params: { patient_id: string }; institution: any; role: any }
) => {
    const { patient_id } = context.params;

    try {
        // Step 1: Check patient consent using the Admin SDK (bypasses security rules).
        const consentRef = adminDb.doc(`patients/${patient_id}/consents/${patient_id}`);
        const consentSnap = await consentRef.get();

        if (!consentSnap.exists || !consentSnap.data()?.granted) {
            return NextResponse.json({ error: 'Forbidden: Patient consent not granted or patient not found.' }, { status: 403 });
        }

        // Step 2: Fetch the patient's profile.
        const patientRef = adminDb.doc(`patients/${patient_id}`);
        const patientSnap = await patientRef.get();
        
        if (!patientSnap.exists()) {
            return NextResponse.json({ error: 'Patient not found.' }, { status: 404 });
        }

        // Step 3: Fetch the patient's aggregated health records.
        const healthRecordsRef = adminDb.collection(`healthRecords/${patient_id}/records`);
        const healthRecordsSnap = await healthRecordsRef.get();
        const medicalHistory = healthRecordsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Step 4: Assemble and return the unified record.
        // This is where data from mock EMRs would be fetched and normalized in a real scenario.
        // For this demo, we return the aggregated data already stored in Firestore.
        const unifiedRecord = {
            patientProfile: { id: patientSnap.id, ...patientSnap.data() },
            medicalHistory: medicalHistory,
            last_updated: new Date().toISOString(),
            data_sources_queried: ["SwasthyaSetu Aggregated Store"],
        };

        return NextResponse.json(unifiedRecord);

    } catch (error) {
        console.error(`Error fetching record for patient ${patient_id}:`, error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
};

// Export the GET method for this route, wrapped in our authentication middleware.
// Only users with the 'healthcare_provider' role can access this.
export const GET = withApiAuth(getPatientRecordHandler, ['healthcare_provider']);
