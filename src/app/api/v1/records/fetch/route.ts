import { NextRequest, NextResponse } from 'next/server';
import { withApiAuth } from '@/lib/api/auth';
import { adminDb } from '@/lib/api/admin';
import { HealthRecord } from '@/lib/types';

/**
 * POST /api/v1/records/fetch
 * 
 * Secure interoperability API for fetching unified patient health records.
 * Allows Hospital C to fetch aggregated data from Hospital A and Hospital B.
 * 
 * Security:
 * - API key authentication
 * - Institution validation (ACTIVE status)
 * - Role validation (healthcare_provider only)
 * - Patient consent enforcement
 * - Audit logging
 * - Emergency override support
 */
const fetchUnifiedRecordHandler = async (
    req: NextRequest,
    context: { params: any; institution: any; role: any }
) => {
    const { institution, role } = context;

    try {
        // Check if adminDb is available
        if (!adminDb) {
            return NextResponse.json({ 
                error: 'Service Unavailable: Database connection not available.' 
            }, { status: 503 });
        }

        // Parse request body
        const body = await req.json();
        const { patient_id, emergency } = body;

        if (!patient_id) {
            return NextResponse.json({ 
                error: 'Bad Request: patient_id is required in the request body.' 
            }, { status: 400 });
        }

        // STEP 1: Check if patient exists
        const patientRef = adminDb.collection('patients').doc(patient_id);
        const patientSnap = await patientRef.get();

        if (!patientSnap.exists) {
            return NextResponse.json({ 
                error: 'Not Found: Patient not found.' 
            }, { status: 404 });
        }

        const patientData = patientSnap.data();

        // STEP 2: Consent enforcement (skip for emergency access)
        if (!emergency) {
            const consentRef = adminDb.collection('consents').doc(patient_id);
            const consentSnap = await consentRef.get();

            if (!consentSnap.exists || !consentSnap.data()?.granted) {
                // Log denied access
                await adminDb.collection('access_logs').add({
                    institution_id: institution.institution_id,
                    patient_id: patient_id,
                    accessed_by_role: role,
                    access_denied: true,
                    reason: 'Patient consent not granted',
                    timestamp: new Date().toISOString(),
                });

                return NextResponse.json({ 
                    error: 'Forbidden: Patient consent not granted or patient consent record not found.' 
                }, { status: 403 });
            }
        }

        // STEP 3: Fetch all health records for this patient from ALL institutions
        const recordsRef = adminDb.collection('records');
        const recordsQuery = recordsRef.where('patient_id', '==', patient_id);
        const recordsSnap = await recordsQuery.get();

        if (recordsSnap.empty) {
            return NextResponse.json({ 
                error: 'Not Found: No health records found for this patient.' 
            }, { status: 404 });
        }

        // STEP 4: Aggregate records from multiple institutions
        const records: HealthRecord[] = [];
        const accessedInstitutions = new Set<string>();

        recordsSnap.forEach(doc => {
            const record = doc.data() as HealthRecord;
            records.push(record);
            accessedInstitutions.add(record.institution_id);
        });

        // STEP 5: Build unified response
        let unifiedResponse: any;

        if (emergency) {
            // Emergency access: Return ONLY critical data
            const allAllergies = new Set<string>();
            const allConditions = new Set<string>();
            let bloodGroup = '';

            records.forEach(record => {
                if (record.blood_group) bloodGroup = record.blood_group;
                record.allergies?.forEach(allergy => allAllergies.add(allergy));
                record.conditions?.forEach(condition => allConditions.add(condition));
            });

            unifiedResponse = {
                patient_id: patient_id,
                name: patientData?.name || 'Unknown',
                blood_group: bloodGroup,
                allergies: Array.from(allAllergies),
                chronic_conditions: Array.from(allConditions),
                emergency_access: true,
                last_updated: new Date().toISOString(),
            };

            // Log emergency access
            await adminDb.collection('emergency_access_logs').add({
                log_id: `ELOG_${Date.now()}`,
                patient_id: patient_id,
                institution_id: institution.institution_id,
                accessed_from: Array.from(accessedInstitutions),
                accessed_by_role: role,
                reason: 'Emergency access',
                timestamp: new Date().toISOString(),
            });

        } else {
            // Normal access: Return full aggregated data
            const allConditions = new Set<string>();
            const allMedications = new Set<string>();
            const allAllergies = new Set<string>();
            let bloodGroup = '';
            let mostRecentUpdate = '';

            records.forEach(record => {
                if (record.blood_group) bloodGroup = record.blood_group;
                record.conditions?.forEach(condition => allConditions.add(condition));
                record.medications?.forEach(medication => allMedications.add(medication));
                record.allergies?.forEach(allergy => allAllergies.add(allergy));
                
                if (!mostRecentUpdate || record.last_updated > mostRecentUpdate) {
                    mostRecentUpdate = record.last_updated;
                }
            });

            unifiedResponse = {
                patient_id: patient_id,
                name: patientData?.name || 'Unknown',
                blood_group: bloodGroup,
                conditions: Array.from(allConditions),
                medications: Array.from(allMedications),
                allergies: Array.from(allAllergies),
                last_updated: mostRecentUpdate || new Date().toISOString(),
            };

            // STEP 6: Audit logging for normal access
            await adminDb.collection('access_logs').add({
                institution_id: institution.institution_id,
                patient_id: patient_id,
                accessed_from: Array.from(accessedInstitutions),
                accessed_by_role: role,
                access_denied: false,
                timestamp: new Date().toISOString(),
            });
        }

        return NextResponse.json(unifiedResponse, { status: 200 });

    } catch (error: any) {
        console.error('Error fetching unified record:', error);
        return NextResponse.json({ 
            error: 'Internal Server Error',
            message: error.message 
        }, { status: 500 });
    }
};

// Export POST method wrapped with authentication
// Only healthcare_provider role can access this endpoint
export const POST = withApiAuth(fetchUnifiedRecordHandler, ['healthcare_provider']);
