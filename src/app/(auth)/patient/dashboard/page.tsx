import { getPatientById, getAccessLogsByPatientId } from "@/lib/data";
import { PatientView } from "./components/patient-view";

// In a real app, you'd get the ID from the user's session
const MOCK_PATIENT_ID = 'PAT12345';

export default async function PatientDashboardPage() {
    const patientData = await getPatientById(MOCK_PATIENT_ID);
    const accessLogs = await getAccessLogsByPatientId(MOCK_PATIENT_ID);

    if (!patientData) {
        return <div>Could not load patient data.</div>
    }

    return <PatientView patient={patientData} accessLogs={accessLogs}/>;
}
