
'use client';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ImagesToPdf from './ImagesToPdf';
import PdfToImages from './PdfToImages';
import { FileImage, Image, AlertCircle, Lock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

export default function ImagePdfConverter() {
    return (
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
    );
}
