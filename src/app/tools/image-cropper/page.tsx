
'use client';
import { useState, useRef } from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import ReactCrop, { centerCrop, makeAspectCrop, type Crop } from 'react-image-crop';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FileDropzone from '@/components/tools/FileDropzone';
import { Crop as CropIcon, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number): Crop {
  return centerCrop(
    makeAspectCrop({ unit: '%', width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight,
  );
}

export default function ImageCropperPage() {
    const [imgSrc, setImgSrc] = useState('');
    const imgRef = useRef<HTMLImageElement>(null);
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<Crop>();
    const [isCropping, setIsCropping] = useState(false);

    const onSelectFile = (files: File[]) => {
        if (files && files.length > 0) {
            setCrop(undefined); // Makes crop preview update between images.
            const reader = new FileReader();
            reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
            reader.readAsDataURL(files[0]);
        }
    };

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        const { width, height } = e.currentTarget;
        setCrop(centerAspectCrop(width, height, 16 / 9));
    }
    
    const handleCrop = () => {
        if (!completedCrop || !imgRef.current) {
            toast.error("Please select a crop area first.");
            return;
        }

        setIsCropping(true);
        const image = imgRef.current;
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = completedCrop.width * scaleX;
        canvas.height = completedCrop.height * scaleY;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(
            image,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completededCrop.height * scaleY,
            0,
            0,
            canvas.width,
            canvas.height,
        );

        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `cropped-image.png`;
        link.click();
        setIsCropping(false);
        toast.success("Image cropped and downloaded!");
    }


    return (
        <div className="min-h-screen bg-gradient-subtle">
            <section className="pt-24 pb-12 md:pt-32 md:pb-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent">Image Cropper</h1>
                    <p className="text-xl text-muted-foreground mt-4">Upload an image, crop it, and download the result.</p>
                </div>
            </section>
            <section className="container mx-auto px-4 pb-16">
                <Card className="max-w-4xl mx-auto shadow-strong">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><CropIcon /> Crop Your Image</CardTitle>
                        <CardDescription>Select an area of your image to crop and download.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {!imgSrc && (
                            <FileDropzone onDrop={onSelectFile} accept={{ 'image/*': [] }} multiple={false} />
                        )}
                        {imgSrc && (
                            <div className="space-y-4">
                                <ReactCrop
                                    crop={crop}
                                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                                    onComplete={(c) => setCompletedCrop(c)}
                                    aspect={16 / 9}
                                >
                                    <img
                                        ref={imgRef}
                                        alt="Crop me"
                                        src={imgSrc}
                                        onLoad={onImageLoad}
                                        className="max-h-[70vh] object-contain"
                                    />
                                </ReactCrop>
                                <div className="flex gap-2">
                                    <Button onClick={handleCrop} disabled={isCropping || !completedCrop} className="w-full">
                                        {isCropping ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2" />}
                                        Crop & Download
                                    </Button>
                                    <Button variant="outline" onClick={() => setImgSrc('')}>
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
