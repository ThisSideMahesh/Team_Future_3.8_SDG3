"use client";

import Image from "next/image";
import { useState } from "react";
import type { Patient, AccessLog } from "@/lib/types";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import MedicalTimeline from "@/components/dashboard/medical-timeline";

type PatientViewProps = {
  patient: Patient;
  accessLogs: AccessLog[];
};

export function PatientView({ patient, accessLogs }: PatientViewProps) {
  const [consent, setConsent] = useState(true);

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
            <MedicalTimeline events={patient.medicalHistory} />
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
                  checked={consent}
                  onCheckedChange={setConsent}
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
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {accessLogs.map(log => (
                            <TableRow key={log.id}>
                                <TableCell className="font-medium">{log.accessorName}</TableCell>
                                <TableCell>{log.accessorRole}</TableCell>
                                <TableCell>{new Date(log.date).toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
