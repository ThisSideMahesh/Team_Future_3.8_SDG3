"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Building, Key, TrendingUp, CheckCircle, XCircle, RefreshCw, Shield } from "lucide-react";

const MOCK_INSTITUTIONS = [
  { institution_id: "INST_001", name: "AarogyaNova Hospital", city: "Devpur", state: "Dakshin Pradesh", status: "ACTIVE" },
  { institution_id: "INST_002", name: "JeevanPath Medical Center", city: "Shantipur", state: "Madhav Pradesh", status: "ACTIVE" },
  { institution_id: "INST_003", name: "SwasthiCare Hospital", city: "Anand Nagar", state: "Uttar Pradesh", status: "PENDING" },
  { institution_id: "INST_004", name: "PranaSetu Institute", city: "Gyanpur", state: "Vigyan Pradesh", status: "ACTIVE" }
];

const MOCK_API_KEYS = [
  { credential_id: "API_001", institution_id: "INST_001", api_key: "APIKEY_AAROGYANOVA_***", enabled: true },
  { credential_id: "API_002", institution_id: "INST_002", api_key: "APIKEY_JEEVANPATH_***", enabled: true },
  { credential_id: "API_003", institution_id: "INST_003", api_key: "APIKEY_SWASTHICARE_***", enabled: false }
];

const MOCK_METRICS = {
  total_institutions: 10,
  active_institutions: 7,
  api_calls_today: 1456,
  emergency_accesses_today: 23
};

export default function PlatformDemoPage() {
  const [showApiDialog, setShowApiDialog] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState("");
  const [newApiKey, setNewApiKey] = useState("");

  const handleGenerateApiKey = (institutionId: string) => {
    setSelectedInstitution(institutionId);
    setNewApiKey(`APIKEY_${institutionId}_${Date.now()}`);
    setShowApiDialog(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header with Logo */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-4 mb-3">
            <Image src="/swasthyasetu-logo.png" alt="SwasthyaSetu" width={60} height={60} priority />
            <div>
              <h1 className="text-2xl md:text-3xl font-headline font-bold text-primary">Platform Admin Portal</h1>
              <p className="text-sm text-muted-foreground">Manage institutions, monitor health, govern API access</p>
            </div>
          </div>
        </div>

        {/* Platform Metrics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Building className="h-4 w-4 text-blue-500" />
                Total Institutions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{MOCK_METRICS.total_institutions}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Active
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{MOCK_METRICS.active_institutions}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                API Calls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-600">{MOCK_METRICS.api_calls_today.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-red-500" />
                Emergency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">{MOCK_METRICS.emergency_accesses_today}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="institutions">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="institutions">
              <Building className="h-4 w-4 mr-2" />
              Institutions
            </TabsTrigger>
            <TabsTrigger value="api">
              <Key className="h-4 w-4 mr-2" />
              API Keys
            </TabsTrigger>
          </TabsList>

          <TabsContent value="institutions" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Institution Management</CardTitle>
                <CardDescription>Approve, suspend, manage institutions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Institution ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_INSTITUTIONS.map((inst) => (
                        <TableRow key={inst.institution_id}>
                          <TableCell className="font-mono text-xs">{inst.institution_id}</TableCell>
                          <TableCell className="font-medium">{inst.name}</TableCell>
                          <TableCell className="text-sm">{inst.city}, {inst.state}</TableCell>
                          <TableCell>
                            <Badge variant={inst.status === "ACTIVE" ? "default" : "secondary"}>
                              {inst.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {inst.status === "PENDING" && (
                              <Button size="sm">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Approve
                              </Button>
                            )}
                            {inst.status === "ACTIVE" && (
                              <Button size="sm" variant="destructive">
                                <XCircle className="h-3 w-3 mr-1" />
                                Suspend
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>API Key Management</CardTitle>
                <CardDescription>Generate, rotate, manage API keys</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Credential ID</TableHead>
                        <TableHead>Institution</TableHead>
                        <TableHead>API Key</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_API_KEYS.map((cred) => (
                        <TableRow key={cred.credential_id}>
                          <TableCell className="font-mono text-xs">{cred.credential_id}</TableCell>
                          <TableCell className="font-mono text-xs">{cred.institution_id}</TableCell>
                          <TableCell className="font-mono text-xs">{cred.api_key}</TableCell>
                          <TableCell>
                            <Badge variant={cred.enabled ? "default" : "secondary"}>
                              {cred.enabled ? "Enabled" : "Disabled"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleGenerateApiKey(cred.institution_id)}>
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Rotate
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-4">
                  <Button onClick={() => handleGenerateApiKey("NEW_INST")}>
                    <Key className="h-4 w-4 mr-2" />
                    Generate New Key
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <AlertDialog open={showApiDialog} onOpenChange={setShowApiDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>New API Key Generated</AlertDialogTitle>
              <AlertDialogDescription>
                API key for <strong>{selectedInstitution}</strong>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div>
              <div className="flex gap-2">
                <Input value={newApiKey} readOnly className="font-mono text-xs" />
                <Button size="sm" onClick={() => navigator.clipboard.writeText(newApiKey)}>Copy</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                ⚠️ Store securely. Won't be shown again.
              </p>
            </div>
            <AlertDialogFooter>
              <Button onClick={() => setShowApiDialog(false)}>Close</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
