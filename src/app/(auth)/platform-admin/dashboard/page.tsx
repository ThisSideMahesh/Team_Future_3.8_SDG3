import { PlatformAdminView } from "./components/platform-admin-view";

export default function PlatformAdminDashboardPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-headline font-bold">SwasthyaSetu Platform Admin Portal</h1>
            <p className="text-muted-foreground">Manage institutions, monitor platform health, and govern API access.</p>
            <PlatformAdminView />
        </div>
    );
}

    