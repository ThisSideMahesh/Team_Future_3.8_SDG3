"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Heart, Shield, Activity, AlertTriangle, Clock, Hospital, CheckCircle, XCircle } from "lucide-react";
import { useState, useMemo, memo } from "react";

const MOCK_PATIENT = {
  patient_id: "PAT_001",
  name: "Rohit Verma",
  avatarUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect fill='%234ade80' width='64' height='64'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-family='Arial' font-size='28' font-weight='bold'%3ERV%3C/text%3E%3C/svg%3E",
};

const MOCK_HEALTH_RECORDS = [
  { record_id: "REC_001", patient_id: "PAT_001", blood_group: "O+", conditions: ["Hypertension"], medications: ["Amlodipine"], allergies: ["Penicillin"], last_updated: "2026-01-26T14:00:00Z" },
  { record_id: "REC_003", patient_id: "PAT_001", blood_group: "O+", conditions: ["Type 2 Diabetes"], medications: ["Metformin"], allergies: ["Penicillin"], last_updated: "2026-01-27T10:30:00Z" }
];

const MOCK_ACCESS_LOGS = [
  { institution_id: "INST_C", patient_id: "PAT_001", timestamp: "2026-01-28T10:30:00Z", type: "normal" as const },
  { institution_id: "INST_008", patient_id: "PAT_001", reason: "Emergency care - patient critical condition", timestamp: "2026-01-27T22:15:00Z", type: "emergency" as const },
  { institution_id: "INST_001", patient_id: "PAT_001", timestamp: "2026-01-26T14:00:00Z", type: "normal" as const }
];

const HealthRecordCard = memo(({ title, icon: Icon, iconColor, children }: any) => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="text-base font-medium flex items-center gap-2">
        <Icon className={`h-5 w-5 ${iconColor}`} />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
));
HealthRecordCard.displayName = "HealthRecordCard";

const EmergencyCard = memo(({ title, icon: Icon, description, bgColor, textColor, children }: any) => (
  <Card className={bgColor}>
    <CardHeader className="pb-3">
      <CardTitle className={`text-base font-medium flex items-center gap-2 ${textColor}`}>
        <Icon className="h-5 w-5" />
        {title}
      </CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
));
EmergencyCard.displayName = "EmergencyCard";

export function PatientViewDemo() {
  const [consentGranted, setConsentGranted] = useState(true);
  const [showRevokeDialog, setShowRevokeDialog] = useState(false);
  const [consentLastUpdated] = useState(new Date().toISOString());

  const aggregatedData = useMemo(() => {
    return MOCK_HEALTH_RECORDS.reduce((acc, record) => {
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
  }, []);

  const handleConsentChange = (granted: boolean) => {
    if (!granted) {
      setShowRevokeDialog(true);
    } else {
      setConsentGranted(true);
    }
  };

  return (
    <div className="space-y-6 pb-12" data-testid="patient-dashboard">
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-bold text-primary">Welcome, {MOCK_PATIENT.name.split(' ')[0]}</h1>
          <p className="text-sm text-muted-foreground">You are in control of your health data</p>
        </div>
        <Card className="flex items-center gap-3 p-3 shadow-md">
          <Image src={MOCK_PATIENT.avatarUrl} alt={MOCK_PATIENT.name} width={48} height={48} className="rounded-full border-2 border-primary" priority />
          <div>
            <p className="font-semibold">{MOCK_PATIENT.name}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Patient
            </p>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="record" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="record" className="flex items-center gap-1 text-xs md:text-sm">
            <Heart className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Health Record</span>
            <span className="sm:hidden">Health</span>
          </TabsTrigger>
          <TabsTrigger value="consent" className="flex items-center gap-1 text-xs md:text-sm">
            <Shield className="h-3 w-3 md:h-4 md:w-4" />
            Consent
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-1 text-xs md:text-sm">
            <Clock className="h-3 w-3 md:h-4 md:w-4" />
            Logs
          </TabsTrigger>
          <TabsTrigger value="emergency" className="flex items-center gap-1 text-xs md:text-sm">
            <AlertTriangle className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Emergency</span>
            <span className="sm:hidden">SOS</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="record" className="mt-4 space-y-4">
          <div>
            <h2 className="text-xl font-headline font-bold mb-1">My Health Record</h2>
            <p className="text-sm text-muted-foreground">Your unified health information</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <HealthRecordCard title="Blood Group" icon={Activity} iconColor="text-red-500">
              <p className="text-2xl md:text-3xl font-bold text-primary">{aggregatedData.blood_group}</p>
            </HealthRecordCard>
            <HealthRecordCard title="Chronic Conditions" icon={Heart} iconColor="text-orange-500">
              <div className="flex flex-wrap gap-2">
                {Array.from(aggregatedData.conditions).map((condition, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">{condition}</Badge>
                ))}
              </div>
            </HealthRecordCard>
            <HealthRecordCard title="Current Medications" icon={Activity} iconColor="text-blue-500">
              <div className="space-y-1">
                {Array.from(aggregatedData.medications).map((medication, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                    <span className="text-sm">{medication}</span>
                  </div>
                ))}
              </div>
            </HealthRecordCard>
            <HealthRecordCard title="Known Allergies" icon={AlertTriangle} iconColor="text-red-500">
              <div className="flex flex-wrap gap-2">
                {Array.from(aggregatedData.allergies).map((allergy, idx) => (
                  <Badge key={idx} variant="destructive" className="text-xs">{allergy}</Badge>
                ))}
              </div>
            </HealthRecordCard>
          </div>
          <Card className="bg-muted/30">
            <CardContent className="pt-4">
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <Clock className="h-3 w-3" />
                Last updated: {new Date(aggregatedData.last_updated).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consent" className="mt-4 space-y-4">
          <div>
            <h2 className="text-xl font-headline font-bold mb-1">Consent Management</h2>
            <p className="text-sm text-muted-foreground">Control data access</p>
          </div>
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-headline flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Data Access Consent
              </CardTitle>
              <CardDescription className="text-sm">Control healthcare provider access to your records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-lg border p-3 bg-card">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-semibold flex items-center gap-2">
                    {consentGranted ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                    {consentGranted ? 'Consent Granted' : 'Consent Revoked'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {consentGranted ? 'Doctors can view your records' : 'Doctors cannot access records'}
                  </p>
                </div>
                <Switch checked={consentGranted} onCheckedChange={handleConsentChange} className="data-[state=checked]:bg-green-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Last changed: {new Date(consentLastUpdated).toLocaleDateString('en-IN')}
              </p>
            </CardContent>
          </Card>
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription className="text-sm"><strong>Important:</strong> Emergency access to critical info remains available</AlertDescription>
          </Alert>
          <AlertDialog open={showRevokeDialog} onOpenChange={setShowRevokeDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Revoke Consent?</AlertDialogTitle>
                <AlertDialogDescription>Healthcare providers won't access your records. Emergency info stays available.</AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex gap-2 justify-end mt-4">
                <button onClick={() => setShowRevokeDialog(false)} className="px-3 py-1.5 text-sm border rounded-md hover:bg-gray-100">Cancel</button>
                <button onClick={() => { setConsentGranted(false); setShowRevokeDialog(false); }} className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700">Revoke</button>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </TabsContent>

        <TabsContent value="logs" className="mt-4 space-y-4">
          <div>
            <h2 className="text-xl font-headline font-bold mb-1">Access Logs</h2>
            <p className="text-sm text-muted-foreground">Complete transparency</p>
          </div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-headline flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />Access History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Hospital</TableHead>
                      <TableHead className="text-xs">Type</TableHead>
                      <TableHead className="text-xs">Date & Time</TableHead>
                      <TableHead className="text-xs">Purpose</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_ACCESS_LOGS.map((log, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium text-xs md:text-sm">
                          <div className="flex items-center gap-1">
                            <Hospital className="h-3 w-3 text-muted-foreground" />
                            <span>{log.institution_id}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={log.type === 'emergency' ? 'destructive' : 'default'} className="text-xs">
                            {log.type === 'emergency' ? 'SOS' : 'Normal'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">
                          {new Date(log.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {log.reason || 'Provider access'}
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
            <AlertDescription className="text-sm">Every access is logged and auditable</AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="emergency" className="mt-4 space-y-4">
          <div>
            <h2 className="text-xl font-headline font-bold mb-1">Emergency Information</h2>
            <p className="text-sm text-muted-foreground">Critical data for emergencies</p>
          </div>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm"><strong>Emergency Policy:</strong> Critical info accessible in life-threatening situations</AlertDescription>
          </Alert>
          <div className="grid gap-3 md:grid-cols-2">
            <EmergencyCard title="Blood Group" icon={Activity} description="Critical for transfusions" bgColor="border-red-200 bg-red-50/50 dark:bg-red-950/10" textColor="text-red-700 dark:text-red-400">
              <p className="text-2xl md:text-3xl font-bold text-red-700 dark:text-red-400">{aggregatedData.blood_group}</p>
            </EmergencyCard>
            <EmergencyCard title="Critical Allergies" icon={AlertTriangle} description="Must avoid" bgColor="border-orange-200 bg-orange-50/50 dark:bg-orange-950/10" textColor="text-orange-700 dark:text-orange-400">
              <div className="flex flex-wrap gap-2">
                {Array.from(aggregatedData.allergies).map((allergy, idx) => (
                  <Badge key={idx} variant="destructive" className="text-xs">{allergy}</Badge>
                ))}
              </div>
            </EmergencyCard>
            <EmergencyCard title="Chronic Conditions" icon={Heart} description="Ongoing conditions" bgColor="border-blue-200 bg-blue-50/50 dark:bg-blue-950/10" textColor="text-blue-700 dark:text-blue-400">
              <div className="space-y-1">
                {Array.from(aggregatedData.conditions).map((condition, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                    <span className="text-sm">{condition}</span>
                  </div>
                ))}
              </div>
            </EmergencyCard>
            <EmergencyCard title="Current Medication" icon={Activity} description="Active prescriptions" bgColor="border-purple-200 bg-purple-50/50 dark:bg-purple-950/10" textColor="text-purple-700 dark:text-purple-400">
              <div className="space-y-1">
                {Array.from(aggregatedData.medications).map((medication, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
                    <span className="text-sm">{medication}</span>
                  </div>
                ))}
              </div>
            </EmergencyCard>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
