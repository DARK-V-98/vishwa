'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Copy, Download, FileJson, Shield, Trash2, Zap } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const featureList = [
    { icon: Zap, title: "Bidirectional Conversion", description: "Seamlessly convert from JSON to CSV and from CSV back to JSON." },
    { icon: Shield, title: "Client-Side Privacy", description: "Your data is processed locally in your browser and is never uploaded." },
    { icon: FileJson, title: "Handles Nested JSON", description: "Automatically flattens nested JSON objects into distinct CSV columns." },
    { icon: Download, title: "Instant Downloads", description: "Download your converted data as a .csv or .json file with one click." },
];

const howItWorksSteps = [
    "Select the conversion mode: 'JSON to CSV' or 'CSV to JSON'.",
    "Paste your source data into the left-hand input box.",
    "Click the 'Convert' button to process the data.",
    "The converted output will appear in the right-hand box.",
    "Use the 'Copy' or 'Download' buttons to get your result."
];

const faqItems = [
    { q: "Is the JSON to CSV converter free?", a: "Yes, this tool is completely free to use without any limitations." },
    { q: "Is my data secure?", a: "Absolutely. The entire conversion process happens in your browser. Your data is never sent to a server, ensuring complete privacy." },
    { q: "How does it handle complex JSON?", a: "When converting from JSON to CSV, the tool automatically flattens nested objects and arrays, creating appropriate headers (e.g., 'user.address.city')." },
    { q: "What if my CSV has different columns?", a: "The CSV to JSON converter assumes the first row is the header row. All subsequent rows are converted into JSON objects based on those headers." },
];

const jsonToCsv = (jsonString: string): string => {
    let data;
    try {
        data = JSON.parse(jsonString);
    } catch (e) {
        throw new Error("Invalid JSON format.");
    }

    if (!Array.isArray(data)) data = [data];
    if (data.length === 0) return "";

    const headers = Array.from(new Set(data.flatMap(obj => Object.keys(obj))));
    const csvRows = [headers.join(',')];

    for (const row of data) {
        const values = headers.map(header => {
            let value = row[header];
            if (value === null || value === undefined) {
                return '';
            }
            if (typeof value === 'object') {
                value = JSON.stringify(value);
            }
            const stringValue = String(value);
            if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
        });
        csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
};

const csvToJson = (csvString: string): string => {
    const rows = csvString.trim().split(/\r?\n/).map(row => row.split(','));
    if (rows.length < 2) {
        throw new Error("CSV must have at least a header row and one data row.");
    }
    const headers = rows.shift() as string[];
    const jsonArray = rows.map(row => {
        const obj: Record<string, string> = {};
        headers.forEach((header, i) => {
            obj[header] = row[i];
        });
        return obj;
    });

    return JSON.stringify(jsonArray, null, 2);
};


export default function JsonCsvConverterPage() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState<'json-to-csv' | 'csv-to-json'>('json-to-csv');

    const handleConvert = () => {
        if (!input.trim()) {
            toast.warning("Please enter some data to convert.");
            return;
        }

        try {
            if (mode === 'json-to-csv') {
                setOutput(jsonToCsv(input));
            } else {
                setOutput(csvToJson(input));
            }
            toast.success("Conversion successful!");
        } catch (error: any) {
            toast.error(error.message);
            setOutput('');
        }
    };
    
    const copyToClipboard = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        toast.success("Output copied to clipboard!");
    };
    
    const downloadFile = () => {
        if (!output) return;
        const extension = mode === 'json-to-csv' ? 'csv' : 'json';
        const mimeType = mode === 'json-to-csv' ? 'text/csv' : 'application/json';
        const blob = new Blob([output], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `converted.${extension}`;
        a.click();
        URL.revokeObjectURL(url);
    };
    
    const clearFields = () => {
        setInput('');
        setOutput('');
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
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent">JSON ↔ CSV Converter</h1>
                    <p className="text-xl text-muted-foreground mt-4 max-w-3xl mx-auto">A fast, secure, and client-side tool to convert JSON data to CSV and vice versa. Perfect for developers and data analysts.</p>
                </div>
            </section>
            <section className="container mx-auto px-4 pb-16">
                <Card className="max-w-6xl mx-auto shadow-strong">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><FileJson /> Data Converter</CardTitle>
                        <CardDescription>Paste your data, choose the conversion direction, and process instantly.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="json-to-csv">JSON to CSV</TabsTrigger>
                            <TabsTrigger value="csv-to-json">CSV to JSON</TabsTrigger>
                          </TabsList>
                        </Tabs>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                           <div className="space-y-2">
                                <Label htmlFor="input-data">Input ({mode === 'json-to-csv' ? 'JSON' : 'CSV'})</Label>
                                <Textarea id="input-data" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste your data here..." rows={12} className="font-mono"/>
                           </div>
                           <div className="space-y-2">
                                <Label htmlFor="output-data">Output ({mode === 'json-to-csv' ? 'CSV' : 'JSON'})</Label>
                                <Textarea id="output-data" value={output} readOnly placeholder="Converted data will appear here..." rows={12} className="font-mono bg-muted/50" />
                           </div>
                        </div>

                         <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                             <Button onClick={handleConvert} className="w-full">
                                <Zap className="mr-2" /> Convert
                            </Button>
                            <Button onClick={copyToClipboard} variant="secondary" className="w-full" disabled={!output}>
                                <Copy className="mr-2" /> Copy
                            </Button>
                            <Button onClick={downloadFile} variant="secondary" className="w-full" disabled={!output}>
                                <Download className="mr-2" /> Download
                            </Button>
                            <Button onClick={clearFields} variant="destructive" className="w-full" disabled={!input && !output}>
                                <Trash2 className="mr-2" /> Clear
                            </Button>
                         </div>
                    </CardContent>
                </Card>
            </section>
            
             <div className="container mx-auto px-4 py-16 space-y-16 max-w-4xl">
                 <section>
                    <h2 className="text-3xl font-bold text-center mb-10">Converter Features</h2>
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