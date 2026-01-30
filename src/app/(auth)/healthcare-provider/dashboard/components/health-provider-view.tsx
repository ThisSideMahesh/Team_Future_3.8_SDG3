"use client";

import { useState } from "react";
import Image from "next/image";
import { useFirestore, useUser, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Search, Activity, AlertTriangle, Shield, User, QrCode, FileWarning, CheckCircle, XCircle, AlertOctagon } from "lucide-react";
import type { User as UserProfile } from "@/lib/types";

const MOCK_PATIENT_DATA = {
  patient_id: "PAT_001",
  name: "Rohit Verma",
  blood_group: "O+",
  conditions: ["Hypertension", "Type 2 Diabetes"],
  medications: ["Amlodipine", "Metformin"],
  allergies: ["Penicillin"],
  lab_summaries: ["BP: 150/95", "HbA1c: 6.5%"],
  last_updated: "2026-01-27T10:30:00Z",
  consent_granted: true
};

export function HealthcareProviderView() {
  const { user } = useUser();
  const firestore = useFirestore();
  
  const [patientId, setPatientId] = useState("");
  const [searchedPatient, setSearchedPatient] = useState<any>(null);
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);
  const [emergencyAccess, setEmergencyAccess] = useState(false);
  const [showTempIdDialog, setShowTempIdDialog] = useState(false);
  const [tempIdNotes, setTempIdNotes] = useState("");
  const [createdTempId, setCreatedTempId] = useState("");

  const userProfileRef = useMemoFirebase(() => user ? doc(firestore, "users", user.uid) : null, [firestore, user]);
  const { data: userProfile } = useDoc<UserProfile>(userProfileRef);

  const providerName = userProfile?.name || "Dr. Aarav Mehta";
  const institutionName = "AarogyaNova Hospital";

  const handleSearch = () => {
    if (!patientId.trim()) return;
    setSearchedPatient(MOCK_PATIENT_DATA);
    setEmergencyAccess(false);
  };

  const handleEmergencyAccess = () => {
    setShowEmergencyDialog(false);
    setEmergencyAccess(true);
    setSearchedPatient({
      ...MOCK_PATIENT_DATA,
      medications: null,
      lab_summaries: null,
    });
  };

  const handleCreateTempId = () => {
    if (!tempIdNotes.trim()) return;
    const newTempId = `TEMP_${Date.now()}`;
    setCreatedTempId(newTempId);
    setTempIdNotes("");
    setShowTempIdDialog(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Logo */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
        <div className="flex items-center gap-4">
          <Image src="/swasthyasetu-logo.png" alt="SwasthyaSetu" width={60} height={60} priority />
          <div>
            <h1 className="text-2xl md:text-3xl font-headline font-bold text-primary">Clinical Dashboard</h1>
            <p className="text-sm text-muted-foreground">{institutionName}</p>
          </div>
        </div>
        <Card className="flex items-center gap-3 p-3 shadow-md">
          <User className="h-10 w-10 text-primary" />
          <div>
            <p className="font-semibold">{providerName}</p>
            <p className="text-xs text-muted-foreground">Healthcare Provider</p>
          </div>
        </Card>
      </div>

      {/* Patient Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Patient Search
          </CardTitle>
          <CardDescription>Search by Patient ID, QR code, or TEMP-ID</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter Patient ID (e.g., PAT_001)"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              <QrCode className="h-4 w-4 mr-2" />
              Scan QR
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => setShowTempIdDialog(true)}>
              <FileWarning className="h-4 w-4 mr-2" />
              Create TEMP-ID
            </Button>
          </div>
          {createdTempId && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>TEMP-ID Created:</strong> {createdTempId} (Status: ACTIVE)
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {searchedPatient && (
        <Tabs defaultValue="record">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="record">Health Record</TabsTrigger>
            <TabsTrigger value="consent">Consent Status</TabsTrigger>
          </TabsList>

          <TabsContent value="record" className="mt-4 space-y-4">
            {!searchedPatient.consent_granted && !emergencyAccess ? (
              <Alert variant="destructive">
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Patient consent required for access.</strong>
                </AlertDescription>
              </Alert>
            ) : (
              <>
                {emergencyAccess && (
                  <Alert variant="destructive">
                    <AlertOctagon className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Emergency Access Active</strong> - Limited data only. Logged.
                    </AlertDescription>
                  </Alert>
                )}
                <Card>
                  <CardHeader>
                    <CardTitle>Unified Health Record - {searchedPatient.name}</CardTitle>
                    <CardDescription>Patient ID: {searchedPatient.patient_id}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card className="border-red-200 bg-red-50/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base text-red-700">Blood Group</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold text-red-700">{searchedPatient.blood_group}</p>
                        </CardContent>
                      </Card>

                      <Card className="border-orange-200 bg-orange-50/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base text-orange-700">Critical Allergies</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {searchedPatient.allergies.map((allergy: string, idx: number) => (
                              <Badge key={idx} variant="destructive">{allergy}</Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-blue-200 bg-blue-50/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base text-blue-700">Chronic Conditions</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-1">
                            {searchedPatient.conditions.map((condition: string, idx: number) => (
                              <div key={idx} className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                <span className="text-sm">{condition}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {!emergencyAccess && searchedPatient.medications && (
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base">Medications</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-1">
                              {searchedPatient.medications.map((med: string, idx: number) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                  <span className="text-sm">{med}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {!searchedPatient.consent_granted && !emergencyAccess && (
              <Card className="border-red-500">
                <CardHeader>
                  <CardTitle className="text-red-700">Emergency Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="destructive" onClick={() => setShowEmergencyDialog(true)} className="w-full">
                    Request Emergency Access
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="consent" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Consent Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-4 rounded-lg border">
                  {searchedPatient.consent_granted ? (
                    <>
                      <CheckCircle className="h-8 w-8 text-green-500" />
                      <div>
                        <p className="font-semibold text-green-700">Consent Granted</p>
                        <p className="text-sm text-muted-foreground">Full access permitted</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-8 w-8 text-red-500" />
                      <div>
                        <p className="font-semibold text-red-700">Consent Not Granted</p>
                        <p className="text-sm text-muted-foreground">Emergency access available</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      <AlertDialog open={showEmergencyDialog} onOpenChange={setShowEmergencyDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-700">Emergency Access Warning</AlertDialogTitle>
            <AlertDialogDescription>
              <p><strong>For life-threatening situations only.</strong></p>
              <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                <li>Limited data only</li>
                <li>Access will be logged</li>
                <li>Misuse may result in action</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowEmergencyDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleEmergencyAccess}>Confirm Emergency</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* TEMP-ID Creation Dialog */}
      <AlertDialog open={showTempIdDialog} onOpenChange={setShowTempIdDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <FileWarning className="h-5 w-5" />
              Create TEMP-ID for Unidentified Patient
            </AlertDialogTitle>
            <AlertDialogDescription>
              Create a temporary ID for an unidentified patient in an emergency situation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Emergency Notes</label>
              <Input
                placeholder="Enter basic emergency notes (e.g., trauma, unconscious)"
                value={tempIdNotes}
                onChange={(e) => setTempIdNotes(e.target.value)}
              />
            </div>
          </div>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => { setShowTempIdDialog(false); setTempIdNotes(""); }}>Cancel</Button>
            <Button onClick={handleCreateTempId} disabled={!tempIdNotes.trim()}>Create TEMP-ID</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
