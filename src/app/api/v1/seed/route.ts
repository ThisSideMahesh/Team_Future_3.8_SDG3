import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/api/admin';
import { FieldValue } from 'firebase-admin/firestore';

const institutionsData = [
  { institution_id: "INST_001", name: "AarogyaNova Hospital", city: "Devpur", state: "Dakshin Pradesh", status: "ACTIVE", created_at: "2026-01-20T10:00:00Z" },
  { institution_id: "INST_002", name: "JeevanPath Medical Center", city: "Shantipur", state: "Madhav Pradesh", status: "ACTIVE", created_at: "2026-01-20T10:05:00Z" },
];

const usersData = [
  // Passwords will be set client-side during first login/signup for these demo accounts
  { user_id: "HP_001", name: "Dr. Aarav Mehta", email: "aarav.mehta@aarogyanova.demo", role: "healthcare_provider", institution_id: "INST_001", active: true, avatarUrl: "https://images.unsplash.com/photo-1642541724244-83d49288a86b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxkb2N0b3IlMjBwb3J0cmFpdHxlbnwwfHx8fDE3Njk3MDk2MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { user_id: "IA_001", name: "Riya Sharma", email: "admin@aarogyanova.demo", role: "institution_admin", institution_id: "INST_001", active: true, avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwwfHx8fDE3Njk4MjI0ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { user_id: "PA_001", name: "Platform Admin", email: "platform.admin@swasthyasetu.demo", role: "platform_admin", active: true, avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwwfHx8fDE3Njk4MjI0ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { user_id: "PAT_001_USER", name: "Rohit Verma", email: "rohit.verma@example.com", role: "patient", active: true, avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxwZXJzb24lMjBwb3J0cmFpdHxlbnwwfHx8fDE3Njk3NDY1MTR8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { user_id: "PAT_002_USER", name: "Anita Kulkarni", email: "anita.kulkarni@example.com", role: "patient", active: true, avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNDE5ODJ8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBwb3J0cmFpdCUyMHdvbWFufGVufDB8fHx8MTY3OTc0NjUxNA&ixlib=rb-4.1.0&q=80&w=1080" },
];

const patientsData = [
  { patient_id: "PAT_001", name: "Rohit Verma", dob: "1994-06-12", gender: "Male", primary_institution: "INST_001", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxwZXJzb24lMjBwb3J0cmFpdHxlbnwwfHx8fDE3Njk3NDY1MTR8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { patient_id: "PAT_002", name: "Anita Kulkarni", dob: "1988-02-03", gender: "Female", primary_institution: "INST_002", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNDE5ODJ8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBwb3J0cmFpdCUyMHdvbWFufGVufDB8fHx8MTY3OTc0NjUxNA&ixlib=rb-4.1.0&q=80&w=1080" },
];

const consentsData = [
  { consent_id: "CONS_001", patient_id: "PAT_001", granted: true, last_updated: "2026-01-25T09:00:00Z" },
  { consent_id: "CONS_002", patient_id: "PAT_002", granted: true, last_updated: "2026-01-25T09:10:00Z" },
];

const recordsData = [
  { record_id: "REC_001", patient_id: "PAT_001", institution_id: "INST_001", blood_group: "O+", conditions: ["Hypertension"], medications: ["Amlodipine"], allergies: ["Penicillin"], lab_reports: ["BP: 150/95"], last_updated: "2026-01-26T14:00:00Z" },
  { record_id: "REC_002", patient_id: "PAT_002", institution_id: "INST_002", blood_group: "B+", conditions: ["Type 2 Diabetes"], medications: ["Metformin"], allergies: [], lab_reports: ["HbA1c: 7.8%"], last_updated: "2026-01-26T14:10:00Z" },
];

const emergencyLogsData = [
  { log_id: "ELOG_001", patient_id: "PAT_001", healthcare_provider_id: "HP_001", institution_id: "INST_001", reason: "Patient unconscious in ER", timestamp: "2026-01-27T02:15:00Z" },
];

const apiCredentialsData = [
  { credential_id: "API_001", institution_id: "INST_001", api_key: "APIKEY_AAROGYANOVA_123", enabled: true, created_at: "2026-01-22T10:00:00Z" },
  { credential_id: "API_002", institution_id: "INST_002", api_key: "APIKEY_JEEVANPATH_456", enabled: true, created_at: "2026-01-22T10:05:00Z" },
];

export async function POST() {
    try {
        const markerDocRef = adminDb.collection('internal_meta').doc('seeding_v2');
        const markerDoc = await markerDocRef.get();

        if (markerDoc.exists) {
            return NextResponse.json({ message: 'Database already seeded.' }, { status: 200 });
        }

        const batch = adminDb.batch();

        institutionsData.forEach(data => {
            const ref = adminDb.collection('institutions').doc(data.institution_id);
            batch.set(ref, data);
        });

        usersData.forEach(data => {
            const ref = adminDb.collection('users').doc(data.user_id);
            batch.set(ref, data);
        });

        patientsData.forEach(data => {
            const ref = adminDb.collection('patients').doc(data.patient_id);
            batch.set(ref, data);
        });

        consentsData.forEach(data => {
            const ref = adminDb.collection('consents').doc(data.consent_id);
            batch.set(ref, data);
        });

        recordsData.forEach(data => {
            const ref = adminDb.collection('records').doc(data.record_id);
            batch.set(ref, data);
        });

        emergencyLogsData.forEach(data => {
            const ref = adminDb.collection('emergency_access_logs').doc(data.log_id);
            batch.set(ref, data);
        });

        apiCredentialsData.forEach(data => {
            const ref = adminDb.collection('api_credentials').doc(data.credential_id);
            batch.set(ref, data);
        });
        
        // Set the marker to prevent re-seeding
        batch.set(markerDocRef, { seededAt: FieldValue.serverTimestamp() });

        await batch.commit();

        return NextResponse.json({ message: 'Database seeded successfully with demo data.' }, { status: 201 });

    } catch (error) {
        console.error('Error seeding database:', error);
        return NextResponse.json({ error: 'Internal Server Error during seeding.' }, { status: 500 });
    }
}
