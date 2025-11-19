
'use client';
import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Barcode, Download, ArrowLeft } from 'lucide-react';
import JsBarcode from 'jsbarcode';
import { toast } from 'sonner';
import Link from 'next/link';

export default function BarcodeGeneratorPage() {
    const [text, setText] = useState('');
    const [format, setFormat] = useState('CODE128');
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const generateBarcode = () => {
        if (!text) {
            toast.error("Please enter data for the barcode.");
            return;
        }
        if (canvasRef.current) {
            try {
                JsBarcode(canvasRef.current, text, {
                    format: format,
                    lineColor: "#000",
                    width: 2,
                    height: 100,
                    displayValue: true
                });
            } catch (e: any) {
                toast.error(e.message);
            }
        }
    };

    const downloadBarcode = () => {
        if (canvasRef.current) {
            const dataUrl = canvasRef.current.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `barcode-${text}.png`;
            link.click();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-subtle">
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
                    <p className="text-xl text-muted-foreground mt-4">Create barcodes for products, inventory, or business use.</p>
                </div>
            </section>
            <section className="container mx-auto px-4 pb-16">
                <Card className="max-w-md mx-auto shadow-strong">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Barcode /> Generate Barcode</CardTitle>
                        <CardDescription>Enter data and select a format.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 space-y-2">
                                <Label htmlFor="text-input">Data</Label>
                                <Input id="text-input" value={text} onChange={(e) => setText(e.target.value)} placeholder="123456789" />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <Label>Format</Label>
                                <Select value={format} onValueChange={setFormat}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CODE128">CODE128</SelectItem>
                                        <SelectItem value="EAN13">EAN-13</SelectItem>
                                        <SelectItem value="UPC">UPC</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Button onClick={generateBarcode} className="w-full">Generate</Button>
                        <div className="text-center p-4 border rounded-md min-h-[120px]">
                           <canvas ref={canvasRef}></canvas>
                        </div>
                        <Button onClick={downloadBarcode} variant="outline" className="w-full">
                            <Download className="mr-2" /> Download
                        </Button>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
