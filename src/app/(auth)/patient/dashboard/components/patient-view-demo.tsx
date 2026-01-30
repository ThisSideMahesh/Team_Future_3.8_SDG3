"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Heart, Shield, Activity, AlertTriangle, Clock, Hospital, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

// Mock data for demonstration
const MOCK_PATIENT = {
  patient_id: "PAT_001",
  name: "Rohit Verma",
  avatarUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect fill='%234ade80' width='64' height='64'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-family='Arial' font-size='28' font-weight='bold'%3ERV%3C/text%3E%3C/svg%3E",
};

const MOCK_HEALTH_RECORDS = [
  {
    record_id: "REC_001",
    patient_id: "PAT_001",
    institution_id: "INST_001",
    blood_group: "O+",
    conditions: ["Hypertension"],
    medications: ["Amlodipine"],
    allergies: ["Penicillin"],
    last_updated: "2026-01-26T14:00:00Z"
  },
  {
    record_id: "REC_003",
    patient_id: "PAT_001",
    institution_id: "INST_002",
    blood_group: "O+",
    conditions: ["Type 2 Diabetes"],
    medications: ["Metformin"],
    allergies: ["Penicillin"],
    last_updated: "2026-01-27T10:30:00Z"
  }
];

const MOCK_ACCESS_LOGS = [
  {
    institution_id: "INST_C",
    patient_id: "PAT_001",
    accessed_from: ["INST_001", "INST_002"],
    accessed_by_role: "healthcare_provider",
    timestamp: "2026-01-28T10:30:00Z",
    type: "normal"
  },
  {
    institution_id: "INST_008",
    patient_id: "PAT_001",
    accessed_from: ["INST_001", "INST_002"],
    accessed_by_role: "healthcare_provider",
    reason: "Emergency care - patient critical condition",
    timestamp: "2026-01-27T22:15:00Z",
    type: "emergency"
  },
  {
    institution_id: "INST_001",
    patient_id: "PAT_001",
    accessed_from: ["INST_001"],
    accessed_by_role: "healthcare_provider",
    timestamp: "2026-01-26T14:00:00Z",
    type: "normal"
  }
];

export function PatientViewDemo() {
  const [consentGranted, setConsentGranted] = useState(true);
  const [showRevokeDialog, setShowRevokeDialog] = useState(false);
  const [consentLastUpdated, setConsentLastUpdated] = useState(new Date().toISOString());

  // Aggregate health records from mock data
  const aggregatedData = MOCK_HEALTH_RECORDS.reduce((acc, record) => {
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
    setConsentGranted(granted);
    setConsentLastUpdated(new Date().toISOString());
    setShowRevokeDialog(false);
  };

  return (
    <div className="space-y-8 pb-12" data-testid="patient-dashboard">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
        <div>
            <h1 className="text-3xl font-headline font-bold text-primary">Welcome, {MOCK_PATIENT.name.split(' ')[0]}</h1>
            <p className="text-muted-foreground">You are in control of your health data</p>
        </div>
        <Card className="flex items-center gap-4 p-4 shadow-md">
            <Image src={MOCK_PATIENT.avatarUrl} alt={MOCK_PATIENT.name} width={64} height={64} className="rounded-full border-2 border-primary" />
            <div>
                <p className="font-semibold text-lg">{MOCK_PATIENT.name}</p>
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
                <p className="text-3xl font-bold text-primary">{aggregatedData.blood_group}</p>
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
                <div className="flex flex-wrap gap-2">
                  {Array.from(aggregatedData.conditions).map((condition, idx) => (
                    <Badge key={idx} variant="secondary" className="text-sm">
                      {condition}
                    </Badge>
                  ))}
                </div>
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
                <div className="space-y-2">
                  {Array.from(aggregatedData.medications).map((medication, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <span className="text-sm">{medication}</span>
                    </div>
                  ))}
                </div>
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
                <div className="flex flex-wrap gap-2">
                  {Array.from(aggregatedData.allergies).map((allergy, idx) => (
                    <Badge key={idx} variant="destructive" className="text-sm">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Last Updated */}
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
                    {consentGranted ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    {consentGranted ? 'Consent Granted' : 'Consent Revoked'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {consentGranted 
                      ? 'Doctors can view your health records with proper authorization' 
                      : 'Doctors cannot access your aggregated health records'}
                  </p>
                </div>
                <Switch
                  id="consent-switch"
                  checked={consentGranted}
                  onCheckedChange={handleConsentChange}
                  aria-label="Toggle data aggregation consent"
                  data-testid="consent-switch"
                  className="data-[state=checked]:bg-green-500"
                />
              </div>

              <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Last changed: {new Date(consentLastUpdated).toLocaleString('en-IN', {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                })}
              </p>
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
              <div className="flex gap-3 justify-end mt-4">
                <button 
                  onClick={() => setShowRevokeDialog(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => updateConsent(false)} 
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Yes, Revoke Consent
                </button>
              </div>
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
                    {MOCK_ACCESS_LOGS.map((log, idx) => (
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
                  {aggregatedData.blood_group}
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
                <div className="flex flex-wrap gap-2">
                  {Array.from(aggregatedData.allergies).map((allergy, idx) => (
                    <Badge key={idx} variant="destructive" className="text-sm">
                      {allergy}
                    </Badge>
                  ))}
                </div>
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
                <div className="space-y-2">
                  {Array.from(aggregatedData.conditions).map((condition, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <span className="text-sm">{condition}</span>
                    </div>
                  ))}
                </div>
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
                <div className="space-y-2">
                  {Array.from(aggregatedData.medications).map((medication, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                      <span className="text-sm">{medication}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
