export type MedicalEvent = {
  id: string;
  date: string;
  type: 'Appointment' | 'Medication' | 'Diagnosis' | 'Allergy' | 'Lab Test' | 'Chronic Condition';
  title: string;
  details: string;
  doctor: {
    name: string;
    specialty: string;
  };
  source: 'Hospital A' | 'Hospital B';
};

// Generic User type for the /users collection
export type User = {
  user_id: string;
  name: string;
  email: string;
  role: 'patient' | 'healthcare_provider' | 'institution_admin' | 'platform_admin';
  institution_id?: string; // Foreign key to /institutions
  active: boolean;
  avatarUrl: string;
};

// Specific types for clarity, though they share the User structure
export type PatientProfile = User & { role: 'patient' };
export type HealthcareProvider = User & { role: 'healthcare_provider'; institution_id: string };
export type InstitutionAdmin = User & { role: 'institution_admin'; institution_id: string };
export type PlatformAdmin = User & { role: 'platform_admin' };


// Patient identity collection /patients
export type Patient = {
  patient_id: string; // This might be a national health ID, etc.
  name: string;
  dob: string;
  gender: string;
  primary_institution: string; // FK to /institutions
  avatarUrl: string;
  // This doc does NOT contain clinical data
};


export type AccessLog = {
  id: string;
  patientId: string;
  healthcareProviderId: string;
  accessorName: string;
  accessorRole: 'Healthcare Provider' | 'System';
  timestamp: string;
  reason: string;
  emergencyAccess: boolean;
};

export type Consent = {
    consent_id: string;
    patient_id: string;
    granted: boolean;
    last_updated: string;
};

export type Institution = {
    institution_id: string;
    name: string;
    city: string;
    state: string;
    status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED';
    created_at: string;
    apiKey?: string; // This would be managed by backend
};

export type HealthRecord = {
    record_id: string;
    patient_id: string;
    institution_id: string;
    blood_group: string;
    conditions: string[];
    medications: string[];
    allergies: string[];
    lab_reports: string[];
    last_updated: string;
};

export type EmergencyAccessLog = {
    log_id: string;
    patient_id: string;
    healthcare_provider_id: string;
    institution_id: string;
    reason: string;
    timestamp: string;
};

export type ApiCredential = {
    credential_id: string;
    institution_id: string;
    api_key: string;
    enabled: boolean;
    created_at: string;
};
