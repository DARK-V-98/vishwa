'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { FileKey2, ArrowLeft, Shield, Zap, Package, Image, Video, MonitorPlay } from 'lucide-react';
import ImageConverter from '@/components/tools/ImageConverter';
import VideoConverter from '@/components/tools/VideoConverter';

const featureList = [
    { icon: Image, title: "Image Conversion", description: "Convert between JPG, PNG, WebP, and more." },
    { icon: Video, title: "Video Transcoding", description: "Change video formats like MP4 to WebM, powered by FFmpeg." },
    { icon: Shield, title: "100% Private & Secure", description: "Files are processed in your browser and never uploaded to a server." },
    { icon: Zap, title: "Fast Client-Side Processing", description: "Leverages your computer's power for quick conversions." },
];

const howItWorksSteps = [
    "Select the 'Image Converter' or 'Video Converter' tab.",
    "Drag and drop your file(s) or click to upload.",
    "Choose your desired output format from the dropdown menu.",
    "Adjust quality or compression settings if available.",
    "Click 'Convert' and wait for the process to complete.",
    "Download your converted file(s) individually or as a single ZIP archive."
];

const faqItems = [
    { q: "Are my files uploaded to a server?", a: "No. This tool is 100% client-side. All conversion processes happen locally in your web browser. Your files never leave your computer, ensuring complete privacy." },
    { q: "Is this file converter free to use?", a: "Yes, it is completely free. There are no watermarks, usage limits, or hidden costs." },
    { q: "Why is video conversion slow?", a: "Video transcoding is a very resource-intensive task. Since it runs in your browser using WebAssembly (FFmpeg.wasm), performance depends on your computer's CPU. It may be slower than server-based converters but is far more secure." },
    { q: "What file sizes are supported?", a: "For images, most file sizes are handled easily. For videos, very large files (multiple gigabytes) might cause your browser to become slow or run out of memory. We recommend refreshing the page after a large conversion." },
    { q: "Can I convert multiple files at once?", a: "Yes, the Image Converter fully supports batch processing. You can upload multiple images and convert them all simultaneously. The Video Converter currently processes one file at a time due to its high resource usage." },
];

export default function FileConverterPage() {
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
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent">File Converter</h1>
                    <p className="text-xl text-muted-foreground mt-4 max-w-3xl mx-auto">A powerful, all-in-one tool to convert your image and video files. Secure, private, and incredibly fast—all from within your browser.</p>
                </div>
            </section>

            <section className="container mx-auto px-4 pb-16">
                <Card className="w-full max-w-4xl mx-auto shadow-strong border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl flex items-center gap-3">
                            <FileKey2 className="text-primary" />
                            Converter Suite
                        </CardTitle>
                        <CardDescription>
                            Choose between the Image and Video converters below.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Alert className="mb-6 bg-primary/5 border-primary/20">
                            <Shield className="h-4 w-4 text-primary" />
                            <AlertTitle className="text-primary">Your Privacy is Guaranteed</AlertTitle>
                            <AlertDescription>
                                Your files are never uploaded. All conversions happen locally on your device for maximum security and speed.
                            </AlertDescription>
                        </Alert>

                        <Tabs defaultValue="image-converter" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="image-converter"><Image className="mr-2"/>Image Converter</TabsTrigger>
                                <TabsTrigger value="video-converter"><MonitorPlay className="mr-2"/>Video Converter</TabsTrigger>
                            </TabsList>
                            <TabsContent value="image-converter" className="mt-6">
                                <ImageConverter />
                            </TabsContent>
                            <TabsContent value="video-converter" className="mt-6">
                                <VideoConverter />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </section>
            
            <div className="container mx-auto px-4 py-16 space-y-16 max-w-4xl">
                 <section>
                    <h2 className="text-3xl font-bold text-center mb-10">Key Features</h2>
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
                    <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
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
                    <h2 className="text-3xl font-bold text-center mb-10">Common Use Cases</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                         {["Web Developers", "Content Creators", "Marketers", "Students", "Photographers", "Videographers"].map(role => (
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