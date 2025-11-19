
'use client';
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FileDropzone from '@/components/tools/FileDropzone';
import { ScanLine, Camera, Upload, AlertTriangle, ArrowLeft, Zap, Shield, Globe, Users } from 'lucide-react';
import { toast } from 'sonner';
import jsQR from 'jsqr';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

const featureList = [
    { icon: Camera, title: "Live Camera Scanning", description: "Use your device's camera to scan codes in real-time." },
    { icon: Upload, title: "Upload Image Files", description: "Scan QR codes from existing images or screenshots." },
    { icon: Shield, title: "100% Private", description: "All scanning is done in your browser. No images are uploaded." },
    { icon: Zap, title: "Instant Detection", description: "Quickly decodes URLs, text, and other data formats." },
];

const howItWorksSteps = [
    "Choose your method: 'Use Camera' or upload an image file.",
    "If using the camera, point it at a QR code.",
    "If uploading, drag and drop or select an image file containing a QR code.",
    "The tool will instantly scan and display the decoded information in the result box."
];

const faqItems = [
    { q: "Is the QR Code Scanner free to use?", a: "Yes, this tool is completely free and has no usage limits. Scan as many codes as you need." },
    { q: "Are my camera feed or images sent to a server?", a: "No. Your privacy is paramount. Both the live camera feed and any uploaded images are processed directly in your browser. Nothing is ever sent to or stored on a server." },
    { q: "Why isn't the camera working?", a: "Please ensure you have granted camera permissions to this website in your browser settings. If you denied it by accident, you may need to reset the permissions for this site." },
    { q: "What if the code isn't being detected?", a: "For best results, make sure the QR code is clear, well-lit, and not blurry. For camera scanning, hold your device steady. For image uploads, use a high-resolution image if possible." },
    { q: "Can this tool read barcodes too?", a: "This specific tool is designed only for QR codes. We have a separate Barcode Generator, and a scanner may be added in the future!" },
];

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
            if (useCamera) { // Continue ticking only if camera is active
                animationFrameId = requestAnimationFrame(tick);
            }
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
                    <div className="max-w-2xl mx-auto mb-8 text-left">
                        <Button variant="outline" asChild>
                            <Link href="/tools">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Tools
                            </Link>
                        </Button>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent">QR Code Scanner</h1>
                    <p className="text-xl text-muted-foreground mt-4 max-w-3xl mx-auto">A free, private, and fast QR code scanner that works from your camera or an image file. No uploads, 100% client-side processing.</p>
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
                                <div className="relative w-full aspect-video bg-black rounded-md overflow-hidden">
                                    <video ref={videoRef} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 border-4 border-primary/50 rounded-md animate-pulse"></div>
                                </div>
                                <canvas ref={canvasRef} style={{ display: 'none' }} />
                                <Button variant="outline" onClick={() => setUseCamera(false)} className="w-full">Stop Camera</Button>
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
                                {scanResult.startsWith('http') && (
                                    <Button asChild className="mt-2 w-full">
                                        <a href={scanResult} target="_blank" rel="noopener noreferrer">Open Link</a>
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </section>

             <div className="container mx-auto px-4 py-16 space-y-16 max-w-4xl">
                 <section>
                    <h2 className="text-3xl font-bold text-center mb-10">Key Scanner Features</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {featureList.map(feature => (
                             <div key={feature.title} className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0 shadow-medium">
                                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-3xl font-bold text-center mb-10">How to Scan a QR Code</h2>
                    <div className="grid grid-cols-1 gap-4">
                        {howItWorksSteps.map((step, index) => (
                            <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm">
                                <CardContent className="p-4 flex items-center gap-4">
                                    <div className="w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground rounded-full font-bold flex-shrink-0">{index + 1}</div>
                                    <p>{step}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
                
                 <section>
                    <h2 className="text-3xl font-bold text-center mb-10">Advantages of Our Secure Scanner</h2>
                     <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <p className="text-muted-foreground">Many QR scanner apps on mobile app stores come with ads, trackers, or questionable permissions. Our tool runs entirely in your browser using the `jsQR` library, meaning your camera feed and images are never sent to a server. This provides a clean, ad-free experience with an absolute guarantee of privacy. It's the safest way to scan unknown QR codes without risking your data.</p>
                        </CardContent>
                    </Card>
                </section>

                <section>
                    <h2 className="text-3xl font-bold text-center mb-10">Who Can Use This?</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                         {["Event Attendees", "Shoppers", "Restaurant Goers", "Travelers", "Tech Enthusiasts", "Anyone with a camera"].map(role => (
                            <Badge key={role} variant="secondary" className="px-4 py-2 text-sm">{role}</Badge>
                         ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
                    <Accordion type="single" collapsible className="w-full">
                        {faqItems.map(item => (
                            <AccordionItem value={item.q} key={item.q}>
                                <AccordionTrigger>{item.q}</AccordionTrigger>
                                <AccordionContent>{item.a}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </section>
            </div>
        </div>
    );
}
