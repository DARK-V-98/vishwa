
'use client';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileDropzoneProps {
    onDrop: (acceptedFiles: File[]) => void;
    accept: Record<string, string[]>;
    multiple?: boolean;
    disabled?: boolean;
}

export default function FileDropzone({ onDrop, accept, multiple = true, disabled = false }: FileDropzoneProps) {
    const onDropCallback = useCallback((acceptedFiles: File[]) => {
        onDrop(acceptedFiles);
    }, [onDrop]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: onDropCallback,
        accept,
        multiple,
        disabled,
    });

    return (
        <div
            {...getRootProps()}
            className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/30 hover:border-primary",
                disabled ? "cursor-not-allowed opacity-50" : ""
            )}
        >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center gap-4">
                <UploadCloud className="h-10 w-10 text-muted-foreground" />
                {isDragActive ? (
                    <p className="text-primary font-semibold">Drop the files here...</p>
                ) : (
                    <div>
                        <p className="font-semibold">Drag & drop files here, or click to select</p>
                        <p className="text-sm text-muted-foreground">
                            {Object.values(accept).flat().join(', ').toUpperCase()} supported
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
