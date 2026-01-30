import type { Patient, HealthcareProvider, AccessLog, MedicalEvent, Consent } from './types';
import { PlaceHolderImages } from './placeholder-images';

// This file now primarily serves to provide type definitions and placeholder images.
// The mock data is no longer used in the main application flow but is kept
// here for reference or potential testing purposes.

const healthcareProviderAvatar = PlaceHolderImages.find(img => img.id === 'doctor-avatar-1')?.imageUrl || '';
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

const mockHealthcareProviders: HealthcareProvider[] = [
  {
    id: 'DOC98765',
    name: 'Dr. Anjali Verma',
    email: 'dr.verma@example.com',
    role: 'Cardiology',
    institutionId: 'inst-1',
    avatarUrl: healthcareProviderAvatar,
  },
];

const mockAccessLogs: AccessLog[] = [];

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

export const getHealthcareProviderById = async (id: string): Promise<HealthcareProvider | undefined> => {
    console.warn("getHealthcareProviderById is a mock function and should not be used in production.");
    return new Promise(resolve => {
        setTimeout(() => {
          resolve(mockHealthcareProviders.find(d => d.id === id));
        }, 500);
      });
};

export const getAccessLogsByPatientId = async (patientId: string): Promise<AccessLog[]> => {
    console.warn("getAccessLogsByPatientId is a mock function and should not be used in production.");
    return new Promise(resolve => {
        if(patientId === 'PAT12345') {
            setTimeout(() => {
                resolve(mockAccessLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
            }, 300);
        } else {
            resolve([]);
        }
    });
}

    

    