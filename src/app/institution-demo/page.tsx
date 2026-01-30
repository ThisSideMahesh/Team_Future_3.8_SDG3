"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building, Users, Activity, ShieldCheck, UserPlus, UserMinus } from "lucide-react";

const MOCK_PROVIDERS = [
  { provider_id: "HP_001", name: "Dr. Aarav Mehta", specialization: "Cardiologist", active: true },
  { provider_id: "HP_002", name: "Dr. Priya Sharma", specialization: "Emergency Medicine", active: true },
  { provider_id: "HP_003", name: "Dr. Raj Kumar", specialization: "General Practitioner", active: false }
];

const MOCK_AUDIT_LOGS = [
  { date: "2026-01-28 10:30", access_type: "Normal", provider_id: "HP_001" },
  { date: "2026-01-27 22:15", access_type: "Emergency", provider_id: "HP_002" },
  { date: "2026-01-26 14:00", access_type: "Normal", provider_id: "HP_001" }
];

const MOCK_METRICS = {
  total_accesses: 156,
  emergency_accesses: 12,
  active_providers: 2
};

export default function InstitutionDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header with Logo */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:justify-between bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <Image src="/swasthyasetu-logo.png" alt="SwasthyaSetu" width={60} height={60} priority />
            <div>
              <h1 className="text-2xl md:text-3xl font-headline font-bold text-primary">
                AarogyaNova Hospital
              </h1>
              <p className="text-sm text-muted-foreground">Institution Governance Dashboard</p>
            </div>
          </div>
          <Card className="flex items-center gap-3 p-3">
            <Building className="h-10 w-10 text-primary" />
            <div>
              <p className="font-semibold">Admin User</p>
              <p className="text-xs text-muted-foreground">Institution Admin</p>
            </div>
          </Card>
        </div>

        {/* Activity Metrics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-500" />
                Total Accesses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{MOCK_METRICS.total_accesses}</p>
              <p className="text-xs text-muted-foreground mt-1">All-time record accesses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-red-500" />
                Emergency Accesses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">{MOCK_METRICS.emergency_accesses}</p>
              <p className="text-xs text-muted-foreground mt-1">Critical access events</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-green-500" />
                Active Providers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{MOCK_METRICS.active_providers}</p>
              <p className="text-xs text-muted-foreground mt-1">Currently active</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="providers">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="providers">
              <Users className="h-4 w-4 mr-2" />
              Providers
            </TabsTrigger>
            <TabsTrigger value="logs">
              <Activity className="h-4 w-4 mr-2" />
              Audit Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="providers" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Provider Management</span>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Provider
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Provider ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Specialization</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_PROVIDERS.map((provider) => (
                        <TableRow key={provider.provider_id}>
                          <TableCell className="font-mono text-xs">{provider.provider_id}</TableCell>
                          <TableCell className="font-medium">{provider.name}</TableCell>
                          <TableCell>{provider.specialization}</TableCell>
                          <TableCell>
                            <Badge variant={provider.active ? "default" : "secondary"}>
                              {provider.active ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <UserMinus className="h-3 w-3 mr-1" />
                              {provider.active ? "Deactivate" : "Activate"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Audit Logs (Metadata Only)</CardTitle>
                <CardDescription>No patient data shown - Privacy protected</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Access Type</TableHead>
                        <TableHead>Provider ID</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_AUDIT_LOGS.map((log, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{log.date}</TableCell>
                          <TableCell>
                            <Badge variant={log.access_type === "Emergency" ? "destructive" : "default"}>
                              {log.access_type}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-xs">{log.provider_id}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Note: Patient identifiers not visible to protect privacy.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
