
'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FileDropzone from '@/components/tools/FileDropzone';
import { FileLock, Download, Loader2, KeyRound, ArrowLeft, Zap, Shield, Globe, Users, Cpu, FileCheck2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import CryptoJS from 'crypto-js';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

const featureList = [
    { icon: Shield, title: "AES-256 Encryption", description: "Uses a military-grade encryption standard for maximum security." },
    { icon: Cpu, title: "100% Browser-Based", description: "Your files and password never leave your computer." },
    { icon: Zap, title: "Extremely Fast", description: "Encrypts and decrypts files of any size in seconds." },
    { icon: FileCheck2, title: "Supports All File Types", description: "Secure any file, from documents and images to videos." },
];

const howItWorksSteps = [
    "Choose 'Encrypt' or 'Decrypt' mode.",
    "Drag and drop your file into the box or click to upload.",
    "Enter a strong, secret password in the input field.",
    "Click the 'Encrypt & Download' or 'Decrypt & Download' button.",
    "Your processed file is instantly saved to your device."
];

const faqItems = [
    { q: "Is this file encryption tool secure?", a: "Yes. This tool uses AES-256, one of the strongest encryption ciphers available. Since the entire process runs locally in your browser, your password and file data are never sent to any server, making it as secure as an offline application." },
    { q: "What happens if I forget my password?", a: "Due to the high level of security, there is absolutely no way to recover a file if you forget the password. Please store your password safely." },
    { q: "Is there a file size limit?", a: "Theoretically, no. However, very large files (several gigabytes) may cause your browser to become slow or unresponsive, as the process is limited by your computer's available memory." },
    { q: "Does this tool store my files or password?", a: "No. Nothing is ever stored or transmitted. Once you close the browser tab, all data related to the session is gone forever." },
    { q: "Which file types can I encrypt?", a: "You can encrypt any file type. The tool treats all files as binary data, so you can secure documents, images, videos, zip archives, and more." },
];

export default function FileEncryptionPage() {
    const [file, setFile] = useState<File | null>(null);
    const [password, setPassword] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');

    const handleDrop = (files: File[]) => {
        setFile(files[0]);
    };

    const processFile = async () => {
        if (!file || !password) {
            toast.error("Please select a file and enter a password.");
            return;
        }
        setIsProcessing(true);

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const fileContent = e.target?.result as string;
                let processedData;
                let fileName;
                let mimeType;

                if (mode === 'encrypt') {
                    processedData = CryptoJS.AES.encrypt(fileContent, password).toString();
                    fileName = `encrypted-${file.name}`;
                    mimeType = 'text/plain';
                } else {
                    const bytes = CryptoJS.AES.decrypt(fileContent, password);
                    processedData = bytes.toString(CryptoJS.enc.Latin1);
                     if (!processedData) {
                        throw new Error("Decryption failed. Check your password or file.");
                    }
                    fileName = file.name.replace('encrypted-', '');
                    // We need to convert from base64 back to blob
                    const byteCharacters = atob(processedData.split(',')[1]);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    const blob = new Blob([byteArray]);
                    const url = URL.createObjectURL(blob);

                    const link = document.createElement('a');
                    link.href = url;
                    link.download = fileName;
                    link.click();
                    URL.revokeObjectURL(url);
                    toast.success("File decrypted successfully!");
                    setIsProcessing(false);
                    return;
                }
                
                const blob = new Blob([processedData], { type: mimeType });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                link.click();
                URL.revokeObjectURL(link.href);
                toast.success(`File ${mode}ed successfully!`);

            } catch (error: any) {
                toast.error(error.message || "An error occurred during processing.");
            } finally {
                setIsProcessing(false);
            }
        };
        reader.readAsDataURL(file);
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
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent">File Encryption & Decryption</h1>
                    <p className="text-xl text-muted-foreground mt-4 max-w-3xl mx-auto">Secure your files with military-grade AES-256 encryption. This free online tool works entirely in your browser, ensuring your files and password never leave your device.</p>
                </div>
            </section>
            <section className="container mx-auto px-4 pb-16">
                <Card className="max-w-2xl mx-auto shadow-strong">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><FileLock /> Secure Your File</CardTitle>
                        <CardDescription>Encrypt or decrypt files locally on your device. Your data remains 100% private.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
                            <Button variant={mode === 'encrypt' ? 'hero' : 'ghost'} onClick={() => setMode('encrypt')}>Encrypt</Button>
                            <Button variant={mode === 'decrypt' ? 'hero' : 'ghost'} onClick={() => setMode('decrypt')}>Decrypt</Button>
                        </div>
                        
                        {!file ? (
                            <FileDropzone onDrop={handleDrop} accept={{}} multiple={false} />
                        ) : (
                             <div className="p-4 border rounded-lg flex items-center justify-between">
                                <p className="font-semibold truncate">{file.name}</p>
                                <Button variant="ghost" size="icon" onClick={() => setFile(null)}>X</Button>
                            </div>
                        )}
                        
                        <div className="space-y-2">
                            <Label htmlFor="password"><KeyRound className="inline mr-2"/>Secret Password</Label>
                            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter a strong password" />
                        </div>

                        <Button onClick={processFile} disabled={isProcessing || !file || !password} className="w-full">
                            {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2" />}
                            {mode === 'encrypt' ? 'Encrypt & Download' : 'Decrypt & Download'}
                        </Button>
                    </CardContent>
                </Card>
            </section>

             <div className="container mx-auto px-4 py-16 space-y-16 max-w-4xl">
                 <section>
                    <h2 className="text-3xl font-bold text-center mb-10">Unmatched Security Features</h2>
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
                    <h2 className="text-3xl font-bold text-center mb-10">How File Encryption Works</h2>
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
                    <h2 className="text-3xl font-bold text-center mb-10">Why is Browser-Based Encryption Better?</h2>
                     <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <p className="text-muted-foreground">Traditional online encryption tools require you to upload your sensitive file and your password to a third-party server. This exposes your data to potential interception, logging, or mishandling. Our tool eliminates that risk entirely. By using the powerful `crypto-js` library, all encryption and decryption operations run directly inside your browser. Your data never leaves your computer, offering the same level of security as an offline desktop application but with the convenience of a web tool.</p>
                        </CardContent>
                    </Card>
                </section>

                <section>
                    <h2 className="text-3xl font-bold text-center mb-10">Who Can Benefit?</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                         {["Journalists", "Legal Professionals", "Corporate Employees", "Students", "Developers", "Anyone with private data"].map(role => (
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
