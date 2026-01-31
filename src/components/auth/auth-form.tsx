"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowRight } from "lucide-react";
import { useAuth, useUser, initiateEmailSignIn, initiateEmailSignUp, useFirebase } from "@/firebase";
import { doc, setDoc, getDoc, query, collection, where, getDocs } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Logo from "@/components/icons/logo";
import { useToast } from "@/hooks/use-toast";
import type { User as UserProfile } from "@/lib/types";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  name: z.string().optional(),
});

type AuthFormProps = {
  userType: "healthcare_provider" | "patient" | "institution_admin" | "platform_admin";
};

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
      email: "", // Default email will be set in the placeholder
      password: "123456", // Pre-fill for demo purposes
      name: "",
    },
  });

  // Redirect if user is already logged in
  useEffect(() => {
    if (!isUserLoading && user) {
        let path = '/';
        switch (userType) {
            case 'healthcare_provider': path = '/healthcare-provider/dashboard'; break;
            case 'patient': path = '/patient/dashboard'; break;
            case 'institution_admin': path = '/institution-admin/dashboard'; break;
            case 'platform_admin': path = '/platform-admin/dashboard'; break;
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
            case 'auth/invalid-credential':
              description = "Account not found or invalid credentials. If this is your first time using this demo email, please use the 'Sign Up' tab to activate it.";
              break;
            case 'auth/wrong-password':
            case 'auth/email-already-in-use':
              description = "An account with this email is already in use. Please log in.";
              setIsLogin(true);
              break;
            case 'auth/weak-password':
              description = "The password is too weak. It must be at least 6 characters long.";
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
    } else { // Sign up logic
      if (!values.name && userType === 'patient') {
        form.setError("name", { type: "manual", message: "Name is required for sign up." });
        setIsLoading(false);
        return;
      }
      
      initiateEmailSignUp(auth, values.email, values.password)
          .then(async (userCredential) => {
              const authUser = userCredential.user;
              
              // For demo, we fetch the pre-seeded user data to create the auth account
              // In a real app, this would be a more complex invitation/verification flow
              const userRef = doc(firestore, "users", authUser.uid);
              
              // This is a simplified demo flow. We find the pre-seeded user doc by its email
              // and essentially "claim" it by setting its data on a new doc with the real auth UID.
              const q = query(collection(firestore, "users"), where("email", "==", values.email));
              const querySnapshot = await getDocs(q);

              let userProfileData: Omit<UserProfile, 'user_id'> | null = null;
              
              if (!querySnapshot.empty) {
                // User is pre-seeded, use that data
                userProfileData = querySnapshot.docs[0].data() as UserProfile;
              } else if (userType === 'patient') {
                // This is a new patient signing up
                userProfileData = {
                  name: values.name!,
                  email: values.email,
                  role: 'patient',
                  active: true,
                  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxwZXJzb24lMjBwb3J0cmFpdHxlbnwwfHx8fDE3Njk3NDY1MTR8MA&ixlib=rb-4.1.0&q=80&w=1080'
                };
              }
              
              if (!userProfileData) {
                toast({
                  variant: "destructive",
                  title: "Registration Denied",
                  description: "This email is not registered for this role. Please use a pre-approved demo email.",
                });
                // We should delete the created auth user here, but for a demo this is acceptable
                throw new Error("User not found in seeded data and is not a patient.");
              }

              const finalProfile: UserProfile = {
                ...userProfileData,
                user_id: authUser.uid, // Overwrite with the real auth UID
              };

              await setDoc(userRef, finalProfile);
          })
          .catch(error => {
            if (!error.message.includes("User not found")) {
                handleAuthError(error);
            }
          })
          .finally(() => setIsLoading(false));
    }
  };
  
  let userTypeName: string;
  let defaultEmail: string;
  switch(userType) {
    case 'healthcare_provider': 
      userTypeName = 'Healthcare Provider'; 
      defaultEmail = 'aarav.mehta@aarogyanova.demo';
      break;
    case 'patient': 
      userTypeName = 'Patient'; 
      defaultEmail = 'rohit.verma@example.com';
      break;
    case 'institution_admin': 
      userTypeName = 'Institution Admin';
      defaultEmail = 'admin@aarogyanova.demo';
      break;
    case 'platform_admin': 
      userTypeName = 'Platform Admin'; 
      defaultEmail = 'platform.admin@swasthyasetu.demo';
      break;
  }

  const title = isLogin ? "Login" : "Sign Up";
  const description = `Enter your details to ${isLogin ? "access your account" : "create an account"}.`;
  const buttonText = isLogin ? "Login" : "Sign Up";
  const toggleText = isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login";
  
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
              {!isLogin && userType === 'patient' && (
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
                     {userType !== 'patient' && (
                        <FormDescription>
                           For demo, use the <strong>Sign Up</strong> tab first with a pre-seeded email to activate the account.
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
