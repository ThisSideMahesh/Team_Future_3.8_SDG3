import { NextRequest, NextResponse } from 'next/server';
import { withApiAuth } from '@/lib/api/auth';
import { adminDb } from '@/lib/api/admin';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * API handler for creating a temporary patient record for unidentified patients in an emergency.
 */
const createTempPatientHandler = async (
    req: NextRequest,
    context: { params: any; institution: any; role: any }
) => {
    try {
        // Generate a temporary, human-readable, and unique ID.
        const institutionCode = context.institution.name.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, '');
        const tempId = `TEMP-${institutionCode}-${Date.now()}`;
        
        const batch = adminDb.batch();

        // 1. Create the temporary patient profile.
        const patientRef = adminDb.doc(`patients/${tempId}`);
        const patientData = {
            id: tempId,
            name: `Unidentified Patient (${tempId})`,
            email: `${tempId}@swasthyasetu.local`, // Internal-only, non-routable email
            dateOfBirth: 'N/A',
            avatarUrl: '', // No avatar for temp patients
            bloodGroup: 'Unknown',
            isTemporary: true, // Flag to identify this as a temporary record
            createdAt: FieldValue.serverTimestamp(),
            createdByInstitution: context.institution.id,
        };
        batch.set(patientRef, patientData);

        // 2. Create the corresponding consent document, defaulting to granted.
        // This is based on the principle of implied consent for emergency care for an unidentified person.
        const consentRef = adminDb.doc(`patients/${tempId}/consents/${tempId}`);
        const consentData = {
            patientId: tempId,
            granted: true,
            isImplied: true, // Flag showing consent was not explicitly given
            createdAt: FieldValue.serverTimestamp(),
        };
        batch.set(consentRef, consentData);
        
        // Commit both documents as an atomic operation.
        await batch.commit();

        return NextResponse.json({
            message: 'Temporary patient record created successfully.',
            patientId: tempId,
        }, { status: 201 });

    } catch (error) {
        console.error(`Error creating temporary patient via API:`, error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
};

// Export the POST method, restricted to 'healthcare_provider' role.
export const POST = withApiAuth(createTempPatientHandler, ['healthcare_provider']);
