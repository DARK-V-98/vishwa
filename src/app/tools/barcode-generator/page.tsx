
'use client';
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Barcode, Download, ArrowLeft, Zap, Shield, FileCheck2, Users, File } from 'lucide-react';
import JsBarcode from 'jsbarcode';
import { toast } from 'sonner';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

const featureList = [
    { icon: File, title: "Multiple Formats", description: "Supports CODE128, EAN-13, and UPC formats." },
    { icon: Zap, title: "Instant Generation", description: "See your barcode appear as soon as you click." },
    { icon: Shield, title: "Client-Side Processing", description: "Your data is never sent to a server, ensuring privacy." },
    { icon: FileCheck2, title: "High-Quality PNG", description: "Download a crisp barcode image suitable for printing." },
];

const howItWorksSteps = [
    "Enter the data you want to encode into the input field.",
    "Select the desired barcode format (e.g., CODE128).",
    "Click the 'Generate' button.",
    "Your barcode will be rendered on the screen.",
    "Click 'Download' to save the barcode as a PNG image."
];

const faqItems = [
    { q: "Is the Barcode Generator free?", a: "Yes, this tool is completely free to use for any purpose, including commercial product labeling." },
    { q: "What data should I enter?", a: "This depends on the format. For CODE128, you can enter alphanumeric text. For EAN-13, you need 12 digits (the 13th checksum digit is calculated automatically). For UPC, you need 11 digits." },
    { q: "Why do I see an 'Invalid' error?", a: "This usually means the data you entered doesn't match the requirements of the selected format. For example, entering letters into a UPC field will cause an error." },
    { q: "Is my product information safe?", a: "Yes. The barcode is generated entirely in your browser using the JsBarcode library. Your product data is never transmitted over the internet." },
    { q: "Can I use these barcodes on my products for sale?", a: "While you can generate valid barcodes, if you are selling in retail stores, you typically need to purchase an official GS1 company prefix to ensure your barcodes are unique worldwide. This tool is great for internal inventory, personal projects, or events." },
];

export default function BarcodeGeneratorPage() {
    const [text, setText] = useState('');
    const [format, setFormat] = useState('CODE128');
    const [isValid, setIsValid] = useState(true);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (text && canvasRef.current) {
            generateBarcode();
        }
    }, [text, format]);

    const generateBarcode = () => {
        if (!text) {
            setIsValid(true); // Clear error state if input is empty
            if (canvasRef.current) {
                const context = canvasRef.current.getContext('2d');
                context?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            }
            return;
        }
        if (canvasRef.current) {
            try {
                JsBarcode(canvasRef.current, text, {
                    format: format,
                    lineColor: "#000",
                    width: 2,
                    height: 100,
                    displayValue: true,
                    valid: (valid) => setIsValid(valid)
                });
            } catch (e: any) {
                setIsValid(false);
            }
        }
    };

    const downloadBarcode = () => {
        if (!isValid || !text) {
            toast.error("Cannot download an invalid or empty barcode.");
            return;
        }
        if (canvasRef.current) {
            const dataUrl = canvasRef.current.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `barcode-${text}.png`;
            link.click();
        }
    };
    
    const softwareAppSchema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Barcode Generator",
        "url": "https://vishwavidarshana.com/tools/barcode-generator",
        "applicationCategory": "Utility",
        "operatingSystem": "Web"
    };

    return (
        <div className="min-h-screen bg-gradient-subtle">
             <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
            />
            <section className="pt-24 pb-12 md:pt-32 md:pb-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-md mx-auto mb-8 text-left">
                        <Button variant="outline" asChild>
                            <Link href="/tools">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Tools
                            </Link>
                        </Button>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent">Barcode Generator</h1>
                    <p className="text-xl text-muted-foreground mt-4 max-w-3xl mx-auto">Create and download standard barcodes for products, inventory, or business use. Secure, fast, and entirely browser-based.</p>
                </div>
            </section>
            <section className="container mx-auto px-4 pb-16">
                <Card className="max-w-md mx-auto shadow-strong">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Barcode /> Generate Barcode</CardTitle>
                        <CardDescription>Enter data and select a format to generate your barcode.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="text-input">Data</Label>
                                <Input id="text-input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter barcode data" />
                            </div>
                            <div className="space-y-2">
                                <Label>Format</Label>
                                <Select value={format} onValueChange={setFormat}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CODE128">CODE128 (Alphanumeric)</SelectItem>
                                        <SelectItem value="EAN13">EAN-13 (12 digits)</SelectItem>
                                        <SelectItem value="UPC">UPC (11 digits)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="text-center p-4 border rounded-md min-h-[150px] flex items-center justify-center bg-white">
                           <canvas ref={canvasRef}></canvas>
                           {!isValid && text && <p className="text-destructive font-bold">Invalid data for selected format</p>}
                        </div>
                        <Button onClick={downloadBarcode} variant="outline" className="w-full" disabled={!isValid || !text}>
                            <Download className="mr-2" /> Download Barcode
                        </Button>
                    </CardContent>
                </Card>
            </section>
            
             <div className="container mx-auto px-4 py-16 space-y-16 max-w-4xl">
                 <section>
                    <h2 className="text-3xl font-bold text-center mb-10">Barcode Generator Features</h2>
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
                    <h2 className="text-3xl font-bold text-center mb-10">How to Use</h2>
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
                    <h2 className="text-3xl font-bold text-center mb-10">Who Can Use This Tool?</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                         {["Small Business Owners", "E-commerce Sellers", "Warehouse Managers", "Librarians", "Event Organizers", "Hobbyists"].map(role => (
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
