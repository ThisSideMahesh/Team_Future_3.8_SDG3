"use client";

import Image from "next/image";
import { useFirestore, useUser, useDoc, useCollection, useMemoFirebase } from "@/firebase";
import { doc, collection, setDoc, query, where, getDocs } from "firebase/firestore";
import type { User, Patient, Consent, HealthRecord, EmergencyAccessLog } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { Skeleton } from "@/components/ui/skeleton";

export function PatientView() {
  const { user, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();

  // The user object from useUser() is the auth user. We need their profile from /users.
  const userProfileRef = useMemoFirebase(() => user ? doc(firestore, "users", user.uid) : null, [firestore, user]);
  const { data: userProfile, isLoading: isUserLoading } = useDoc<User>(userProfileRef);

  // Once we have the user profile, we can get their patient_id (assuming it's the same as user_id for this demo)
  const patientId = userProfile?.user_id;

  const patientRef = useMemoFirebase(() => patientId ? doc(firestore, "patients", patientId) : null, [firestore, patientId]);
  const { data: patient, isLoading: isPatientLoading } = useDoc<Patient>(patientRef);
  
  const consentQuery = useMemoFirebase(() => patientId ? query(collection(firestore, `consents`), where('patient_id', '==', patientId)) : null, [firestore, patientId]);
  const { data: consentData, isLoading: isConsentLoading } = useCollection<Consent>(consentQuery);
  const consent = consentData?.[0]; // Get the first consent document

  const healthRecordsQuery = useMemoFirebase(() => patientId ? query(collection(firestore, `records`), where('patient_id', '==', patientId)) : null, [firestore, patientId]);
  const { data: healthRecords, isLoading: isHistoryLoading } = useCollection<HealthRecord>(healthRecordsQuery);

  const accessLogsQuery = useMemoFirebase(() => patientId ? query(collection(firestore, `emergency_access_logs`), where('patient_id', '==', patientId)) : null, [firestore, patientId]);
  const {data: accessLogs, isLoading: isLogsLoading} = useCollection<EmergencyAccessLog>(accessLogsQuery)

  const handleConsentChange = async (granted: boolean) => {
    if (patientId) {
      // Find the existing consent document to update, or create a new one.
      const consentColRef = collection(firestore, 'consents');
      const q = query(consentColRef, where('patient_id', '==', patientId));
      const snapshot = await getDocs(q);
      
      let consentDocRef;
      if (snapshot.empty) {
        // Create new consent doc if none exists
        consentDocRef = doc(consentColRef);
      } else {
        // Update existing consent doc
        consentDocRef = snapshot.docs[0].ref;
      }
      
      const consentPayload = { 
        consent_id: consentDocRef.id,
        patient_id: patientId, 
        granted,
        last_updated: new Date().toISOString() 
      };
      setDocumentNonBlocking(consentDocRef, consentPayload, { merge: true });
    }
  };

  const isLoading = isAuthLoading || isUserLoading || isPatientLoading || isConsentLoading || isHistoryLoading || isLogsLoading;

  if (isLoading) {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
                <div>
                    <Skeleton className="h-9 w-64 mb-2" />
                    <Skeleton className="h-5 w-80" />
                </div>
                <Card className="flex items-center gap-4 p-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div>
                        <Skeleton className="h-5 w-32 mb-1" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </Card>
            </div>
             <Tabs defaultValue="record">
                <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
                    <TabsTrigger value="record">My Health Record</TabsTrigger>
                    <TabsTrigger value="privacy">Consent & Privacy</TabsTrigger>
                </TabsList>
                 <TabsContent value="record" className="mt-6">
                    <Skeleton className="h-64 w-full" />
                </TabsContent>
                <TabsContent value="privacy" className="mt-6">
                    <Skeleton className="h-48 w-full" />
                </TabsContent>
            </Tabs>
        </div>
    );
  }

  if (!patient || !userProfile) {
    return <div>Could not load patient data. Please sign up or try again.</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
        <div>
            <h1 className="text-3xl font-headline font-bold">Welcome, {patient.name.split(' ')[0]}</h1>
            <p className="text-muted-foreground">Here is your unified health record and privacy settings.</p>
        </div>
        <Card className="flex items-center gap-4 p-4">
            <Image src={patient.avatarUrl} alt={patient.name} width={48} height={48} className="rounded-full border" />
            <div>
                <p className="font-semibold">{patient.name}</p>
                <p className="text-sm text-muted-foreground">ID: {patient.patient_id}</p>
            </div>
        </Card>
      </div>

      <Tabs defaultValue="record">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="record">My Health Record</TabsTrigger>
          <TabsTrigger value="privacy">Consent & Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="record" className="mt-6">
            <h2 className="text-2xl font-headline font-bold mb-4">Aggregated Health Record</h2>
             {healthRecords && healthRecords.length > 0 ? (
                <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">
                  {JSON.stringify(healthRecords, null, 2)}
                </pre>
              ): (
                <Card><CardContent className="pt-6">No health records found for this patient.</CardContent></Card>
              )}
        </TabsContent>
        
        <TabsContent value="privacy" className="mt-6 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Consent Management</CardTitle>
              <CardDescription>
                You have control over your data. Use this setting to manage whether your health records from different hospitals are aggregated.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 rounded-md border p-4">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Allow Data Aggregation
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Enable SwasthyaSetu to fetch and unify your records from connected hospitals.
                  </p>
                </div>
                <Switch
                  id="consent-switch"
                  checked={consent?.granted}
                  onCheckedChange={handleConsentChange}
                  aria-label="Toggle data aggregation consent"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Emergency Data Access Logs</CardTitle>
              <CardDescription>
                This log shows who has accessed your unified health record in an emergency and when.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Provider ID</TableHead>
                        <TableHead>Institution ID</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Reason</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {(accessLogs || []).map(log => (
                            <TableRow key={log.log_id}>
                                <TableCell className="font-medium">{log.healthcare_provider_id}</TableCell>
                                <TableCell>{log.institution_id}</TableCell>
                                <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                                <TableCell>{log.reason}</TableCell>
                            </TableRow>
                        ))}
                         {(!accessLogs || accessLogs.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground">
                                    No emergency access logs found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
