
'use client';
import { useState, useCallback, useEffect } from 'react';
import FileDropzone from './FileDropzone';
import { Button } from '../ui/button';
import { X, FileDown, Loader2, Download, Package, Image as ImageIcon } from 'lucide-react';
import { Progress } from '../ui/progress';
import { toast } from 'sonner';
import JSZip from 'jszip';
import * as pdfjsLib from 'pdfjs-dist';

// Configure the worker script path
if (typeof window !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

interface RenderedPage {
    pageNumber: number;
    dataUrl: string;
}

export default function PdfToImages() {
    const [file, setFile] = useState<File | null>(null);
    const [renderedPages, setRenderedPages] = useState<RenderedPage[]>([]);
    const [isConverting, setIsConverting] = useState(false);
    const [progress, setProgress] = useState(0);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const pdfFile = acceptedFiles[0];
            if (pdfFile.type !== 'application/pdf') {
                toast.error("Please upload a valid PDF file.");
                return;
            }
            setFile(pdfFile);
            setRenderedPages([]);
        }
    }, []);

    const convertPdfToImages = async () => {
        if (!file) {
            toast.warning("Please upload a PDF file.");
            return;
        }

        setIsConverting(true);
        setProgress(0);
        setRenderedPages([]);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
            const numPages = pdf.numPages;
            const pages: RenderedPage[] = [];

            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 1.5 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                if (context) {
                    await page.render({ canvasContext: context, viewport }).promise;
                    pages.push({
                        pageNumber: i,
                        dataUrl: canvas.toDataURL('image/png')
                    });
                }
                setProgress(((i) / numPages) * 100);
            }
            setRenderedPages(pages);
            toast.success(`${numPages} pages converted successfully!`);
        } catch (error) {
            console.error("Failed to convert PDF:", error);
            toast.error("An error occurred during PDF conversion.");
        } finally {
            setIsConverting(false);
            setProgress(0);
        }
    };
    
    const downloadImage = (dataUrl: string, pageNumber: number) => {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `page_${pageNumber}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const downloadAllAsZip = async () => {
        if (renderedPages.length === 0) return;
        
        toast.info("Zipping files... please wait.");
        const zip = new JSZip();
        
        renderedPages.forEach(page => {
            const base64Data = page.dataUrl.split(',')[1];
            zip.file(`page_${page.pageNumber}.png`, base64Data, { base64: true });
        });

        const content = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = 'converted_pages.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("ZIP file downloaded!");
    };


    return (
        <div className="space-y-6">
            {!file && (
                 <FileDropzone 
                    onDrop={onDrop}
                    accept={{ 'application/pdf': ['.pdf'] }}
                    multiple={false}
                    disabled={isConverting}
                />
            )}

            {file && !isConverting && renderedPages.length === 0 && (
                <div className="p-4 border rounded-lg flex items-center justify-between">
                    <p className="font-semibold truncate">{file.name}</p>
                    <Button variant="ghost" size="icon" onClick={() => { setFile(null); setRenderedPages([]); }}>
                        <X className="h-4 w-4"/>
                    </Button>
                </div>
            )}

            {isConverting && (
                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Converting PDF... {Math.round(progress)}%</p>
                    <Progress value={progress} />
                </div>
            )}
            
            {renderedPages.length > 0 && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold">Converted Pages ({renderedPages.length})</h3>
                        <Button onClick={downloadAllAsZip} size="sm"><Package className="mr-2 h-4 w-4"/> Download All as ZIP</Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {renderedPages.map(page => (
                            <Card key={page.pageNumber} className="group relative">
                                <div className="aspect-w-3 aspect-h-4 bg-muted flex items-center justify-center">
                                    <img src={page.dataUrl} alt={`Page ${page.pageNumber}`} className="object-contain w-full h-full rounded-t-lg" />
                                </div>
                                <div className="p-2 flex items-center justify-between">
                                    <p className="text-sm font-medium">Page {page.pageNumber}</p>
                                    <Button size="icon" variant="ghost" onClick={() => downloadImage(page.dataUrl, page.pageNumber)}>
                                        <Download className="h-4 w-4"/>
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {file && renderedPages.length === 0 && (
                 <Button onClick={convertPdfToImages} disabled={isConverting} className="w-full" size="lg">
                    {isConverting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <ImageIcon className="mr-2 h-4 w-4" />
                    )}
                    Convert PDF to Images
                </Button>
            )}
        </div>
    );
}
