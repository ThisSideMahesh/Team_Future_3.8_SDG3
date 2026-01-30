"use client";

import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

type QrScannerProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onScan: (data: string) => void;
}

export function QrScanner({ open, onOpenChange, onScan }: QrScannerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | undefined>(undefined);
    const { toast } = useToast();

    useEffect(() => {
        if (open) {
            const getCameraPermission = async () => {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    setHasCameraPermission(true);

                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                } catch (error) {
                    console.error('Error accessing camera:', error);
                    setHasCameraPermission(false);
                    toast({
                        variant: 'destructive',
                        title: 'Camera Access Denied',
                        description: 'Please enable camera permissions in your browser settings to use this app.',
                    });
                }
            };
            getCameraPermission();
        } else {
            // Stop camera stream when dialog is closed
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
                videoRef.current.srcObject = null;
            }
        }
    }, [open, toast]);

    // Mock scanning
    const handleMockScan = () => {
        const mockPatientId = 'PAT12345';
        onScan(mockPatientId);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Scan Patient QR Code</DialogTitle>
                    <DialogDescription>
                        Point your camera at the patient's QR code to find their record.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
                        <video ref={videoRef} className="h-full w-full object-cover" autoPlay muted playsInline />
                        {hasCameraPermission === false && (
                             <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                <Alert variant="destructive" className="w-auto">
                                    <AlertTitle>Camera Access Required</AlertTitle>
                                    <AlertDescription>
                                        Please allow camera access.
                                    </AlertDescription>
                                </Alert>
                             </div>
                        )}
                    </div>
                </div>
                 <DialogFooter>
                    <Button onClick={handleMockScan}>Simulate Scan</Button>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
