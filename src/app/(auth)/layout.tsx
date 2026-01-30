'use client'

import { useEffect } from "react";
import { LogOut, Settings, User as UserIcon } from "lucide-react";
import { useAuth, useDoc, useFirebase, useMemoFirebase, useUser } from "@/firebase";
import { doc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useRouter, usePathname } from 'next/navigation';

import Logo from "@/components/icons/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import type { HealthProvider, Patient } from "@/lib/types";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const { firestore, auth } = useFirebase();
  const router = useRouter();
  const pathname = usePathname();

  const userType = pathname.includes('/doctor/') ? 'health-provider' : 'patient';
  const collectionName = userType === 'health-provider' ? 'healthProviders' : 'patients';

  useEffect(() => {
    if (!isUserLoading && !user) {
        const loginPath = userType === 'health-provider' ? '/login/doctor' : '/login/patient';
        router.push(loginPath);
    }
  }, [user, isUserLoading, router, userType]);

  const userDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, collectionName, user.uid);
  }, [firestore, user, collectionName]);

  const { data: userData, isLoading: isDataLoading } = useDoc<HealthProvider | Patient>(userDocRef);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  // A full-page loader is appropriate during the initial authentication check.
  if (isUserLoading) {
    return (
        <div className="flex h-screen w-full">
            <SidebarProvider>
                <Sidebar>
                    <SidebarHeader>
                        <Skeleton className="h-8 w-40" />
                    </SidebarHeader>
                </Sidebar>
                <SidebarInset>
                    <header className="flex h-16 items-center justify-end border-b bg-card px-4 md:px-6">
                        <Skeleton className="h-10 w-10 rounded-full" />
                    </header>
                    <main className="flex-1 p-4 md:p-6 lg:p-8">
                         <Skeleton className="h-full w-full" />
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </div>
    )
  }
  
  // If the user is not authenticated, the useEffect will handle redirection.
  // Show a simple loader to prevent rendering a broken UI before the redirect happens.
  if (!user) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <p>Loading...</p>
        </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          {/* Add navigation items here if needed */}
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex h-full flex-col">
          <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  {/* Show a skeleton while the user's profile data is loading */}
                  {isDataLoading || !userData ? (
                     <Skeleton className="h-10 w-10 rounded-full" />
                  ) : (
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={userData.avatarUrl} alt={userData.name} />
                      <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                {/* Also show skeletons for the dropdown content */}
                {isDataLoading || !userData ? (
                    <div className="p-2 space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                ) : (
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userData.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{userData.email}</p>
                    </div>
                  </DropdownMenuLabel>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

    