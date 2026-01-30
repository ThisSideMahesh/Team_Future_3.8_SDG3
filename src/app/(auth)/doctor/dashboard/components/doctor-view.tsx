"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AlertCircle, QrCode, Search, ShieldAlert } from 'lucide-react';
import Image from 'next/image';
import { useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection } from 'firebase/firestore';

import type { Patient, MedicalEvent } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import MedicalTimeline from '@/components/dashboard/medical-timeline';
import { Separator } from '@/components/ui/separator';
import { QrScanner } from './qr-scanner';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const searchSchema = z.object({
  patientId: z.string().nonempty({ message: 'Patient ID is required.' }),
});

export function HealthcareProviderView() {
  const [searchedPatientId, setSearchedPatientId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: { patientId: '' },
  });

  const patientRef = useMemoFirebase(() => searchedPatientId ? doc(firestore, 'patients', searchedPatientId) : null, [firestore, searchedPatientId]);
  const { data: patient, isLoading: isPatientLoading, error: patientError } = useDoc<Patient>(patientRef);
  
  const healthRecordsRef = useMemoFirebase(() => searchedPatientId ? collection(firestore, `healthRecords/${searchedPatientId}/records`) : null, [firestore, searchedPatientId]);
  const { data: medicalHistory, isLoading: isHistoryLoading } = useCollection<MedicalEvent>(healthRecordsRef);


  const onSubmit = async (data: z.infer<typeof searchSchema>) => {
    setSearchedPatientId(null);
    setError(null);
    setSearchedPatientId(data.patientId);
  };

  const handleQrScan = (scannedId: string) => {
    form.setValue('patientId', scannedId);
    toast({
        title: "QR Code Scanned",
        description: `Patient ID ${scannedId} has been entered.`,
    })
    setIsScannerOpen(false);
    onSubmit({ patientId: scannedId });
  };
  
  const isLoading = isPatientLoading || isHistoryLoading;

  const criticalAlerts = medicalHistory?.filter(
    (event) => event.type === 'Allergy' || event.type === 'Chronic Condition'
  ) || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Healthcare Provider Portal</h1>
        <p className="text-muted-foreground">Search for a patient to view their unified health record.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Patient Search</CardTitle>
          <CardDescription>Search by Patient ID, Health ID / QR Code, or TEMP-ID only.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row items-start gap-4">
              <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem className="w-full sm:w-auto flex-grow">
                    <FormLabel>Patient ID</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., k2Rz3...sN4P1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full sm:w-auto pt-0 sm:pt-8 flex items-center gap-2">
                <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                  {isLoading ? 'Searching...' : <><Search className="mr-2 h-4 w-4" /> Fetch Unified Health Record</>}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsScannerOpen(true)} className="w-full sm:w-auto">
                   <QrCode className="mr-2 h-4 w-4" /> Scan QR
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <QrScanner open={isScannerOpen} onOpenChange={setIsScannerOpen} onScan={handleQrScan} />
      
      { (patientError || (searchedPatientId && !isLoading && !patient)) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {patientError ? `Permission Denied or ${patientError.message}` : "Patient not found or consent not granted. Please check the ID and patient consent status."}
          </AlertDescription>
        </Alert>
      )}

      {isLoading && <Skeleton className="h-96 w-full" />}

      {patient && !isLoading && (
        <div className="space-y-8">
            <Card>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <Image src={patient.avatarUrl} alt={patient.name} width={80} height={80} className="rounded-full border" />
                    <div>
                        <CardTitle className="font-headline text-2xl">{patient.name}</CardTitle>
                        <CardDescription>ID: {patient.id} &bull; DoB: {new Date(patient.dateOfBirth).toLocaleDateString()}</CardDescription>
                    </div>
                </CardHeader>
                {criticalAlerts.length > 0 && (
                <CardContent>
                    <Separator className="my-4" />
                    <div className="space-y-4">
                        <h3 className="font-headline text-lg font-semibold flex items-center gap-2">
                           <ShieldAlert className="text-destructive"/> Critical Alerts
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2">
                            {criticalAlerts.map(alert => (
                                <Alert key={alert.id} variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>{alert.title}</AlertTitle>
                                    <AlertDescription>{alert.details}</AlertDescription>
                                </Alert>
                            ))}
                        </div>
                    </div>
                </CardContent>
                 )}
            </Card>
          
            <div>
              <h2 className="text-2xl font-headline font-bold mb-4">Aggregated Medical Timeline</h2>
              <MedicalTimeline events={medicalHistory || []} />
            </div>
        </div>
      )}
    </div>
  );
}

    

    