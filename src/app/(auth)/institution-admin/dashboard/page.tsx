"use client";

import { useUser, useDoc, useMemoFirebase, useFirestore } from "@/firebase";
import { doc, collection } from 'firebase/firestore';
import type { InstitutionAdmin, Institution } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Building, Users, Activity, ShieldCheck, UserCircle } from "lucide-react";

export default function InstitutionAdminDashboardPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();

    const adminDocRef = useMemoFirebase(() => user ? doc(firestore, 'institutionAdmins', user.uid) : null, [firestore, user]);
    const { data: admin, isLoading: isAdminLoading } = useDoc<InstitutionAdmin>(adminDocRef);

    const institutionDocRef = useMemoFirebase(() => admin?.institutionId ? doc(firestore, 'institutions', admin.institutionId) : null, [firestore, admin]);
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
        return <div>Could not load administration data. Please try again.</div>
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-headline font-bold">
                    {institution.name}
                </h1>
                <p className="text-muted-foreground">
                    Welcome to the SwasthyaSetu Healthcare Institution Admin Portal.
                </p>
            </div>
            
            <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
                    <TabsTrigger value="overview"><Building className="mr-2" />Overview</TabsTrigger>
                    <TabsTrigger value="providers"><Users className="mr-2" />Providers</TabsTrigger>
                    <TabsTrigger value="logs"><Activity className="mr-2" />Audit Logs</TabsTrigger>
                    <TabsTrigger value="usage"><ShieldCheck className="mr-2" />Compliance</TabsTrigger>
                    <TabsTrigger value="profile"><UserCircle className="mr-2" />Profile</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Institution Overview</CardTitle>
                            <CardDescription>Key details and status of your institution.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="grid gap-4 md:grid-cols-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base font-medium">Institution Name</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-2xl font-bold">{institution.name}</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base font-medium">Status</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-2xl font-bold capitalize">{institution.status}</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base font-medium">Location</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-lg">{institution.city}, {institution.state}</p>
                                    </CardContent>
                                </Card>
                                 <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base font-medium">Institution Type</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-lg">{institution.type}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="providers" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Health Provider Management</CardTitle>
                            <CardDescription>Onboard, manage, and view health providers at your institution.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Provider management functionality coming soon.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
                 <TabsContent value="logs" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Access & Audit Logs</CardTitle>
                            <CardDescription>View institution-level access and activity logs.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Audit log functionality coming soon.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
                 <TabsContent value="usage" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Compliance & Usage Metrics</CardTitle>
                            <CardDescription>Monitor compliance and view usage statistics for your institution.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Compliance metrics coming soon.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
                 <TabsContent value="profile" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Admin Profile & Settings</CardTitle>
                            <CardDescription>Manage your administrator profile.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p><strong>Name:</strong> {admin.name}</p>
                            <p><strong>Email:</strong> {admin.email}</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
