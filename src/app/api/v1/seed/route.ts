
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/api/admin';
import { FieldValue } from 'firebase-admin/firestore';

const institutionsData = [
  { institution_id: "INST_001", name: "AarogyaNova Hospital", city: "Devpur", state: "Dakshin Pradesh", status: "ACTIVE", created_at: "2026-01-20T10:00:00Z" },
  { institution_id: "INST_002", name: "JeevanPath Medical Center", city: "Shantipur", state: "Madhav Pradesh", status: "ACTIVE", created_at: "2026-01-20T10:05:00Z" },
  { institution_id: "INST_003", name: "SwasthiCare General Hospital", city: "Anand Nagar", state: "Uttar Pradesh", status: "PENDING", created_at: "2026-01-21T11:00:00Z" },
  { institution_id: "INST_004", name: "PranaSetu Health Institute", city: "Gyanpur", state: "Vigyan Pradesh", status: "ACTIVE", created_at: "2026-01-21T11:05:00Z" },
  { institution_id: "INST_005", name: "ArogyaDeep Community Hospital", city: "Seva Gram", state: "Janpad", status: "ACTIVE", created_at: "2026-01-21T11:10:00Z" },
  { institution_id: "INST_006", name: "JeevanRekha Rural Health Centre", city: "Dharampur", state: "Gramin Kshetra", status: "SUSPENDED", created_at: "2026-01-21T11:15:00Z" },
  { institution_id: "INST_007", name: "SwasthyaKiran Diagnostic Labs", city: "Vigyan Nagar", state: "Technopuri", status: "ACTIVE", created_at: "2026-01-21T11:20:00Z" },
  { institution_id: "INST_008", name: "JeevanRaksha Emergency Hospital", city: "Aapda Nagar", state: "Suraksha Pradesh", status: "ACTIVE", created_at: "2026-01-21T11:25:00Z" },
  { institution_id: "INST_009", name: "Hope Medical Clinic", city: "Devpur", state: "Dakshin Pradesh", status: "REJECTED", created_at: "2026-01-21T11:30:00Z" },
  { institution_id: "INST_010", name: "Wellness First Center", city: "Shantipur", state: "Madhav Pradesh", status: "PENDING", created_at: "2026-01-21T11:35:00Z" },
];

const usersData = [
  // Passwords will be set client-side during first login/signup for these demo accounts
  { user_id: "HP_001", name: "Dr. Aarav Mehta", email: "aarav.mehta@aarogyanova.demo", role: "healthcare_provider", institution_id: "INST_001", active: true, avatarUrl: "https://images.unsplash.com/photo-1642541724244-83d49288a86b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxkb2N0b3IlMjBwb3J0cmFpdHxlbnwwfHx8fDE3Njk3MDk2MzJ8MA&ixlib=rb-4.0.3&q=80&w=1080" },
  { user_id: "HP_002", name: "Nurse Kavya Nair", email: "kavya.nair@aarogyanova.demo", role: "healthcare_provider", institution_id: "INST_001", active: true, avatarUrl: "https://images.unsplash.com/photo-1582750421881-2781b953a5de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxudXJzZSUyMHBvcnRyYWl0fGVufDB8fHx8MTc3MDA2MzYyNnww&ixlib=rb-4.0.3&q=80&w=1080" },
  { user_id: "HP_003", name: "Dr. Rohan Kulkarni", email: "rohan.k@jeevanpath.demo", role: "healthcare_provider", institution_id: "INST_002", active: true, avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxkb2N0b3IlMjBwb3J0cmFpdHxlbnwwfHx8fDE3Njk3MDk2MzJ8MA&ixlib=rb-4.0.3&q=80&w=1080" },
  { user_id: "HP_004", name: "Nurse Pooja Verma", email: "pooja.verma@jeevanpath.demo", role: "healthcare_provider", institution_id: "INST_002", active: true, avatarUrl: "https://images.unsplash.com/photo-1631217871316-2d3ded2b3823?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxudXJzZSUyMHBvcnRyYWl0fGVufDB8fHx8MTc3MDA2MzYyNnww&ixlib=rb-4.0.3&q=80&w=1080" },
  { user_id: "HP_005", name: "Dr. Neel Shah", email: "neel.shah@swasthicare.demo", role: "healthcare_provider", institution_id: "INST_003", active: true, avatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da60710?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBwb3J0cmFpdHxlbnwwfHx8fDE3Njk3MDk2MzJ8MA&ixlib=rb-4.0.3&q=80&w=1080" },
  { user_id: "HP_006", name: "Dr. Isha Deshmukh", email: "isha.d@pranasetu.demo", role: "healthcare_provider", institution_id: "INST_004", active: true, avatarUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxkb2N0b3IlMjBwb3J0cmFpdHxlbnwwfHx8fDE3Njk3MDk2MzJ8MA&ixlib=rb-4.0.3&q=80&w=1080" },
  { user_id: "HP_007", name: "Nurse Arjun Rao", email: "arjun.rao@arogyadeep.demo", role: "healthcare_provider", institution_id: "INST_005", active: true, avatarUrl: "https://images.unsplash.com/photo-1606023348577-628679a7c64b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtYWxlJTIwbnVyc2UlMjBwb3J0cmFpdHxlbnwwfHx8fDE3NzAwNjM4OTd8MA&ixlib=rb-4.0.3&q=80&w=1080" },
  { user_id: "HP_008", name: "Dr. Ananya Sen", email: "ananya.sen@jeevanrekha.demo", role: "healthcare_provider", institution_id: "INST_006", active: true, avatarUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMnx8ZG9jdG9yJTIwcG9ydHJhaXR8ZW58MHx8fHwxNzY5NzA5NjMyfDA&ixlib=rb-4.0.3&q=80&w=1080" },
  { user_id: "HP_009", name: "Lab Officer Vikram Joshi", email: "vikram.j@swasthyakiran.demo", role: "healthcare_provider", institution_id: "INST_007", active: true, avatarUrl: "https://images.unsplash.com/photo-1574853302728-de82b998f98c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxsYWIlMjB0ZWNobmljaWFuJTIwcG9ydHJhaXR8ZW58MHx8fHwxNzcwMDY0MDMyfDA&ixlib=rb-4.0.3&q=80&w=1080" },
  { user_id: "HP_010", name: "Dr. Meera Patel", email: "meera.p@jeevanraksha.demo", role: "healthcare_provider", institution_id: "INST_008", active: true, avatarUrl: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxNXx8ZG9jdG9yJTIwcG9ydHJhaXR8ZW58MHx8fHwxNzY5NzA5NjMyfDA&ixlib=rb-4.0.3&q=80&w=1080" },
  { user_id: "IA_001", name: "Riya Sharma", email: "admin@aarogyanova.demo", role: "institution_admin", institution_id: "INST_001", active: true, avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwwfHx8fDE3Njk4MjI0ODJ8MA&ixlib=rb-4.0.3&q=80&w=1080" },
  { user_id: "PA_001", name: "Platform Admin", email: "platform.admin@swasthyasetu.demo", role: "platform_admin", active: true, avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwwfHx8fDE3Njk4MjI0ODJ8MA&ixlib=rb-4.0.3&q=80&w=1080" },
  { user_id: "PAT_001", name: "Rohit Verma", email: "rohit.verma@example.com", role: "patient", active: true, avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxwZXJzb24lMjBwb3J0cmFpdHxlbnwwfHx8fDE3Njk3NDY1MTR8MA&ixlib=rb-4.0.3&q=80&w=1080" },
  { user_id: "PAT_002", name: "Anita Kulkarni", email: "anita.kulkarni@example.com", role: "patient", active: true, avatarUrl: "https://images.unsplash.com/photo-1582750421881-2781b953a5de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxudXJzZSUyMHBvcnRyYWl0fGVufDB8fHx8MTc3MDA2MzYyNnww&ixlib=rb-4.0.3&q=80&w=1080" },
];

const patientsData = [
  { patient_id: "PAT_001", name: "Rohit Verma", dob: "1994-06-12", gender: "Male", primary_institution: "INST_001", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxwZXJzb24lMjBwb3J0cmFpdHxlbnwwfHx8fDE3Njk3NDY1MTR8MA&ixlib=rb-4.0.3&q=80&w=1080" },
  { patient_id: "PAT_002", name: "Anita Kulkarni", dob: "1988-02-03", gender: "Female", primary_institution: "INST_002", avatarUrl: "https://images.unsplash.com/photo-1582750421881-2781b953a5de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxudXJzZSUyMHBvcnRyYWl0fGVufDB8fHx8MTc3MDA2MzYyNnww&ixlib=rb-4.0.3&q=80&w=1080" },
];

const consentsData = [
  { consent_id: "PAT_001", patient_id: "PAT_001", granted: true, last_updated: "2026-01-25T09:00:00Z" },
  { consent_id: "PAT_002", patient_id: "PAT_002", granted: true, last_updated: "2026-01-25T09:10:00Z" },
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
    { credential_id: "API_003", institution_id: "INST_003", api_key: "APIKEY_SWASTHICARE_789", enabled: true, created_at: "2026-01-22T10:10:00Z" },
    { credential_id: "API_004", institution_id: "INST_004", api_key: "APIKEY_PRANASETU_101", enabled: true, created_at: "2026-01-22T10:15:00Z" },
    { credential_id: "API_005", institution_id: "INST_005", api_key: "APIKEY_AROGYADEEP_112", enabled: false, created_at: "2026-01-22T10:20:00Z" },
    { credential_id: "API_006", institution_id: "INST_006", api_key: "APIKEY_JEEVANREKHA_131", enabled: true, created_at: "2026-01-22T10:25:00Z" },
    { credential_id: "API_007", institution_id: "INST_007", api_key: "APIKEY_SWASTHYAKIRAN_415", enabled: true, created_at: "2026-01-22T10:30:00Z" },
    { credential_id: "API_008", institution_id: "INST_008", api_key: "APIKEY_JEEVANRAKSHA_911", enabled: true, created_at: "2026-01-22T10:35:00Z" },
    { credential_id: "API_009", institution_id: "INST_009", api_key: "APIKEY_HOPE_118", enabled: false, created_at: "2026-01-22T10:40:00Z" },
    { credential_id: "API_010", institution_id: "INST_010", api_key: "APIKEY_WELLNESS_360", enabled: false, created_at: "2026-01-22T10:45:00Z" },
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
            const ref = adminDb.collection('consents').doc(data.patient_id);
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
