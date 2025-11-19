
'use client';

import { useState, useCallback } from 'react';
import FileDropzone from './FileDropzone';
import { Button } from '../ui/button';
import Image from 'next/image';
import { X, FileDown, Loader2, Package, Image as ImageIcon } from 'lucide-react';
import { Progress } from '../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import JSZip from 'jszip';

interface ImageFile extends File {
    preview: string;
}

type OutputFormat = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/bmp' | 'image/gif';

export default function ImageConverter() {
    const [files, setFiles] = useState<ImageFile[]>([]);
    const [convertedFiles, setConvertedFiles] = useState<{ name: string; url: string; }[]>([]);
    const [isConverting, setIsConverting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [outputFormat, setOutputFormat] = useState<OutputFormat>('image/png');

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
        if (imageFiles.length !== acceptedFiles.length) {
            toast.error("Some files were not valid images and were ignored.");
        }
        setFiles(prev => [...prev, ...imageFiles.map(file => Object.assign(file, { preview: URL.createObjectURL(file) }))]);
        setConvertedFiles([]);
    }, []);

    const removeFile = (fileName: string) => {
        setFiles(prev => prev.filter(file => file.name !== fileName));
    };

    const convertImages = async () => {
        if (files.length === 0) return toast.warning("Please upload at least one image.");

        setIsConverting(true);
        setProgress(0);
        const newConvertedFiles: { name: string; url: string; }[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = document.createElement('img');

            const loadPromise = new Promise((resolve, reject) => {
                img.onload = () => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx?.drawImage(img, 0, 0);
                    const dataUrl = canvas.toDataURL(outputFormat, 0.95);
                    const newName = `${file.name.split('.').slice(0, -1).join('.')}.${outputFormat.split('/')[1]}`;
                    newConvertedFiles.push({ name: newName, url: dataUrl });
                    resolve(true);
                };
                img.onerror = reject;
                img.src = file.preview;
            });
            
            await loadPromise;
            setProgress(((i + 1) / files.length) * 100);
        }

        setConvertedFiles(newConvertedFiles);
        setIsConverting(false);
        toast.success(`${files.length} image(s) converted successfully!`);
    };

    const downloadAllAsZip = async () => {
        if (convertedFiles.length === 0) return;
        toast.info("Preparing ZIP file...");
        const zip = new JSZip();
        for (const file of convertedFiles) {
            const response = await fetch(file.url);
            const blob = await response.blob();
            zip.file(file.name, blob);
        }
        zip.generateAsync({ type: 'blob' }).then(content => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = 'converted_images.zip';
            link.click();
            URL.revokeObjectURL(link.href);
            toast.success("ZIP file downloaded!");
        });
    };

    return (
        <div className="space-y-6">
            <FileDropzone 
                onDrop={onDrop}
                accept={{ 'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif', '.bmp', '.tiff'] }}
                multiple
                disabled={isConverting}
            />

            {files.length > 0 && (
                <>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                             <Label>Output Format</Label>
                             <Select value={outputFormat} onValueChange={(v: OutputFormat) => setOutputFormat(v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="image/png">PNG</SelectItem>
                                    <SelectItem value="image/jpeg">JPEG</SelectItem>
                                    <SelectItem value="image/webp">WEBP</SelectItem>
                                    <SelectItem value="image/bmp">BMP</SelectItem>
                                    <SelectItem value="image/gif">GIF</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold">Files to Convert ({files.length})</h3>
                        <div className="max-h-48 overflow-y-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-2 rounded-md border">
                            {files.map(file => (
                                <div key={file.name} className="relative group aspect-square">
                                    <Image src={file.preview} alt={file.name} fill className="object-cover rounded-md" onLoad={() => URL.revokeObjectURL(file.preview)} />
                                    <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => removeFile(file.name)}><X className="h-4 w-4" /></Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {isConverting && (
                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Converting... {Math.round(progress)}%</p>
                    <Progress value={progress} />
                </div>
            )}
            
            <Button onClick={convertImages} disabled={isConverting || files.length === 0} className="w-full" size="lg">
                {isConverting ? <Loader2 className="mr-2 animate-spin" /> : <ImageIcon className="mr-2" />}
                Convert {files.length > 0 ? `${files.length} Image(s)` : 'Images'}
            </Button>

            {convertedFiles.length > 0 && (
                <div className="space-y-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold">Converted Files ({convertedFiles.length})</h3>
                        <Button onClick={downloadAllAsZip} size="sm"><Package className="mr-2"/> Download All as ZIP</Button>
                    </div>
                     <div className="max-h-48 overflow-y-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-2 rounded-md border">
                        {convertedFiles.map(file => (
                            <div key={file.name} className="relative group aspect-square">
                                <Image src={file.url} alt={file.name} fill className="object-cover rounded-md" />
                                <a href={file.url} download={file.name}>
                                    <Button size="icon" className="absolute bottom-1 right-1 h-8 w-8"><FileDown className="h-4 w-4" /></Button>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
