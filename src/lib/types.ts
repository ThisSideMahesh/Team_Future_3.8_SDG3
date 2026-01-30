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

export type Patient = {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  avatarUrl: string;
  bloodGroup: string;
  isTemporary?: boolean;
  createdAt?: string;
  createdByInstitution?: string;
};

export type HealthcareProvider = {
  id: string;
  name: string;
  email: string;
  role: string;
  institutionId: string;
  avatarUrl: string;
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
    patientId: string;
    granted: boolean;
}

export type Institution = {
    id: string;
    name: string;
    status: 'pending' | 'approved' | 'rejected' | 'active';
    city: string;
    state: string;
    type: 'Hospital' | 'Clinic' | 'Diagnostic' | 'PHC';
    registrationId: string;
    adminEmail: string;
    adminUid?: string;
    apiKey?: string;
};

export type InstitutionAdmin = {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
    institutionId: string;
    role: string;
};

export type PlatformAdmin = {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
};
