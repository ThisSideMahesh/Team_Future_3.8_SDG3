"use client";

import type { MedicalEvent } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Pill, FlaskConical, ShieldAlert, HeartPulse, Microscope } from "lucide-react";
import { cn } from "@/lib/utils";

type MedicalTimelineProps = {
  events: MedicalEvent[];
};

const eventConfig = {
    Appointment: { icon: Stethoscope, color: "bg-blue-500" },
    Medication: { icon: Pill, color: "bg-green-500" },
    Diagnosis: { icon: Microscope, color: "bg-purple-500" },
    Allergy: { icon: ShieldAlert, color: "bg-red-500" },
    "Chronic Condition": { icon: HeartPulse, color: "bg-yellow-500 text-black"},
    "Lab Test": { icon: FlaskConical, color: "bg-indigo-500" },
};

export default function MedicalTimeline({ events }: MedicalTimelineProps) {
  if (!events || events.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">No medical history found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative pl-6 before:absolute before:left-0 before:top-0 before:h-full before:w-0.5 before:bg-border">
      {events.map((event, index) => {
        const Config = eventConfig[event.type] || eventConfig.Appointment;
        const Icon = Config.icon;

        return (
          <div key={event.id} className="relative mb-8">
            <div className={cn("absolute -left-[35px] top-1 flex h-8 w-8 items-center justify-center rounded-full text-white", Config.color)}>
              <Icon size={16} />
            </div>
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div>
                        <CardTitle className="font-headline text-lg">{event.title}</CardTitle>
                        <CardDescription>
                            {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} &bull; by {event.doctor.name} ({event.doctor.specialty})
                        </CardDescription>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <Badge variant="secondary" className={cn(event.type === 'Allergy' && 'bg-destructive/80 text-destructive-foreground')}>{event.type}</Badge>
                        <Badge variant="outline">Source: {event.source}</Badge>
                    </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{event.details}</p>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
