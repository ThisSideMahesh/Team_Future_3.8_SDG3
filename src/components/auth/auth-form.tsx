"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowRight } from "lucide-react";
import { useAuth, useUser, initiateEmailSignIn, initiateEmailSignUp, useFirebase } from "@/firebase";
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Logo from "@/components/icons/logo";
import { useToast } from "@/hooks/use-toast";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import type { Patient, HealthcareProvider, InstitutionAdmin, PlatformAdmin } from "@/lib/types";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  name: z.string().optional(),
});

type UserProfile = Patient | HealthcareProvider | InstitutionAdmin | PlatformAdmin;

type AuthFormProps = {
  userType: "healthcare-provider" | "patient" | "institution-admin" | "platform-admin";
};

const demoHealthcareProviders = [
    { email: 'aarav.mehta@aarogyanova.demo', name: 'Dr. Aarav Mehta', role: 'Emergency Medical Officer', institutionName: 'AarogyaNova Hospital' },
    { email: 'kavya.nair@aarogyanova.demo', name: 'Nurse Kavya Nair', role: 'Emergency Nurse', institutionName: 'AarogyaNova Hospital' },
    { email: 'rohan.k@jeevanpath.demo', name: 'Dr. Rohan Kulkarni', role: 'General Physician', institutionName: 'JeevanPath Medical Center' },
    { email: 'pooja.verma@jeevanpath.demo', name: 'Nurse Pooja Verma', role: 'ICU Nurse', institutionName: 'JeevanPath Medical Center' },
    { email: 'neel.shah@swasthicare.demo', name: 'Dr. Neel Shah', role: 'Internal Medicine Specialist', institutionName: 'SwasthiCare General Hospital' },
    { email: 'isha.d@pranasetu.demo', name: 'Dr. Isha Deshmukh', role: 'Medical Officer', institutionName: 'PranaSetu Health Institute' },
    { email: 'arjun.rao@arogyadeep.demo', name: 'Nurse Arjun Rao', role: 'Emergency Triage Nurse', institutionName: 'ArogyaDeep Community Hospital' },
    { email: 'ananya.sen@jeevanrekha.demo', name: 'Dr. Ananya Sen', role: 'Duty Doctor', institutionName: 'JeevanRekha Rural Health Centre' },
    { email: 'vikram.j@swasthyakiran.demo', name: 'Lab Officer Vikram Joshi', role: 'Diagnostic Officer', institutionName: 'SwasthyaKiran Diagnostic Labs' },
    { email: 'meera.p@jeevanraksha.demo', name: 'Dr. Meera Patel', role: 'Emergency Consultant', institutionName: 'JeevanRaksha Emergency Hospital' },
];

export default function AuthForm({ userType }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const { firestore } = useFirebase();
  const { user, isUserLoading } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: userType === 'healthcare-provider' ? 'aarav.mehta@aarogyanova.demo' : userType === 'institution-admin' ? 'admin@aarogyanova.demo' : userType === 'platform-admin' ? 'admin@swasthyasetu.org' : 'rohan.sharma@example.com',
      password: "password",
      name: "",
    },
  });

  useEffect(() => {
    if (!isUserLoading && user) {
        let path = '/';
        switch (userType) {
            case 'healthcare-provider': path = '/health-provider/dashboard'; break;
            case 'patient': path = '/patient/dashboard'; break;
            case 'institution-admin': path = '/institution-admin/dashboard'; break;
            case 'platform-admin': path = '/platform-admin/dashboard'; break;
        }
        router.push(path);
    }
  }, [user, isUserLoading, router, userType]);


  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    const handleAuthError = (error: any) => {
        let description = "An unknown authentication error occurred.";
        if (error.code) {
          switch (error.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
              description = "Invalid credentials. Please check your email and password.";
              break;
            case 'auth/email-already-in-use':
              description = "An account with this email is already in use. Please log in.";
              setIsLogin(true); // Switch to login view
              break;
            case 'auth/weak-password':
              description = "The password is too weak. It must be at least 6 characters long.";
              break;
            case 'permission-denied':
                description = "There was an issue setting up your profile. Please try again.";
                break;
            default:
              description = `An error occurred: ${error.message}`;
              break;
          }
        }
        toast({
          variant: "destructive",
          title: "Authentication Failed",
          description: description,
        });
    }

    if (isLogin) {
        initiateEmailSignIn(auth, values.email, values.password)
            .catch(handleAuthError)
            .finally(() => setIsLoading(false));
    } else { // Sign up
        if (userType !== 'patient' && (!values.name || values.name.trim() === "")) {
            if(userType === 'healthcare-provider') {
                // Name is pre-filled for demo providers, so this check is a safeguard
            } else {
                 form.setError("name", { type: "manual", message: "Name is required for sign up." });
                 setIsLoading(false);
                 return;
            }
        }


        initiateEmailSignUp(auth, values.email, values.password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                
                let collectionName: string;
                
                const defaultName = values.name || values.email.split('@')[0];
                const defaultEmail = values.email;

                switch(userType) {
                    case 'healthcare-provider': {
                        const demoProvider = demoHealthcareProviders.find(p => p.email === values.email);
                        if (!demoProvider) {
                            toast({
                                variant: "destructive",
                                title: "Registration Error",
                                description: "This email is not associated with a pre-registered healthcare provider. Please use one of the demo accounts.",
                            });
                            return Promise.reject(new Error("Provider not found in demo list."));
                        }

                        const institutionsRef = collection(firestore, 'institutions');
                        const q = query(institutionsRef, where('name', '==', demoProvider.institutionName));
                        const instSnapshot = await getDocs(q);

                        if (instSnapshot.empty) {
                            toast({
                                variant: "destructive",
                                title: "Registration Error",
                                description: `Could not find the institution '${demoProvider.institutionName}' for this provider.`,
                            });
                            return Promise.reject(new Error("Institution not found."));
                        }
                        
                        const institutionDoc = instSnapshot.docs[0];
                        
                        collectionName = 'healthcareProviders';
                        const newProvider: HealthcareProvider = {
                            id: user.uid,
                            name: demoProvider.name,
                            email: values.email,
                            role: demoProvider.role,
                            institutionId: institutionDoc.id,
                            avatarUrl: PlaceHolderImages.find(p => p.id === 'doctor-avatar-1')?.imageUrl || ''
                        };
                        return setDoc(doc(firestore, collectionName, user.uid), newProvider);
                    }
                    case 'institution-admin': {
                        const institutionsRef = collection(firestore, 'institutions');
                        const q = query(institutionsRef, where('adminEmail', '==', defaultEmail));
                        const instSnapshot = await getDocs(q);
                        
                        const activeInstitutionDoc = instSnapshot.docs.find(d => d.data().status === 'active');

                        if (!activeInstitutionDoc) {
                             toast({
                                variant: "destructive",
                                title: "Registration Error",
                                description: "This email is not associated with a pre-registered, active institution. Please contact support.",
                            });
                            return Promise.reject(new Error("Active institution not found for admin email."));
                        }

                        const newAdmin: InstitutionAdmin = {
                            id: user.uid,
                            name: defaultName,
                            email: defaultEmail,
                            avatarUrl: PlaceHolderImages.find(p => p.id === 'admin-avatar-1')?.imageUrl || '',
                            institutionId: activeInstitutionDoc.id,
                            role: 'Primary Admin'
                         };
                         return setDoc(doc(firestore, 'institutionAdmins', user.uid), newAdmin);
                    }
                    case 'platform-admin':
                        collectionName = 'platformAdmins';
                        const newPlatformAdmin: PlatformAdmin = {
                            id: user.uid,
                            name: defaultName,
                            email: defaultEmail,
                            avatarUrl: PlaceHolderImages.find(p => p.id === 'admin-avatar-1')?.imageUrl || ''
                        };
                         return setDoc(doc(firestore, collectionName, user.uid), newPlatformAdmin);
                    case 'patient':
                    default:
                        collectionName = 'patients';
                        const newPatient: Patient = {
                            id: user.uid,
                            name: values.name || 'New Patient', // Capture name on signup for patients too
                            email: defaultEmail,
                            dateOfBirth: '1990-01-01',
                            avatarUrl: PlaceHolderImages.find(p => p.id === 'patient-avatar-1')?.imageUrl || '',
                            bloodGroup: 'O+'
                        };
                        return setDoc(doc(firestore, collectionName, user.uid), newPatient);
                }
            })
            .catch(error => {
                if (error.message.includes("not found")) {
                    // Errors are already handled by toasts within the logic, so we can ignore them here.
                } else {
                     handleAuthError(error);
                }
            })
            .finally(() => setIsLoading(false));
    }
  };
  
  let userTypeName: string;
  let defaultEmail: string;
  switch(userType) {
    case 'healthcare-provider': 
      userTypeName = 'Healthcare Provider'; 
      defaultEmail = 'aarav.mehta@aarogyanova.demo';
      break;
    case 'patient': 
      userTypeName = 'Patient'; 
      defaultEmail = 'rohan.sharma@example.com';
      break;
    case 'institution-admin': 
      userTypeName = 'Institution Admin';
      defaultEmail = 'admin@aarogyanova.demo';
      break;
    case 'platform-admin': 
      userTypeName = 'Platform Admin'; 
      defaultEmail = 'admin@swasthyasetu.org';
      break;
  }

  const title = isLogin ? "Login" : "Sign Up";
  const description = `Enter your details to ${isLogin ? "access your account" : "create an account"}.`;
  const buttonText = isLogin ? "Login" : "Sign Up";
  const toggleText = isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login";
  
  form.watch('email');

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <Link href="/" className="flex justify-center mb-4">
                <Logo />
            </Link>
          <CardTitle className="font-headline text-2xl">{`${userTypeName} ${title}`}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {!isLogin && (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder={`e.g. ${defaultEmail}`} {...field} />
                    </FormControl>
                     {userType === 'healthcare-provider' && !isLogin && (
                        <FormDescription>
                            Only pre-registered provider emails are allowed.
                        </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading || isUserLoading}>
                {isLoading || isUserLoading ? 'Processing...' : buttonText}
                {!isLoading && !isUserLoading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
            {toggleText}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

    