"use client";

import { useMemo } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import type { Institution } from '@/lib/types';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import {
    Activity,
    AlertTriangle,
    Building,
    CheckCircle2,
    Clock,
    MoreHorizontal,
    ShieldCheck,
    Slash,
    XCircle,
} from 'lucide-react';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function PlatformAdminView() {
    const { toast } = useToast();
    const firestore = useFirestore();
    const institutionsRef = useMemoFirebase(() => collection(firestore, 'institutions'), [firestore]);
    const { data: institutions, isLoading } = useCollection<Institution>(institutionsRef);

    const handleUpdateStatus = (institutionId: string, status: Institution['status']) => {
        const docRef = doc(firestore, 'institutions', institutionId);
        updateDocumentNonBlocking(docRef, { status });
        toast({
            title: 'Institution Status Updated',
            description: `The institution has been marked as ${status}.`,
        });
    };

    const stats = useMemo(() => {
        if (!institutions) {
            return { total: 0, active: 0, pending: 0, rejected: 0, suspended: 0 };
        }
        return {
            total: institutions.length,
            active: institutions.filter(i => i.status === 'active' || i.status === 'approved').length,
            pending: institutions.filter(i => i.status === 'pending').length,
            rejected: institutions.filter(i => i.status === 'rejected').length,
            suspended: institutions.filter(i => i.status === 'suspended').length,
        };
    }, [institutions]);

    const getStatusVariant = (status: Institution['status']): 'default' | 'secondary' | 'destructive' | 'outline' => {
        switch (status) {
            case 'active':
            case 'approved': 
                return 'default';
            case 'pending': 
                return 'secondary';
            case 'rejected':
            case 'suspended':
                return 'destructive';
            default: 
                return 'outline';
        }
    }
    
    const getStatusIcon = (status: Institution['status']) => {
        switch (status) {
            case 'active':
            case 'approved':
                return <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />;
            case 'pending': 
                return <Clock className="mr-2 h-4 w-4 text-yellow-500" />;
            case 'rejected': 
                return <XCircle className="mr-2 h-4 w-4 text-red-500" />;
             case 'suspended': 
                return <Slash className="mr-2 h-4 w-4 text-gray-500" />;
            default: 
                return null;
        }
    }

    const renderLoadingState = () => (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
            </div>
            <Card>
                <CardHeader><Skeleton className="h-8 w-48" /></CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    if (isLoading) {
        return renderLoadingState();
    }

    return (
        <div className="space-y-6">
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Admin Access Notice</AlertTitle>
                <AlertDescription>
                    No patient or clinical data is accessible from this portal. All actions are logged for audit purposes.
                </AlertDescription>
            </Alert>
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="overview"><Building className="mr-2 h-4 w-4" />Overview</TabsTrigger>
                    <TabsTrigger value="institutions"><Activity className="mr-2 h-4 w-4" />Institution Management</TabsTrigger>
                    <TabsTrigger value="apis"><ShieldCheck className="mr-2 h-4 w-4" />API & Compliance</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Institutions</CardTitle>
                                <Building className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active</CardTitle>
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.active}</div>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                                <Clock className="h-4 w-4 text-yellow-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.pending}</div>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Suspended/Rejected</CardTitle>
                                <XCircle className="h-4 w-4 text-red-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.rejected + stats.suspended}</div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="institutions">
                    <Card>
                        <CardHeader>
                            <CardTitle>Registered Institutions</CardTitle>
                            <CardDescription>
                                Approve, reject, or suspend healthcare institutions on the platform.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Institution</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead><span className="sr-only">Actions</span></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {institutions?.map((inst) => (
                                        <TableRow key={inst.id}>
                                            <TableCell className="font-medium">{inst.name}</TableCell>
                                            <TableCell>{inst.city}, {inst.state}</TableCell>
                                            <TableCell>{inst.type}</TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusVariant(inst.status)} className="capitalize">
                                                    {getStatusIcon(inst.status)}
                                                    {inst.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Toggle menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        {inst.status === 'pending' && (
                                                            <>
                                                                <DropdownMenuItem onClick={() => handleUpdateStatus(inst.id, 'active')}>Approve</DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleUpdateStatus(inst.id, 'rejected')}>Reject</DropdownMenuItem>
                                                            </>
                                                        )}
                                                        {inst.status === 'active' && (
                                                            <DropdownMenuItem onClick={() => handleUpdateStatus(inst.id, 'suspended')}>Suspend</DropdownMenuItem>
                                                        )}
                                                        {inst.status === 'suspended' || inst.status === 'rejected' ? (
                                                            <DropdownMenuItem onClick={() => handleUpdateStatus(inst.id, 'active')}>Re-activate</DropdownMenuItem>
                                                        ) : null}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="apis">
                     <Card>
                        <CardHeader>
                            <CardTitle>API & Compliance Management</CardTitle>
                            <CardDescription>
                                Monitor API usage and manage compliance across the platform.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">API management and compliance features are coming soon.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

    