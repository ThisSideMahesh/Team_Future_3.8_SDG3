"use client";

import Image from "next/image";
import { useUser, useDoc, useMemoFirebase, useFirestore } from "@/firebase";
import { doc } from 'firebase/firestore';
import type { User } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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

export default function InstitutionAdminDashboardPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const adminDocRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
    const { data: admin } = useDoc<User>(adminDocRef);

    const institutionName = "AarogyaNova Hospital";
    const adminName = admin?.name || "Admin User";

    return (
        <div className="space-y-6 pb-12">
            {/* Header with Logo */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
                <div className="flex items-center gap-4">
                    <Image src="/swasthyasetu-logo.png" alt="SwasthyaSetu" width={60} height={60} priority />
                    <div>
                        <h1 className="text-2xl md:text-3xl font-headline font-bold text-primary">
                            {institutionName}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Institution Governance Dashboard
                        </p>
                    </div>
                </div>
                <Card className="flex items-center gap-3 p-3 shadow-md">
                    <Building className="h-10 w-10 text-primary" />
                    <div>
                        <p className="font-semibold">{adminName}</p>
                        <p className="text-xs text-muted-foreground">Institution Admin</p>
                    </div>
                </Card>
            </div>

            {/* Activity Metrics */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-medium flex items-center gap-2">
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
                        <CardTitle className="text-base font-medium flex items-center gap-2">
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
                        <CardTitle className="text-base font-medium flex items-center gap-2">
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
                    <TabsTrigger value="providers" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Providers
                    </TabsTrigger>
                    <TabsTrigger value="logs" className="flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Audit Logs
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="providers" className="mt-4 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Healthcare Provider Management</span>
                                <Button className="flex items-center gap-2">
                                    <UserPlus className="h-4 w-4" />
                                    Add Provider
                                </Button>
                            </CardTitle>
                            <CardDescription>Manage healthcare providers at your institution</CardDescription>
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
                                                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                                                        <UserMinus className="h-3 w-3" />
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
                            <CardTitle>Access & Audit Logs (Metadata Only)</CardTitle>
                            <CardDescription>View institution-level access activity - No patient data shown</CardDescription>
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
                                                <TableCell className="text-sm">{log.date}</TableCell>
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
                                Note: Patient identifiers and medical data are not visible to institution admins for privacy protection.
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
import { doc, collection, query, where } from 'firebase/firestore';
import type { InstitutionAdmin as AdminProfile, Institution } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Building, Users, Activity, ShieldCheck, UserPlus, UserMinus } from "lucide-react";

// Mock data for demo
const MOCK_PROVIDERS = [
  { provider_id: "HP_001", name: "Dr. Aarav Mehta", email: "aarav.mehta@aarogyanova.demo", specialization: "Cardiologist", active: true },
  { provider_id: "HP_002", name: "Dr. Priya Sharma", email: "priya.sharma@aarogyanova.demo", specialization: "Emergency Medicine", active: true },
  { provider_id: "HP_003", name: "Dr. Raj Kumar", email: "raj.kumar@aarogyanova.demo", specialization: "General Practitioner", active: false }
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

export default function InstitutionAdminDashboardPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();

    const adminDocRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
    const { data: admin, isLoading: isAdminLoading } = useDoc<AdminProfile>(adminDocRef);

    const institutionDocRef = useMemoFirebase(() => admin?.institution_id ? doc(firestore, 'institutions', admin.institution_id) : null, [firestore, admin]);
    const { data: institution, isLoading: isInstitutionLoading } = useDoc<Institution>(institutionDocRef);
    
    const isLoading = isUserLoading || isAdminLoading || isInstitutionLoading;

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
                 <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    if (!admin || !institution) {
        return <div className="text-center py-12">Could not load administration data. Please try again.</div>
    }

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-headline font-bold text-primary">
                        {institution.name}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Institution Governance Dashboard
                    </p>
                </div>
                <Card className="flex items-center gap-3 p-3 shadow-md">
                    <Building className="h-10 w-10 text-primary" />
                    <div>
                        <p className="font-semibold">{admin.name}</p>
                        <p className="text-xs text-muted-foreground">Institution Admin</p>
                    </div>
                </Card>
            </div>

            {/* SECTION 2: Activity Metrics */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-medium flex items-center gap-2">
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
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-red-500" />
                            Emergency Accesses
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-red-600">{MOCK_METRICS.emergency_accesses}</p>
                        <p className=\"text-xs text-muted-foreground mt-1\">Critical access events</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className=\"pb-3\">
                        <CardTitle className=\"text-base font-medium flex items-center gap-2\">
                            <Users className=\"h-4 w-4 text-green-500\" />
                            Active Providers
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className=\"text-3xl font-bold text-green-600\">{MOCK_METRICS.active_providers}</p>
                        <p className=\"text-xs text-muted-foreground mt-1\">Currently active</p>
                    </CardContent>
                </Card>
            </div>
            
            <Tabs defaultValue=\"providers\">
                <TabsList className=\"grid w-full grid-cols-3\">
                    <TabsTrigger value=\"providers\" className=\"flex items-center gap-2\">
                        <Users className=\"h-4 w-4\" />
                        Providers
                    </TabsTrigger>
                    <TabsTrigger value=\"logs\" className=\"flex items-center gap-2\">
                        <Activity className=\"h-4 w-4\" />
                        Audit Logs
                    </TabsTrigger>
                    <TabsTrigger value=\"overview\" className=\"flex items-center gap-2\">
                        <Building className=\"h-4 w-4\" />
                        Overview
                    </TabsTrigger>
                </TabsList>

                {/* SECTION 1: Provider Management */}
                <TabsContent value=\"providers\" className=\"mt-4 space-y-4\">
                    <Card>
                        <CardHeader>
                            <CardTitle className=\"flex items-center justify-between\">
                                <span>Healthcare Provider Management</span>
                                <Button className=\"flex items-center gap-2\">
                                    <UserPlus className=\"h-4 w-4\" />
                                    Add Provider
                                </Button>
                            </CardTitle>
                            <CardDescription>Manage healthcare providers at your institution</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className=\"rounded-md border\">
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
                                                <TableCell className=\"font-mono text-xs\">{provider.provider_id}</TableCell>
                                                <TableCell className=\"font-medium\">{provider.name}</TableCell>
                                                <TableCell>{provider.specialization}</TableCell>
                                                <TableCell>
                                                    <Badge variant={provider.active ? \"default\" : \"secondary\"}>
                                                        {provider.active ? \"Active\" : \"Inactive\"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Button variant=\"ghost\" size=\"sm\" className=\"flex items-center gap-1\">
                                                        <UserMinus className=\"h-3 w-3\" />
                                                        {provider.active ? \"Deactivate\" : \"Activate\"}
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

                {/* SECTION 3: Audit Logs */}
                <TabsContent value=\"logs\" className=\"mt-4\">
                    <Card>
                        <CardHeader>
                            <CardTitle>Access & Audit Logs (Metadata Only)</CardTitle>
                            <CardDescription>View institution-level access activity - No patient data shown</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className=\"rounded-md border\">
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
                                                <TableCell className=\"text-sm\">{log.date}</TableCell>
                                                <TableCell>
                                                    <Badge variant={log.access_type === \"Emergency\" ? \"destructive\" : \"default\"}>
                                                        {log.access_type}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className=\"font-mono text-xs\">{log.provider_id}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            <p className=\"text-xs text-muted-foreground mt-4\">
                                Note: Patient identifiers and medical data are not visible to institution admins for privacy protection.
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value=\"overview\" className=\"mt-4\">
                    <Card>
                        <CardHeader>
                            <CardTitle>Institution Overview</CardTitle>
                            <CardDescription>Key details and status</CardDescription>
                        </CardHeader>
                        <CardContent className=\"space-y-4\">
                             <div className=\"grid gap-4 md:grid-cols-2\">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className=\"text-base font-medium\">Institution Name</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className=\"text-xl font-bold\">{institution.name}</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className=\"text-base font-medium\">Status</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Badge variant={institution.status === \"ACTIVE\" ? \"default\" : \"secondary\"} className=\"text-lg\">
                                            {institution.status}
                                        </Badge>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className=\"text-base font-medium\">Location</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className=\"text-lg\">{institution.city}, {institution.state}</p>
                                    </CardContent>
                                </Card>
                                 <Card>
                                    <CardHeader>
                                        <CardTitle className=\"text-base font-medium\">Institution ID</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className=\"text-lg font-mono\">{institution.institution_id}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
