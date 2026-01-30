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
};

export type HealthProvider = {
  id: string;
  name: string;
  email: string;
  specialty: string;
  avatarUrl: string;
};

export type AccessLog = {
  id: string;
  patientId: string;
  healthProviderId: string;
  accessorName: string;
  accessorRole: 'Health Provider' | 'System';
  timestamp: string;
  reason: string;
  emergencyAccess: boolean;
};

export type Consent = {
    patientId: string;
    granted: boolean;
}

    