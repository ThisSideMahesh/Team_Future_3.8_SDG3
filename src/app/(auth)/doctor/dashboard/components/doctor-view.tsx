"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AlertCircle, QrCode, Search, ShieldAlert, User } from 'lucide-react';
import Image from 'next/image';

import type { Patient, MedicalEvent } from '@/lib/types';
import { getPatientById } from '@/lib/data';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import MedicalTimeline from '@/components/dashboard/medical-timeline';
import { Separator } from '@/components/ui/separator';
import { QrScanner } from './qr-scanner';
import { useToast } from '@/hooks/use-toast';

const searchSchema = z.object({
  patientId: z.string().nonempty({ message: 'Patient ID is required.' }),
});

export function DoctorView() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: { patientId: 'PAT12345' },
  });

  const onSubmit = async (data: z.infer<typeof searchSchema>) => {
    setIsLoading(true);
    setPatient(null);
    setError(null);
    try {
      const foundPatient = await getPatientById(data.patientId);
      if (foundPatient) {
        setPatient(foundPatient);
      } else {
        setError('Patient not found. Please check the ID and try again.');
      }
    } catch (err) {
      setError('An error occurred while fetching patient data.');
    }
    setIsLoading(false);
  };

  const handleQrScan = (scannedId: string) => {
    form.setValue('patientId', scannedId);
    toast({
        title: "QR Code Scanned",
        description: `Patient ID ${scannedId} has been entered.`,
    })
    setIsScannerOpen(false);
  };

  const criticalAlerts = patient?.medicalHistory.filter(
    (event) => event.type === 'Allergy' || event.type === 'Chronic Condition'
  ) || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Doctor Dashboard</h1>
        <p className="text-muted-foreground">Search for a patient to view their unified health record.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Patient Search</CardTitle>
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
                      <Input placeholder="e.g., PAT12345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full sm:w-auto pt-0 sm:pt-8 flex items-center gap-2">
                <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                  {isLoading ? 'Searching...' : <><Search className="mr-2 h-4 w-4" /> Search</>}
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

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {patient && (
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
              <MedicalTimeline events={patient.medicalHistory} />
            </div>
        </div>
      )}
    </div>
  );
}
