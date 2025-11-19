
'use client';
import { useState, useCallback } from 'react';
import FileDropzone from './FileDropzone';
import { Button } from '../ui/button';
import Image from 'next/image';
import { PDFDocument } from 'pdf-lib';
import { X, FileDown, Loader2 } from 'lucide-react';
import { Progress } from '../ui/progress';
import { toast } from 'sonner';

interface ImageFile extends File {
    preview: string;
}

export default function ImagesToPdf() {
    const [files, setFiles] = useState<ImageFile[]>([]);
    const [isConverting, setIsConverting] = useState(false);
    const [progress, setProgress] = useState(0);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
        if (imageFiles.length !== acceptedFiles.length) {
            toast.error("Some files were not images and were ignored.");
        }

        const newFiles = imageFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        }));
        setFiles(prev => [...prev, ...newFiles]);
    }, []);

    const removeFile = (fileName: string) => {
        setFiles(prev => prev.filter(file => file.name !== fileName));
    };

    const convertToPdf = async () => {
        if (files.length === 0) {
            toast.warning("Please upload at least one image.");
            return;
        }

        setIsConverting(true);
        setProgress(0);

        try {
            const pdfDoc = await PDFDocument.create();

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const bytes = await file.arrayBuffer();
                
                let image;
                if (file.type === 'image/png') {
                    image = await pdfDoc.embedPng(bytes);
                } else { // Assumes jpeg/jpg otherwise
                    image = await pdfDoc.embedJpg(bytes);
                }

                const page = pdfDoc.addPage([image.width, image.height]);
                page.drawImage(image, {
                    x: 0,
                    y: 0,
                    width: image.width,
                    height: image.height,
                });
                setProgress(((i + 1) / files.length) * 100);
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'converted.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success("PDF generated successfully!");
            setFiles([]);
        } catch (error) {
            console.error("Failed to convert to PDF:", error);
            toast.error("An error occurred during conversion.");
        } finally {
            setIsConverting(false);
            setProgress(0);
        }
    };

    return (
        <div className="space-y-6">
            <FileDropzone 
                onDrop={onDrop}
                accept={{ 'image/jpeg': [], 'image/png': [] }}
                multiple
                disabled={isConverting}
            />

            {files.length > 0 && (
                <div className="space-y-4">
                    <h3 className="font-semibold">Image Preview ({files.length})</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {files.map(file => (
                            <div key={file.name} className="relative group aspect-square">
                                <Image
                                    src={file.preview}
                                    alt={file.name}
                                    fill
                                    className="object-cover rounded-md"
                                    onLoad={() => URL.revokeObjectURL(file.preview)}
                                />
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeFile(file.name)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {isConverting && (
                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Converting... {Math.round(progress)}%</p>
                    <Progress value={progress} />
                </div>
            )}

            <Button onClick={convertToPdf} disabled={isConverting || files.length === 0} className="w-full" size="lg">
                {isConverting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <FileDown className="mr-2 h-4 w-4" />
                )}
                Convert to PDF
            </Button>
        </div>
    );
}
