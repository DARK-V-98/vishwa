
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ImagesToPdf from '@/components/tools/ImagesToPdf';
import PdfToImages from '@/components/tools/PdfToImages';
import { FileImage, Lock, ArrowLeft, Zap, Shield, Globe, Users, Cpu, FileCheck2, Fingerprint, Image, List, CheckCircle, Package } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

const featureList = [
    { icon: Zap, title: "Blazing-Fast Conversion", description: "Processes files instantly in your browser." },
    { icon: Shield, title: "100% Secure & Private", description: "Your files are never uploaded to any server." },
    { icon: Globe, title: "Works Offline", description: "Use the tool even without an internet connection." },
    { icon: FileCheck2, title: "High-Quality Output", description: "Maintains the best possible quality for your files." },
];

const howItWorksSteps = [
    "Select the tool you need: Images to PDF or PDF to Images.",
    "Drag and drop your file(s) into the designated area.",
    "The tool processes everything locally in your browser.",
    "Preview the output directly on the page.",
    "Click 'Download' to save the result instantly."
];

const faqItems = [
    { q: "Is this PDF converter tool really free?", a: "Yes, our PDF suite is completely free to use with no hidden costs or sign-ups required. All features are available to you instantly." },
    { q: "Are my files safe and private?", a: "Absolutely. The entire conversion process happens inside your browser. Your files are never uploaded to our servers, ensuring your data remains 100% private and secure." },
    { q: "Do I need to install any software?", a: "No installation is needed. This is a fully browser-based tool. As long as you have a modern web browser, you can use it anytime, anywhere." },
    { q: "Is there a limit on file size or number of files?", a: "Because the tool runs on your device, the only limit is your browser's and computer's memory. For most users, this allows for converting very large files and many pages without issues." },
    { q: "Which browsers are supported?", a: "Our tools are optimized for modern browsers like Google Chrome, Firefox, Safari, and Microsoft Edge. For the best performance, we recommend using the latest version." },
];


export default function PdfSuitePage() {
    return (
        <div className="min-h-screen bg-gradient-subtle">
            {/* Hero Section */}
            <section className="pt-24 pb-12 md:pt-32 md:pb-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto mb-8">
                        <Button variant="outline" asChild>
                            <Link href="/tools">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Tools
                            </Link>
                        </Button>
                    </div>
                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        <div className="inline-block">
                            <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold border border-primary/20">
                                PDF Tools
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold">
                            <span className="bg-gradient-hero bg-clip-text text-transparent">
                                PDF Tools Suite
                            </span>
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Convert, Create, and Manage Your PDF Files — 100% Browser-Based. This free online tool lets you convert images to PDF and extract PDF pages as images with complete privacy.
                        </p>
                    </div>
                </div>
            </section>

            {/* Tools Grid */}
            <section className="py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <Card className="w-full max-w-4xl mx-auto shadow-strong border-border/50 bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-2xl flex items-center gap-3">
                                <FileImage className="text-primary" /> Image ↔ PDF Converter
                            </CardTitle>
                            <CardDescription>
                                Convert images to a single PDF or extract pages from a PDF as images.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Alert className="mb-6 bg-primary/5 border-primary/20">
                                <Lock className="h-4 w-4 text-primary" />
                                <AlertTitle className="text-primary">Your Privacy is Protected</AlertTitle>
                                <AlertDescription>
                                    Your files never leave your device. All conversions are done locally in your browser for maximum security.
                                </AlertDescription>
                            </Alert>

                            <Tabs defaultValue="img-to-pdf" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="img-to-pdf">Images to PDF</TabsTrigger>
                                    <TabsTrigger value="pdf-to-img">PDF to Images</TabsTrigger>
                                </TabsList>
                                <TabsContent value="img-to-pdf" className="mt-6">
                                    <ImagesToPdf />
                                </TabsContent>
                                <TabsContent value="pdf-to-img" className="mt-6">
                                    <PdfToImages />
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </section>
            
             {/* Content Sections */}
            <div className="container mx-auto px-4 py-16 space-y-16 max-w-4xl">
                {/* Key Features */}
                <section>
                    <h2 className="text-3xl font-bold text-center mb-10">Powerful Features, Total Privacy</h2>
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
                
                 {/* How it Works */}
                <section>
                    <h2 className="text-3xl font-bold text-center mb-10">Simple Steps, Instant Results</h2>
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

                {/* Advantages */}
                <section>
                    <h2 className="text-3xl font-bold text-center mb-10">Why Use This PDF Suite?</h2>
                     <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                        <CardContent className="p-6 space-y-4">
                            <p className="text-muted-foreground">Our PDF Tools Suite stands out by prioritizing your privacy above all else. Unlike most online converters that upload your files to a server, our tool processes everything directly on your device. This means zero risk of your data being stored, viewed, or compromised. It's not just safer—it's also faster, as there's no upload/download lag. Whether you're handling sensitive documents or just want peace of mind, this client-side approach is the modern, secure way to manage your files.</p>
                        </CardContent>
                    </Card>
                </section>

                {/* Use Cases */}
                <section>
                    <h2 className="text-3xl font-bold text-center mb-10">Who Is This For?</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                         {["Students", "Designers", "Office Workers", "Developers", "Business Owners", "Researchers"].map(role => (
                            <Badge key={role} variant="secondary" className="px-4 py-2 text-sm">{role}</Badge>
                         ))}
                    </div>
                </section>

                {/* FAQ */}
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
                
                 {/* Final Note */}
                <section className="text-center">
                     <Card className="bg-gradient-hero border-0 shadow-strong">
                        <CardContent className="p-8 text-primary-foreground">
                            <h3 className="text-2xl font-bold mb-4">Ready to Try More?</h3>
                            <p className="mb-6">You've seen how easy and secure our PDF converter is. Explore our full collection of free, browser-based tools designed by ESystemLK to make your digital life easier.</p>
                            <Button asChild variant="secondary">
                                <Link href="/tools">Explore All Tools <ArrowLeft className="mr-2 h-4 w-4" /></Link>
                            </Button>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
    );
}
