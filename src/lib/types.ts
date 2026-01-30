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

export type Doctor = {
  id: string;
  name: string;
  email: string;
  specialty: string;
  avatarUrl: string;
};

export type AccessLog = {
  id: string;
  accessorName: string;
  accessorRole: 'Doctor' | 'System';
  date: string;
  action: 'Viewed Record';
};

export type Consent = {
    patientId: string;
    granted: boolean;
}
