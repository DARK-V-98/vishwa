
'use client';
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FileDropzone from '@/components/tools/FileDropzone';
import { ScanLine, Camera, Upload, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import jsQR from 'jsqr';

export default function QrScannerPage() {
    const [scanResult, setScanResult] = useState('');
    const [error, setError] = useState('');
    const [useCamera, setUseCamera] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleDrop = (files: File[]) => {
        const file = files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) return;
                    ctx.drawImage(img, 0, 0);
                    const imageData = ctx.getImageData(0, 0, img.width, img.height);
                    const code = jsQR(imageData.data, imageData.width, imageData.height);
                    if (code) {
                        setScanResult(code.data);
                        setError('');
                        toast.success("QR Code found!");
                    } else {
                        setError("No QR code found in the image.");
                        toast.error("No QR code found.");
                    }
                };
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    };
    
    useEffect(() => {
        let stream: MediaStream | null = null;
        let animationFrameId: number;

        const tick = () => {
            if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && canvasRef.current) {
                const video = videoRef.current;
                const canvas = canvasRef.current;
                canvas.height = video.videoHeight;
                canvas.width = video.videoWidth;
                const ctx = canvas.getContext('2d');
                if(ctx){
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const code = jsQR(imageData.data, imageData.width, imageData.height);
                    if (code) {
                        setScanResult(code.data);
                        setUseCamera(false); // Turn off camera on successful scan
                    }
                }
            }
            animationFrameId = requestAnimationFrame(tick);
        };

        if (useCamera) {
            navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
                .then(s => {
                    stream = s;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        videoRef.current.play();
                        animationFrameId = requestAnimationFrame(tick);
                    }
                })
                .catch(err => {
                    setError("Camera access denied. Please enable camera permissions.");
                    setUseCamera(false);
                });
        }

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            cancelAnimationFrame(animationFrameId);
        };
    }, [useCamera]);

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <section className="pt-24 pb-12 md:pt-32 md:pb-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent">QR Code Scanner</h1>
                    <p className="text-xl text-muted-foreground mt-4">Scan QR codes using your camera or by uploading an image.</p>
                </div>
            </section>
            <section className="container mx-auto px-4 pb-16">
                <Card className="max-w-2xl mx-auto shadow-strong">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ScanLine /> Scan QR Code</CardTitle>
                        <CardDescription>Use your camera or upload an image file to scan.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {useCamera ? (
                             <div className="space-y-4">
                                <video ref={videoRef} className="w-full rounded-md border" />
                                <canvas ref={canvasRef} style={{ display: 'none' }} />
                                <Button variant="outline" onClick={() => setUseCamera(false)}>Stop Camera</Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <Button onClick={() => setUseCamera(true)} className="w-full">
                                    <Camera className="mr-2" /> Use Camera
                                </Button>
                                <div className="text-center text-muted-foreground">OR</div>
                                <FileDropzone onDrop={handleDrop} accept={{ 'image/*': [] }} multiple={false} />
                            </div>
                        )}
                        {error && <div className="text-destructive flex items-center gap-2"><AlertTriangle />{error}</div>}
                        {scanResult && (
                            <div className="pt-4 border-t">
                                <h3 className="font-semibold">Scan Result:</h3>
                                <p className="p-4 bg-muted rounded-md font-mono break-all">{scanResult}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
