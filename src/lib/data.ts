import type { Patient, Doctor, AccessLog, MedicalEvent, Consent } from './types';
import { PlaceHolderImages } from './placeholder-images';

// This file now primarily serves to provide type definitions and placeholder images.
// The mock data is no longer used in the main application flow but is kept
// here for reference or potential testing purposes.

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
];

const mockPatients: Patient[] = [
  {
    id: 'PAT12345',
    name: 'Rohan Sharma',
    email: 'rohan.sharma@example.com',
    dateOfBirth: '1985-05-22',
    avatarUrl: patientAvatar,
    bloodGroup: 'O+',
  },
];

const mockDoctors: Doctor[] = [
  {
    id: 'DOC98765',
    name: 'Dr. Anjali Verma',
    email: 'dr.verma@example.com',
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
];

// Note: The following functions are not actively used by the application anymore,
// as data is fetched directly from Firestore. They are retained for potential
// legacy use or testing.

export const getPatientById = async (id: string): Promise<Patient | undefined> => {
  console.warn("getPatientById is a mock function and should not be used in production.");
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockPatients.find(p => p.id === id));
    }, 500);
  });
};

export const getDoctorById = async (id: string): Promise<Doctor | undefined> => {
    console.warn("getDoctorById is a mock function and should not be used in production.");
    return new Promise(resolve => {
        setTimeout(() => {
          resolve(mockDoctors.find(d => d.id === id));
        }, 500);
      });
};

export const getAccessLogsByPatientId = async (patientId: string): Promise<AccessLog[]> => {
    console.warn("getAccessLogsByPatientId is a mock function and should not be used in production.");
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
