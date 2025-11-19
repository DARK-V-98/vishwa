
'use client';
import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FileDropzone from '@/components/tools/FileDropzone';
import { Maximize, Download, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function ImageResizerPage() {
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [isResizing, setIsResizing] = useState(false);
    const originalDimensions = useRef({ width: 0, height: 0 });

    const handleDrop = (files: File[]) => {
        const file = files[0];
        if (file && file.type.startsWith('image/')) {
            setImage(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    originalDimensions.current = { width: img.width, height: img.height };
                    setWidth(img.width);
                    setHeight(img.height);
                };
                img.src = e.target?.result as string;
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            toast.error("Please upload a valid image file.");
        }
    };

    const handleResize = () => {
        if (!image || !imagePreview) return;

        setIsResizing(true);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            ctx?.drawImage(img, 0, 0, width, height);
            const resizedDataUrl = canvas.toDataURL(image.type);
            const link = document.createElement('a');
            link.href = resizedDataUrl;
            link.download = `resized-${image.name}`;
            link.click();
            setIsResizing(false);
            toast.success("Image resized and downloaded!");
        };
        img.src = imagePreview;
    };

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <section className="pt-24 pb-12 md:pt-32 md:pb-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent">Image Resizer</h1>
                    <p className="text-xl text-muted-foreground mt-4">Resize images to custom dimensions without losing quality.</p>
                </div>
            </section>
            <section className="container mx-auto px-4 pb-16">
                <Card className="max-w-2xl mx-auto shadow-strong">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Maximize /> Resize Your Image</CardTitle>
                        <CardDescription>Upload an image and specify new dimensions.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {!imagePreview && (
                            <FileDropzone onDrop={handleDrop} accept={{ 'image/*': ['.jpeg', '.png', '.gif'] }} multiple={false} />
                        )}
                        {imagePreview && (
                            <div className="space-y-4">
                                <div className="max-h-96 overflow-hidden rounded-md border flex justify-center">
                                    <img src={imagePreview} alt="Preview" className="object-contain max-h-96" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="width">Width (px)</Label>
                                        <Input id="width" type="number" value={width} onChange={e => setWidth(Number(e.target.value))} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="height">Height (px)</Label>
                                        <Input id="height" type="number" value={height} onChange={e => setHeight(Number(e.target.value))} />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={handleResize} disabled={isResizing} className="w-full">
                                        {isResizing ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2" />}
                                        Resize & Download
                                    </Button>
                                    <Button variant="outline" onClick={() => { setImage(null); setImagePreview(null); }}>
                                        Change Image
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
