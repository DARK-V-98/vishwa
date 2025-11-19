
'use client';
import { useState, useRef } from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import ReactCrop, { centerCrop, makeAspectCrop, type Crop } from 'react-image-crop';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FileDropzone from '@/components/tools/FileDropzone';
import { Crop as CropIcon, Download, Loader2, ArrowLeft, Zap, Shield, Globe, FileCheck2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

const featureList = [
    { icon: Zap, title: "Interactive Cropping", description: "Visually select the area you want to keep." },
    { icon: Shield, title: "Client-Side Security", description: "Your image is processed in-browser and is never uploaded." },
    { icon: Globe, title: "Works Offline", description: "After loading the page, you can crop images without internet." },
    { icon: FileCheck2, title: "High-Quality Output", description: "Downloads the cropped area in its original quality." },
];

const howItWorksSteps = [
    "Upload or drag and drop your image (JPG, PNG, WEBP).",
    "An interactive crop box will appear over your image.",
    "Click and drag the box to move it, or use the handles to resize it.",
    "You can lock the aspect ratio for common sizes like 16:9 or 1:1.",
    "Once you're happy with the selection, click 'Crop & Download'."
];

const faqItems = [
    { q: "Is this Image Cropper free?", a: "Yes, our Image Cropper is 100% free to use. There are no watermarks, sign-ups, or usage limits." },
    { q: "Is it safe to use with my personal photos?", a: "Completely safe. The tool operates entirely within your web browser. Your photos are not uploaded to any server, ensuring your privacy is fully protected." },
    { q: "What image formats can I crop?", a: "The tool supports popular web formats, including JPG/JPEG, PNG, and WEBP. The cropped image will be downloaded as a PNG to preserve transparency." },
    { q: "Can I set a specific aspect ratio?", a: "Yes, you can choose from common aspect ratios like 16:9 (widescreen), 4:3 (standard), or 1:1 (square), or crop freely by holding the Shift key while dragging." },
    { q: "Does this tool work on mobile devices?", a: "Yes, the Image Cropper is designed to be fully functional on touch devices, allowing you to crop images on your phone or tablet with ease." },
];


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
    const [aspect, setAspect] = useState<number | undefined>(16 / 9);

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
        setCrop(centerAspectCrop(width, height, aspect || 16 / 9));
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
            completedCrop.height * scaleY,
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
                    <div className="max-w-4xl mx-auto mb-8 text-left">
                        <Button variant="outline" asChild>
                            <Link href="/tools">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Tools
                            </Link>
                        </Button>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent">Image Cropper</h1>
                    <p className="text-xl text-muted-foreground mt-4 max-w-3xl mx-auto">A free, client-side tool to crop images with precision. Upload your image, select the area you want, and download the result instantly.</p>
                </div>
            </section>
            <section className="container mx-auto px-4 pb-16">
                <Card className="max-w-4xl mx-auto shadow-strong">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><CropIcon /> Crop Your Image</CardTitle>
                        <CardDescription>Select an area of your image to crop and download. The default aspect ratio is 16:9.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {!imgSrc && (
                            <FileDropzone onDrop={onSelectFile} accept={{ 'image/*': ['.jpeg', '.png', '.webp'] }} multiple={false} />
                        )}
                        {imgSrc && (
                            <div className="space-y-4">
                                <div className="p-4 border rounded-md bg-muted/30">
                                    <ReactCrop
                                        crop={crop}
                                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                                        onComplete={(c) => setCompletedCrop(c)}
                                        aspect={aspect}
                                    >
                                        <img
                                            ref={imgRef}
                                            alt="Crop me"
                                            src={imgSrc}
                                            onLoad={onImageLoad}
                                            className="max-h-[70vh] object-contain w-full"
                                        />
                                    </ReactCrop>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2">
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

             <div className="container mx-auto px-4 py-16 space-y-16 max-w-4xl">
                 <section>
                    <h2 className="text-3xl font-bold text-center mb-10">Image Cropper Features</h2>
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
                    <h2 className="text-3xl font-bold text-center mb-10">Why Use Our Secure Cropper?</h2>
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <p className="text-muted-foreground">Standard online image tools require you to upload your files, creating a privacy risk. Our Image Cropper tool eliminates this by performing all operations directly on your computer. Your files are never sent over the internet. This provides unmatched security for your personal photos and sensitive professional images, combined with the speed of local processing. It's the perfect tool for creating social media banners, website thumbnails, or just framing your photos perfectly without compromising your data.</p>
                        </CardContent>
                    </Card>
                </section>
                
                <section>
                    <h2 className="text-3xl font-bold text-center mb-10">Useful For Everyone</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                         {["Content Creators", "Photographers", "Marketers", "Students", "Designers", "Anyone with a photo!"].map(role => (
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
