import { PlatformAdminView } from "../(auth)/platform-admin/dashboard/components/platform-admin-view";

export default function PlatformDemoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-headline font-bold">SwasthyaSetu Platform Admin Portal</h1>
          <p className="text-muted-foreground">Manage institutions, monitor platform health, and govern API access</p>
        </div>
        <PlatformAdminView />
      </div>
    </div>
  );
}
