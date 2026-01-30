import { NextRequest, NextResponse } from 'next/server';
import { withApiAuth } from '@/lib/api/auth';
import { adminDb } from '@/lib/api/admin';
import { FieldValue } from 'firebase-admin/firestore';
import type { Patient, MedicalEvent } from '@/lib/types';

/**
 * API handler for emergency access to a patient's critical data.
 * Bypasses consent check but logs the access event.
 */
const emergencyAccessHandler = async (
    req: NextRequest,
    context: { params: { patient_id: string }; institution: any; role: any }
) => {
    const { patient_id } = context.params;
    const body = await req.json();
    const reason = body.reason;

    if (!reason) {
        return NextResponse.json({ error: 'Bad Request: "reason" is required in the request body for emergency access.' }, { status: 400 });
    }

    try {
        // Step 1: Log the emergency access event immediately.
        // This is a critical audit requirement.
        const accessLog = {
            patientId: patient_id,
            healthcareProviderId: `api:${context.institution.id}`, // Identifier for API-based access
            accessorName: `API Access from ${context.institution.name}`,
            accessorRole: 'Healthcare Provider',
            timestamp: FieldValue.serverTimestamp(), // Use server timestamp for accuracy
            reason: `EMERGENCY (API): ${reason}`,
            emergencyAccess: true,
        };
        await adminDb.collection('accessLogs').add(accessLog);

        // Step 2: Fetch critical patient data.
        const patientRef = adminDb.doc(`patients/${patient_id}`);
        const patientSnap = await patientRef.get();

        if (!patientSnap.exists()) {
            // Even if patient not found, the access attempt was logged.
            return NextResponse.json({ error: 'Patient not found.' }, { status: 404 });
        }
        const patientData = patientSnap.data() as Patient;

        // Step 3: Fetch critical medical history (Allergies, Chronic Conditions).
        const healthRecordsRef = adminDb.collection(`healthRecords/${patient_id}/records`);
        const recordsSnap = await healthRecordsRef.get();
        const criticalHistory = recordsSnap.docs
            .map(doc => doc.data() as MedicalEvent)
            .filter(event => event.type === 'Allergy' || event.type === 'Chronic Condition');

        // Step 4: Assemble and return the limited, critical-only record.
        const emergencyRecord = {
            patientId: patient_id,
            bloodGroup: patientData.bloodGroup,
            allergies: criticalHistory.filter(e => e.type === 'Allergy').map(e => e.title),
            chronicConditions: criticalHistory.filter(e => e.type === 'Chronic Condition').map(e => e.title),
        };

        return NextResponse.json(emergencyRecord);

    } catch (error) {
        console.error(`Emergency access API error for patient ${patient_id}:`, error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
};

// Export the POST method, restricted to 'healthcare_provider' role.
export const POST = withApiAuth(emergencyAccessHandler, ['healthcare_provider']);
