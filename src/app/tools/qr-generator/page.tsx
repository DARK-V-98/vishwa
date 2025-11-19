
'use client';
import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QrCode, Download, ArrowLeft, Zap, Shield, Globe, Users, Image as ImageIcon } from 'lucide-react';
import QRCode from 'qrcode';
import { toast } from 'sonner';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import type { Metadata } from 'next';

const pageTitle = "QR Code Generator – Free Browser-Based Tool | Vishwa Vidarshana";
const pageDescription = "Use QR Code Generator to create QR codes from text or URLs. Free, fast, and secure client-side tool. No login required.";

export const metadata: Metadata = {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: '/tools/qr-generator',
    }
};

const featureList = [
    { icon: Zap, title: "Instant Generation", description: "Create your QR code in a single click." },
    { icon: Shield, title: "Completely Private", description: "All data is processed in your browser, not on our servers." },
    { icon: ImageIcon, title: "High-Quality PNG", description: "Download a crisp, scalable PNG file perfect for print or web." },
    { icon: Users, title: "Free for Everyone", description: "No fees, no sign-ups, and no limits on usage." },
];

const howItWorksSteps = [
    "Type or paste any text, URL, or information into the input field.",
    "Click the 'Generate' button.",
    "Your QR code will instantly appear on the screen.",
    "Click the 'Download as PNG' button to save the high-quality image to your device."
];

const faqItems = [
    { q: "Is the QR Code Generator free?", a: "Yes, our tool is 100% free to use for both personal and commercial projects. There are no restrictions." },
    { q: "Is my data safe?", a: "Absolutely. The QR code is generated entirely within your browser using a JavaScript library. The information you enter is never sent to any server, ensuring your data remains private." },
    { q: "What can I put in a QR code?", a: "You can encode almost any text-based information, including website URLs, contact details (vCard), Wi-Fi network credentials, event information, plain text, and more." },
    { q: "What format is the downloaded QR code in?", a: "The QR code is downloaded as a high-quality PNG image, which is ideal for both digital use and printing." },
    { q: "Do the generated QR codes expire?", a: "No, the QR codes you create are static and will work forever. They do not expire and will continue to function as long as the encoded data (like a website URL) is valid." },
];


export default function QrGeneratorPage() {
    const [text, setText] = useState('');
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const qrRef = useRef<HTMLCanvasElement>(null);

    const generateQR = async () => {
        if (!text) {
            toast.error("Please enter text or a URL to generate a QR code.");
            return;
        }
        try {
            const url = await QRCode.toDataURL(text, { errorCorrectionLevel: 'H', width: 300 });
            setQrCodeUrl(url);
        } catch (err) {
            toast.error("Failed to generate QR code.");
            console.error(err);
        }
    };
    
    const downloadQR = () => {
        if (!qrCodeUrl) return;
        const link = document.createElement('a');
        link.href = qrCodeUrl;
        link.download = 'qrcode.png';
        link.click();
    };
    
    const softwareAppSchema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "QR Code Generator",
        "url": "https://vishwavidarshana.com/tools/qr-generator",
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
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent">QR Code Generator</h1>
                    <p className="text-xl text-muted-foreground mt-4 max-w-3xl mx-auto">Create and download high-quality QR codes for URLs, text, and more. This free online tool is fast, secure, and works entirely in your browser.</p>
                </div>
            </section>
            <section className="container mx-auto px-4 pb-16">
                <Card className="max-w-md mx-auto shadow-strong">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><QrCode /> Generate QR Code</CardTitle>
                        <CardDescription>Enter text or a URL to create your QR code.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="text-input">Text or URL</Label>
                            <Input id="text-input" value={text} onChange={(e) => setText(e.target.value)} placeholder="https://example.com" />
                        </div>
                        
                        <Button onClick={generateQR} className="w-full">Generate</Button>
                        
                        {qrCodeUrl && (
                            <div className="text-center space-y-4 pt-4 border-t">
                                <h3 className="font-semibold">Your QR Code:</h3>
                                <div className="p-4 bg-white inline-block rounded-lg shadow-inner">
                                   <img src={qrCodeUrl} alt="Generated QR Code" width={250} height={250} />
                                </div>
                                <Button onClick={downloadQR} variant="outline" className="w-full">
                                    <Download className="mr-2" /> Download as PNG
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </section>

             <div className="container mx-auto px-4 py-16 space-y-16 max-w-4xl">
                 <section>
                    <h2 className="text-3xl font-bold text-center mb-10">Generator Features</h2>
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
                    <h2 className="text-3xl font-bold text-center mb-10">Why Use Our QR Generator?</h2>
                     <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <p className="text-muted-foreground">Our QR Code Generator is built on the principle of privacy and simplicity. By leveraging the client-side `qrcode` library, we ensure that the data you enter never leaves your device. This makes it the perfect tool for creating QR codes for sensitive information like private links or personal details without the security risks of server-based generators. It's fast, efficient, and respects your data.</p>
                        </CardContent>
                    </Card>
                </section>

                <section>
                    <h2 className="text-3xl font-bold text-center mb-10">Common Use Cases</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                         {["Marketing Campaigns", "Business Cards", "Event Tickets", "Wi-Fi Access", "Restaurant Menus", "Product Packaging"].map(role => (
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
