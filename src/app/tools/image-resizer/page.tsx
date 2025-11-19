
'use client';
import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FileDropzone from '@/components/tools/FileDropzone';
import { Maximize, Download, Loader2, ArrowLeft, Zap, Shield, Globe, Users, Cpu, FileCheck2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

const featureList = [
    { icon: Zap, title: "Instant Resizing", description: "Get your resized image in seconds." },
    { icon: Shield, title: "100% Secure", description: "Your images are processed in your browser, not on our servers." },
    { icon: Globe, title: "Works Offline", description: "Once the page is loaded, no internet is needed." },
    { icon: FileCheck2, title: "High-Quality Output", description: "Maintains image quality during resizing." },
];

const howItWorksSteps = [
    "Drag and drop or upload your JPG, PNG, or WEBP image.",
    "The image preview and its original dimensions will appear.",
    "Enter your desired new width or height in pixels.",
    "The other dimension will adjust automatically to maintain the aspect ratio.",
    "Click 'Resize & Download' to instantly save your new image."
];

const faqItems = [
    { q: "Is the Image Resizer tool free to use?", a: "Yes, this tool is completely free. There are no limits on how many images you can resize." },
    { q: "Are my images uploaded to a server?", a: "No. Your privacy is our priority. All processing happens locally in your browser, so your images never leave your computer." },
    { q: "What image formats are supported?", a: "You can resize JPG, PNG, WEBP, and GIF images. The output will be in the same format as the input." },
    { q: "Will resizing the image reduce its quality?", a: "Our tool uses modern browser APIs to resize images with minimal quality loss. For significant reductions in size, some quality change is inevitable, but we strive to maintain the best possible result." },
    { q: "Can I use this tool on my phone?", a: "Absolutely! Our Image Resizer is fully responsive and works seamlessly on desktops, tablets, and mobile devices." },
];

export default function ImageResizerPage() {
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [isResizing, setIsResizing] = useState(false);
    const originalDimensions = useRef({ width: 0, height: 0, aspectRatio: 1 });

    const handleDrop = (files: File[]) => {
        const file = files[0];
        if (file && file.type.startsWith('image/')) {
            setImage(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    originalDimensions.current = { width: img.width, height: img.height, aspectRatio: img.width / img.height };
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
    
    const handleWidthChange = (newWidth: number) => {
        setWidth(newWidth);
        setHeight(Math.round(newWidth / originalDimensions.current.aspectRatio));
    };

    const handleHeightChange = (newHeight: number) => {
        setHeight(newHeight);
        setWidth(Math.round(newHeight * originalDimensions.current.aspectRatio));
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
                    <div className="max-w-2xl mx-auto mb-8 text-left">
                        <Button variant="outline" asChild>
                            <Link href="/tools">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Tools
                            </Link>
                        </Button>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent">Image Resizer</h1>
                    <p className="text-xl text-muted-foreground mt-4 max-w-3xl mx-auto">A free, secure, and fast online tool to resize images to custom dimensions without uploading them. Your privacy is guaranteed.</p>
                </div>
            </section>
            <section className="container mx-auto px-4 pb-16">
                <Card className="max-w-2xl mx-auto shadow-strong">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Maximize /> Resize Your Image</CardTitle>
                        <CardDescription>Upload an image and specify new dimensions while maintaining the aspect ratio.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {!imagePreview && (
                            <FileDropzone onDrop={handleDrop} accept={{ 'image/*': ['.jpeg', '.png', '.gif', '.webp'] }} multiple={false} />
                        )}
                        {imagePreview && (
                            <div className="space-y-4">
                                <div className="max-h-96 overflow-hidden rounded-md border flex justify-center bg-muted/30">
                                    <img src={imagePreview} alt="Preview" className="object-contain max-h-96" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="width">Width (px)</Label>
                                        <Input id="width" type="number" value={width} onChange={e => handleWidthChange(Number(e.target.value))} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="height">Height (px)</Label>
                                        <Input id="height" type="number" value={height} onChange={e => handleHeightChange(Number(e.target.value))} />
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
            
            <div className="container mx-auto px-4 py-16 space-y-16 max-w-4xl">
                 <section>
                    <h2 className="text-3xl font-bold text-center mb-10">Features of the Image Resizer</h2>
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
                    <h2 className="text-3xl font-bold text-center mb-10">How to Resize Your Image</h2>
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
                    <h2 className="text-3xl font-bold text-center mb-10">Advantages of Our Online Resizer</h2>
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <p className="text-muted-foreground">This tool is engineered for speed and security. By processing images directly in your browser, we eliminate upload times and privacy risks associated with server-based tools. It's perfect for quickly adjusting images for web content, social media posts, or email attachments without installing heavy software. Maintain control over your data while getting high-quality results instantly.</p>
                        </CardContent>
                    </Card>
                </section>
                
                <section>
                    <h2 className="text-3xl font-bold text-center mb-10">Perfect For...</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                         {["Bloggers", "Social Media Managers", "Students", "Web Developers", "Marketers", "Photographers"].map(role => (
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

                <section className="text-center">
                     <Card className="bg-gradient-hero border-0 shadow-strong">
                        <CardContent className="p-8 text-primary-foreground">
                            <h3 className="text-2xl font-bold mb-4">Need More Tools?</h3>
                            <p className="mb-6">Our Image Resizer is just one of many free utilities we offer. Explore our full suite of secure, browser-based tools designed by ESystemLK.</p>
                            <Button asChild variant="secondary">
                                <Link href="/tools">Explore All Tools</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
    );
}
