"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import type { Patient, AccessLog, Consent, MedicalEvent } from "@/lib/types";
import { useFirestore, useUser, useDoc, useCollection, useMemoFirebase } from "@/firebase";
import { doc, collection, setDoc, query, where } from "firebase/firestore";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import MedicalTimeline from "@/components/dashboard/medical-timeline";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { Skeleton } from "@/components/ui/skeleton";

export function PatientView() {
  const { user } = useUser();
  const firestore = useFirestore();

  const patientRef = useMemoFirebase(() => user ? doc(firestore, "patients", user.uid) : null, [firestore, user]);
  const { data: patient, isLoading: isPatientLoading } = useDoc<Patient>(patientRef);

  const consentRef = useMemoFirebase(() => user ? doc(firestore, `patients/${user.uid}/consents`, user.uid) : null, [firestore, user]);
  const { data: consent, isLoading: isConsentLoading } = useDoc<Consent>(consentRef);
  
  const healthRecordsRef = useMemoFirebase(() => user ? collection(firestore, `healthRecords/${user.uid}/records`) : null, [firestore, user]);
  const { data: medicalHistory, isLoading: isHistoryLoading } = useCollection<MedicalEvent>(healthRecordsRef);

  const accessLogsQuery = useMemoFirebase(() => user ? query(collection(firestore, `accessLogs`), where('patientId', '==', user.uid)) : null, [firestore, user]);
  const {data: accessLogs, isLoading: isLogsLoading} = useCollection<AccessLog>(accessLogsQuery)


  const handleConsentChange = (granted: boolean) => {
    if (user && consentRef) {
      const consentData: Consent = { patientId: user.uid, granted };
      setDocumentNonBlocking(consentRef, consentData, { merge: true });
    }
  };

  if (isPatientLoading || isConsentLoading || isHistoryLoading || isLogsLoading) {
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

  if (!patient) {
    return <div>Could not load patient data.</div>
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
                <p className="text-sm text-muted-foreground">ID: {patient.id}</p>
            </div>
        </Card>
      </div>

      <Tabs defaultValue="record">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="record">My Health Record</TabsTrigger>
          <TabsTrigger value="privacy">Consent & Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="record" className="mt-6">
            <h2 className="text-2xl font-headline font-bold mb-4">Aggregated Medical Timeline</h2>
            <MedicalTimeline events={medicalHistory || []} />
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
              <CardTitle className="font-headline">Data Access Logs</CardTitle>
              <CardDescription>
                This log shows who has accessed your unified health record and when.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Accessor</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Reason</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {(accessLogs || []).map(log => (
                            <TableRow key={log.id}>
                                <TableCell className="font-medium">{log.accessorName}</TableCell>
                                <TableCell>{log.accessorRole}</TableCell>
                                <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                                <TableCell>{log.reason}</TableCell>
                            </TableRow>
                        ))}
                         {(!accessLogs || accessLogs.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground">
                                    No access logs found.
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

    