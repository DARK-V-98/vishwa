
'use client';
import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QrCode, Download } from 'lucide-react';
import QRCode from 'qrcode';
import { toast } from 'sonner';

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

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <section className="pt-24 pb-12 md:pt-32 md:pb-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent">QR Code Generator</h1>
                    <p className="text-xl text-muted-foreground mt-4">Generate QR codes instantly from any text or URL.</p>
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
        </div>
    );
}
