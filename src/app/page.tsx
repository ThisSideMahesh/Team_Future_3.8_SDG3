import Image from "next/image";
import Link from "next/link";
import { Stethoscope, User, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Logo from "@/components/icons/logo";

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-image');

  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Logo />
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/login/patient">Patient Login</Link>
          </Button>
          <Button asChild>
            <Link href="/login/doctor">Health Provider Login</Link>
          </Button>
        </div>
      </header>
      <main className="flex-grow">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
               <h1 className="font-headline text-4xl md:text-6xl font-bold">
                A Unified Health Record for a Healthier India.
              </h1>
              <p className="text-lg text-muted-foreground max-w-prose">
                SwasthyaSetu is a unified platform connecting patients and health providers for a seamless healthcare experience. Access your aggregated health records from multiple providers, all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/login/doctor">
                    I'm a Health Provider <Stethoscope className="ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/login/patient">
                    I'm a Patient <User className="ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative h-64 md:h-auto md:aspect-[4/3] rounded-xl overflow-hidden shadow-2xl">
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  fill
                  className="object-cover"
                  data-ai-hint={heroImage.imageHint}
                />
              )}
               <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
            </div>
          </div>
        </section>

        <section className="bg-card py-16 md:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">Unified Health, Simplified</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
                    SwasthyaSetu brings together your medical history from different hospitals into a single, easy-to-understand timeline.
                </p>
                <div className="grid md:grid-cols-3 gap-8">
                    <Card className="text-left">
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2">
                                <Stethoscope className="text-primary"/> For Health Providers
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Get a comprehensive view of your patient's medical history. Make more informed decisions with aggregated data and critical alerts.</p>
                        </CardContent>
                    </Card>
                    <Card className="text-left">
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2">
                                <User className="text-primary"/> For Patients
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Your complete health journey at your fingertips. Manage consent and see who has accessed your records, ensuring privacy and control.</p>
                        </CardContent>
                    </Card>
                    <Card className="text-left">
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2">
                                <ShieldCheck className="text-primary"/> Secure & Private
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Built with privacy at its core. You control your data. We ensure it's secure, using industry-standard authentication and encryption.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
      </main>
      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} SwasthyaSetu. All rights reserved.</p>
      </footer>
    </div>
  );
}

    