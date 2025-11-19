
'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, MonitorPlay, Shield } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Dynamically import the heavy VideoConverter component
const VideoConverter = dynamic(() => import('@/components/tools/VideoConverter'), {
    ssr: false, // This component will only be rendered on the client side
    loading: () => (
        <div className="space-y-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
    ),
});


export default function VideoConverterPage() {
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
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent">Video Converter</h1>
                    <p className="text-xl text-muted-foreground mt-4 max-w-3xl mx-auto">Convert your video files to different formats like MP4, WebM, MOV, and AVI. The entire process runs securely in your browser.</p>
                </div>
            </section>

            <section className="container mx-auto px-4 pb-16">
                <Card className="w-full max-w-4xl mx-auto shadow-strong border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl flex items-center gap-3">
                            <MonitorPlay className="text-primary" />
                            Browser-Based Video Conversion
                        </CardTitle>
                        <CardDescription>
                           Upload a video, choose an output format, and convert. Powered by FFmpeg.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Alert className="mb-6 bg-primary/5 border-primary/20">
                            <Shield className="h-4 w-4 text-primary" />
                            <AlertTitle className="text-primary">Secure & Private</AlertTitle>
                            <AlertDescription>
                                Your video files are processed directly on your device and are never uploaded to a server.
                            </AlertDescription>
                        </Alert>
                        <Suspense fallback={<p>Loading converter...</p>}>
                           <VideoConverter />
                        </Suspense>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
