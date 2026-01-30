"use client";

import Image from "next/image";
import { useFirestore, useUser, useDoc, useCollection, useMemoFirebase } from "@/firebase";
import { doc, collection, setDoc, query, where, getDocs } from "firebase/firestore";
import type { User, Patient, Consent, HealthRecord, EmergencyAccessLog } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Shield, Activity, AlertTriangle, Clock, Hospital, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

export function PatientView() {
  const { user, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();
  const [showRevokeDialog, setShowRevokeDialog] = useState(false);

  // The user object from useUser() is the auth user. We need their profile from /users.
  const userProfileRef = useMemoFirebase(() => user ? doc(firestore, "users", user.uid) : null, [firestore, user]);
  const { data: userProfile, isLoading: isUserLoading } = useDoc<User>(userProfileRef);

  // Once we have the user profile, we can get their patient_id (assuming it's the same as user_id for this demo)
  const patientId = userProfile?.user_id;

  const patientRef = useMemoFirebase(() => patientId ? doc(firestore, "patients", patientId) : null, [firestore, patientId]);
  const { data: patient, isLoading: isPatientLoading } = useDoc<Patient>(patientRef);
  
  const consentRef = useMemoFirebase(() => patientId ? doc(firestore, "consents", patientId) : null, [firestore, patientId]);
  const { data: consent, isLoading: isConsentLoading } = useDoc<Consent>(consentRef);

  const healthRecordsQuery = useMemoFirebase(() => patientId ? query(collection(firestore, `records`), where('patient_id', '==', patientId)) : null, [firestore, patientId]);
  const { data: healthRecords, isLoading: isHistoryLoading } = useCollection<HealthRecord>(healthRecordsQuery);

  // Fetch all access logs (including emergency and normal)
  const accessLogsQuery = useMemoFirebase(() => patientId ? query(collection(firestore, `access_logs`), where('patient_id', '==', patientId)) : null, [firestore, patientId]);
  const { data: accessLogs, isLoading: isAccessLogsLoading } = useCollection<any>(accessLogsQuery);

  const emergencyLogsQuery = useMemoFirebase(() => patientId ? query(collection(firestore, `emergency_access_logs`), where('patient_id', '==', patientId)) : null, [firestore, patientId]);
  const {data: emergencyLogs, isLoading: isEmergencyLogsLoading} = useCollection<EmergencyAccessLog>(emergencyLogsQuery);

  // Aggregate health records
  const aggregatedData = healthRecords?.reduce((acc, record) => {
    if (record.blood_group) acc.blood_group = record.blood_group;
    record.conditions?.forEach(c => acc.conditions.add(c));
    record.medications?.forEach(m => acc.medications.add(m));
    record.allergies?.forEach(a => acc.allergies.add(a));
    if (!acc.last_updated || record.last_updated > acc.last_updated) {
      acc.last_updated = record.last_updated;
    }
    return acc;
  }, {
    blood_group: '',
    conditions: new Set<string>(),
    medications: new Set<string>(),
    allergies: new Set<string>(),
    last_updated: ''
  });

  const handleConsentChange = (granted: boolean) => {
    if (!granted) {
      setShowRevokeDialog(true);
    } else {
      updateConsent(true);
    }
  };

  const updateConsent = (granted: boolean) => {
    if (patientId) {
      const consentDocRef = doc(firestore, 'consents', patientId);
      
      const consentPayload = { 
        consent_id: patientId,
        patient_id: patientId, 
        granted,
        last_updated: new Date().toISOString() 
      };
      setDocumentNonBlocking(consentDocRef, consentPayload, { merge: true });
      setShowRevokeDialog(false);
    }
  };

  const isLoading = isAuthLoading || isUserLoading || isPatientLoading || isConsentLoading || isHistoryLoading || isAccessLogsLoading || isEmergencyLogsLoading;

  if (isLoading) {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
                <div>
                    <Skeleton className="h-9 w-64 mb-2" />
                    <Skeleton className="h-5 w-80" />
                </div>
                <Card className="flex items-center gap-4 p-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div>
                        <Skeleton className="h-5 w-32 mb-1" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </Card>
            </div>
             <Tabs defaultValue="record">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="record">Health Record</TabsTrigger>
                    <TabsTrigger value="consent">Consent</TabsTrigger>
                    <TabsTrigger value="logs">Access Logs</TabsTrigger>
                    <TabsTrigger value="emergency">Emergency Info</TabsTrigger>
                </TabsList>
                <TabsContent value="record" className="mt-6">
                    <Skeleton className="h-96 w-full" />
                </TabsContent>
            </Tabs>
        </div>
    );
  }

  if (!patient || !userProfile) {
    return <div className="text-center py-12">Could not load patient data. Please sign up or try again.</div>
  }

  // Combine all access logs
  const allAccessLogs = [
    ...(accessLogs || []).map(log => ({ ...log, type: 'normal' as const })),
    ...(emergencyLogs || []).map(log => ({ ...log, type: 'emergency' as const }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="space-y-8 pb-12" data-testid="patient-dashboard">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
        <div>
            <h1 className="text-3xl font-headline font-bold text-primary">Welcome, {patient.name.split(' ')[0]}</h1>
            <p className="text-muted-foreground">You are in control of your health data</p>
        </div>
        <Card className="flex items-center gap-4 p-4 shadow-md">
            <Image src={patient.avatarUrl} alt={patient.name} width={64} height={64} className="rounded-full border-2 border-primary" />
            <div>
                <p className="font-semibold text-lg">{patient.name}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Patient
                </p>
            </div>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="record" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
          <TabsTrigger value="record" className="flex items-center gap-2" data-testid="tab-health-record">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">My Health Record</span>
            <span className="sm:hidden">Health</span>
          </TabsTrigger>
          <TabsTrigger value="consent" className="flex items-center gap-2" data-testid="tab-consent">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Consent</span>
            <span className="sm:hidden">Consent</span>
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2" data-testid="tab-access-logs">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Access Logs</span>
            <span className="sm:hidden">Logs</span>
          </TabsTrigger>
          <TabsTrigger value="emergency" className="flex items-center gap-2" data-testid="tab-emergency">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Emergency Info</span>
            <span className="sm:hidden">Emergency</span>
          </TabsTrigger>
        </TabsList>

        {/* SECTION 1: MY HEALTH RECORD */}
        <TabsContent value="record" className="mt-6 space-y-6" data-testid="section-health-record">
          <div>
            <h2 className="text-2xl font-headline font-bold mb-2">My Health Record</h2>
            <p className="text-muted-foreground">Your unified health information from all connected hospitals</p>
          </div>

          {healthRecords && healthRecords.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {/* Blood Group */}
              <Card data-testid="card-blood-group">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Activity className="h-5 w-5 text-red-500" />
                    Blood Group
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">{aggregatedData?.blood_group || 'Not recorded'}</p>
                </CardContent>
              </Card>

              {/* Chronic Conditions */}
              <Card data-testid="card-conditions">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Heart className="h-5 w-5 text-orange-500" />
                    Chronic Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {aggregatedData && aggregatedData.conditions.size > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {Array.from(aggregatedData.conditions).map((condition, idx) => (
                        <Badge key={idx} variant="secondary" className="text-sm">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No chronic conditions recorded</p>
                  )}
                </CardContent>
              </Card>

              {/* Current Medications */}
              <Card data-testid="card-medications">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    Current Medications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {aggregatedData && aggregatedData.medications.size > 0 ? (
                    <div className="space-y-2">
                      {Array.from(aggregatedData.medications).map((medication, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                          <span className="text-sm">{medication}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No medications recorded</p>
                  )}
                </CardContent>
              </Card>

              {/* Known Allergies */}
              <Card data-testid="card-allergies">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Known Allergies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {aggregatedData && aggregatedData.allergies.size > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {Array.from(aggregatedData.allergies).map((allergy, idx) => (
                        <Badge key={idx} variant="destructive" className="text-sm">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No allergies recorded</p>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No health records found yet.</p>
                <p className="text-sm text-muted-foreground mt-2">Your records will appear here once hospitals submit your data.</p>
              </CardContent>
            </Card>
          )}

          {/* Last Updated */}
          {aggregatedData?.last_updated && (
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Last updated: {new Date(aggregatedData.last_updated).toLocaleString('en-IN', { 
                    dateStyle: 'long', 
                    timeStyle: 'short' 
                  })}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* SECTION 2: CONSENT MANAGEMENT */}
        <TabsContent value="consent" className="mt-6 space-y-6" data-testid="section-consent">
          <div>
            <h2 className="text-2xl font-headline font-bold mb-2">Consent Management</h2>
            <p className="text-muted-foreground">You control who can access your health information</p>
          </div>

          <Card className="border-primary/20" data-testid="card-consent-toggle">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Data Access Consent
              </CardTitle>
              <CardDescription className="text-base">
                Granting consent allows authorized healthcare providers to view your unified health record across all connected hospitals. You can revoke this at any time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-lg border-2 p-4 bg-card">
                <div className="flex-1 space-y-1">
                  <p className="text-base font-semibold leading-none flex items-center gap-2">
                    {consent?.granted ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    {consent?.granted ? 'Consent Granted' : 'Consent Revoked'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {consent?.granted 
                      ? 'Doctors can view your health records with proper authorization' 
                      : 'Doctors cannot access your aggregated health records'}
                  </p>
                </div>
                <Switch
                  id="consent-switch"
                  checked={consent?.granted || false}
                  onCheckedChange={handleConsentChange}
                  aria-label="Toggle data aggregation consent"
                  data-testid="consent-switch"
                  className="data-[state=checked]:bg-green-500"
                />
              </div>

              {consent?.last_updated && (
                <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Last changed: {new Date(consent.last_updated).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </p>
              )}
            </CardContent>
          </Card>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> Even with consent revoked, emergency access to critical information (blood group, allergies) may still be available in life-threatening situations. All emergency access is logged and auditable.
            </AlertDescription>
          </Alert>

          {/* Revoke Confirmation Dialog */}
          <AlertDialog open={showRevokeDialog} onOpenChange={setShowRevokeDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Revoke Data Access Consent?</AlertDialogTitle>
                <AlertDialogDescription className="text-base">
                  Are you sure you want to revoke consent? Healthcare providers will not be able to view your unified health record. Emergency access to critical information will still be available in life-threatening situations.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => updateConsent(false)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Yes, Revoke Consent
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TabsContent>

        {/* SECTION 3: ACCESS LOGS */}
        <TabsContent value="logs" className="mt-6 space-y-6" data-testid="section-access-logs">
          <div>
            <h2 className="text-2xl font-headline font-bold mb-2">Access Logs</h2>
            <p className="text-muted-foreground">Complete transparency on who accessed your health records</p>
          </div>

          <Card data-testid="card-access-logs-table">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Access History
              </CardTitle>
              <CardDescription>
                This log shows every access to your health records, including emergency situations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {allAccessLogs.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Hospital</TableHead>
                        <TableHead>Access Type</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Purpose</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allAccessLogs.map((log, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Hospital className="h-4 w-4 text-muted-foreground" />
                              <span>{log.institution_id}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={log.type === 'emergency' ? 'destructive' : 'default'}>
                              {log.type === 'emergency' ? 'Emergency' : 'Normal'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {new Date(log.timestamp).toLocaleString('en-IN', {
                              dateStyle: 'medium',
                              timeStyle: 'short'
                            })}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {log.reason || 'Healthcare provider access'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No access logs yet</p>
                  <p className="text-sm text-muted-foreground mt-2">When healthcare providers access your records, it will be logged here</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Your Privacy Matters:</strong> Every access to your health records is logged and auditable. You have complete transparency over who viewed your information and when.
            </AlertDescription>
          </Alert>
        </TabsContent>

        {/* SECTION 4: EMERGENCY INFO */}
        <TabsContent value="emergency" className="mt-6 space-y-6" data-testid="section-emergency-info">
          <div>
            <h2 className="text-2xl font-headline font-bold mb-2">Emergency Information</h2>
            <p className="text-muted-foreground">Critical data visible during emergency situations</p>
          </div>

          <Alert variant="destructive" className="border-2">
            <AlertTriangle className="h-5 w-5" />
            <AlertDescription className="text-base">
              <strong>Emergency Access Policy:</strong> In life-threatening situations, healthcare providers can access the following critical information even without consent. All emergency access is strictly logged and auditable.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Emergency Blood Group */}
            <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/10" data-testid="emergency-blood-group">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2 text-red-700 dark:text-red-400">
                  <Activity className="h-5 w-5" />
                  Blood Group
                </CardTitle>
                <CardDescription>Critical for transfusions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-red-700 dark:text-red-400">
                  {aggregatedData?.blood_group || 'Not recorded'}
                </p>
              </CardContent>
            </Card>

            {/* Emergency Allergies */}
            <Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-950/10" data-testid="emergency-allergies">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2 text-orange-700 dark:text-orange-400">
                  <AlertTriangle className="h-5 w-5" />
                  Critical Allergies
                </CardTitle>
                <CardDescription>Must avoid during treatment</CardDescription>
              </CardHeader>
              <CardContent>
                {aggregatedData && aggregatedData.allergies.size > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {Array.from(aggregatedData.allergies).map((allergy, idx) => (
                      <Badge key={idx} variant="destructive" className="text-sm">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No allergies recorded</p>
                )}
              </CardContent>
            </Card>

            {/* Emergency Chronic Conditions */}
            <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/10" data-testid="emergency-conditions">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2 text-blue-700 dark:text-blue-400">
                  <Heart className="h-5 w-5" />
                  Chronic Conditions
                </CardTitle>
                <CardDescription>Ongoing health conditions</CardDescription>
              </CardHeader>
              <CardContent>
                {aggregatedData && aggregatedData.conditions.size > 0 ? (
                  <div className="space-y-2">
                    {Array.from(aggregatedData.conditions).map((condition, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        <span className="text-sm">{condition}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No chronic conditions recorded</p>
                )}
              </CardContent>
            </Card>

            {/* Current Medications */}
            <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-950/10" data-testid="emergency-medications">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2 text-purple-700 dark:text-purple-400">
                  <Activity className="h-5 w-5" />
                  Current Medication
                </CardTitle>
                <CardDescription>Active prescriptions</CardDescription>
              </CardHeader>
              <CardContent>
                {aggregatedData && aggregatedData.medications.size > 0 ? (
                  <div className="space-y-2">
                    {Array.from(aggregatedData.medications).map((medication, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                        <span className="text-sm">{medication}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No current medications</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
