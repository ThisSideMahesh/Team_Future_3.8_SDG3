import type { Patient, Doctor, AccessLog, MedicalEvent } from './types';
import { PlaceHolderImages } from './placeholder-images';

const doctorAvatar = PlaceHolderImages.find(img => img.id === 'doctor-avatar-1')?.imageUrl || '';
const patientAvatar = PlaceHolderImages.find(img => img.id === 'patient-avatar-1')?.imageUrl || '';

const mockMedicalHistory: MedicalEvent[] = [
  {
    id: 'evt1',
    date: '2023-10-26',
    type: 'Diagnosis',
    title: 'Allergic Rhinitis',
    details: 'Patient reports seasonal allergies. Prescribed antihistamines.',
    doctor: { name: 'Dr. Evelyn Reed', specialty: 'General Medicine' },
    source: 'Hospital A',
  },
  {
    id: 'evt7',
    date: '2023-10-26',
    type: 'Allergy',
    title: 'Penicillin Allergy',
    details: 'Patient has a known allergy to Penicillin. Causes hives.',
    doctor: { name: 'Dr. Evelyn Reed', specialty: 'General Medicine' },
    source: 'Hospital A',
  },
  {
    id: 'evt8',
    date: '2023-01-15',
    type: 'Chronic Condition',
    title: 'Hypertension',
    details: 'Patient diagnosed with chronic hypertension. Monitoring blood pressure regularly.',
    doctor: { name: 'Dr. Ben Carter', specialty: 'Cardiology' },
    source: 'Hospital B',
  },
  {
    id: 'evt2',
    date: '2023-08-15',
    type: 'Appointment',
    title: 'Follow-up Checkup',
    details: 'Routine follow-up. Vitals are stable. Blood pressure is slightly elevated.',
    doctor: { name: 'Dr. Evelyn Reed', specialty: 'General Medicine' },
    source: 'Hospital A',
  },
  {
    id: 'evt3',
    date: '2023-05-20',
    type: 'Lab Test',
    title: 'Blood Panel',
    details: 'Cholesterol levels are within the normal range. Glucose is slightly high.',
    doctor: { name: 'Dr. Ben Carter', specialty: 'Cardiology' },
    source: 'Hospital B',
  },
  {
    id: 'evt4',
    date: '2023-05-21',
    type: 'Medication',
    title: 'Lisinopril 10mg',
    details: 'Prescribed for blood pressure management.',
    doctor: { name: 'Dr. Ben Carter', specialty: 'Cardiology' },
    source: 'Hospital B',
  },
  {
    id: 'evt5',
    date: '2022-11-02',
    type: 'Appointment',
    title: 'Annual Physical',
    details: 'Patient is in good overall health. Discussed diet and exercise.',
    doctor: { name: 'Dr. Evelyn Reed', specialty: 'General Medicine' },
    source: 'Hospital A',
  },
  {
    id: 'evt6',
    date: '2022-03-10',
    type: 'Diagnosis',
    title: 'Minor Sprain - Ankle',
    details: 'Patient sprained ankle during a sports activity. Recommended R.I.C.E.',
    doctor: { name: 'Dr. Samuel Green', specialty: 'Orthopedics' },
    source: 'Hospital A',
  },
];

const mockPatients: Patient[] = [
  {
    id: 'PAT12345',
    name: 'Rohan Sharma',
    email: 'rohan.sharma@example.com',
    dateOfBirth: '1985-05-22',
    avatarUrl: patientAvatar,
    medicalHistory: mockMedicalHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  },
];

const mockDoctors: Doctor[] = [
  {
    id: 'DOC98765',
    name: 'Dr. Anjali Verma',
    email: 'anjali.verma@example.com',
    specialty: 'Cardiology',
    avatarUrl: doctorAvatar,
  },
];

const mockAccessLogs: AccessLog[] = [
    {
        id: 'log1',
        accessorName: 'Dr. Evelyn Reed',
        accessorRole: 'Doctor',
        date: '2023-10-26T10:00:00Z',
        action: 'Viewed Record'
    },
    {
        id: 'log2',
        accessorName: 'Dr. Ben Carter',
        accessorRole: 'Doctor',
        date: '2023-05-20T14:30:00Z',
        action: 'Viewed Record'
    },
    {
        id: 'log3',
        accessorName: 'SwasthyaSetu System',
        accessorRole: 'System',
        date: '2023-05-19T08:00:00Z',
        action: 'Viewed Record'
    },
];

export const getPatientById = async (id: string): Promise<Patient | undefined> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockPatients.find(p => p.id === id));
    }, 500);
  });
};

export const getDoctorById = async (id: string): Promise<Doctor | undefined> => {
    return new Promise(resolve => {
        setTimeout(() => {
          resolve(mockDoctors.find(d => d.id === id));
        }, 500);
      });
};

export const getAccessLogsByPatientId = async (patientId: string): Promise<AccessLog[]> => {
    return new Promise(resolve => {
        if(patientId === 'PAT12345') {
            setTimeout(() => {
                resolve(mockAccessLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
            }, 300);
        } else {
            resolve([]);
        }
    });
}
