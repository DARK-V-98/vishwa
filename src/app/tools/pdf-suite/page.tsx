
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ImagesToPdf from '@/components/tools/ImagesToPdf';
import PdfToImages from '@/components/tools/PdfToImages';
import { FileImage, Lock, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
                            Convert, Create, and Manage Your PDF Files — 100% Browser-Based.
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
        </div>
    );
}
