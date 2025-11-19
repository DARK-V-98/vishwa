
'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FileDropzone from '@/components/tools/FileDropzone';
import { FileLock, Download, Loader2, KeyRound, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import CryptoJS from 'crypto-js';
import Link from 'next/link';

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
                    <p className="text-xl text-muted-foreground mt-4">Secure your files with AES-256 encryption, right in your browser.</p>
                </div>
            </section>
            <section className="container mx-auto px-4 pb-16">
                <Card className="max-w-2xl mx-auto shadow-strong">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><FileLock /> Secure Your File</CardTitle>
                        <CardDescription>Encrypt or decrypt files locally on your device.</CardDescription>
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
                            <Label htmlFor="password"><KeyRound className="inline mr-2"/>Password</Label>
                            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter a strong password" />
                        </div>

                        <Button onClick={processFile} disabled={isProcessing || !file || !password} className="w-full">
                            {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2" />}
                            {mode === 'encrypt' ? 'Encrypt & Download' : 'Decrypt & Download'}
                        </Button>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
