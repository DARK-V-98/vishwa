'use client';

import { useState, useRef, useEffect } from 'react';
import FileDropzone from './FileDropzone';
import { Button } from '../ui/button';
import { Loader2, MonitorPlay, Download } from 'lucide-react';
import { Progress } from '../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';

type OutputFormat = 'mp4' | 'webm' | 'mov' | 'avi';

export default function VideoConverter() {
    const [file, setFile] = useState<File | null>(null);
    const [isConverting, setIsConverting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [outputFormat, setOutputFormat] = useState<OutputFormat>('mp4');
    const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
    const [isFFmpegLoaded, setIsFFmpegLoaded] = useState(false);
    const ffmpegRef = useRef<FFmpeg | null>(null);

    const loadFFmpeg = async () => {
        if (ffmpegRef.current) {
            setIsFFmpegLoaded(true);
            return;
        }
        const ffmpegInstance = new FFmpeg();
        ffmpegRef.current = ffmpegInstance;

        ffmpegInstance.on('log', ({ message }) => {
            console.log(message);
        });

        ffmpegInstance.on('progress', ({ progress: p }) => {
            setProgress(Math.round(p * 100));
        });

        try {
            // Path to the public directory where core files are copied by postinstall script
            const baseURL = '/ffmpeg';
            await ffmpegInstance.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
                workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
            });
            setIsFFmpegLoaded(true);
            toast.success("Video converter is loaded and ready.");
        } catch (error) {
            toast.error("Failed to load video converter. Please try reloading the page.");
            console.error(error);
        }
    };

    useEffect(() => {
        loadFFmpeg();
    }, []);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setConvertedUrl(null);
            setProgress(0);
        }
    }, []);
    
    const convertVideo = async () => {
        if (!file) return toast.warning("Please upload a video file.");
        if (!ffmpegRef.current) return toast.error("FFmpeg is not ready. Please wait or reload.");

        setIsConverting(true);
        setConvertedUrl(null);
        setProgress(0);

        try {
            const inputFileName = file.name;
            const outputFileName = `${file.name.split('.').slice(0, -1).join('.')}.${outputFormat}`;
            
            await ffmpegRef.current.writeFile(inputFileName, await fetchFile(file));
            await ffmpegRef.current.exec(['-i', inputFileName, outputFileName]);
            
            const data = await ffmpegRef.current.readFile(outputFileName);
            const url = URL.createObjectURL(new Blob([(data as Uint8Array).buffer], { type: `video/${outputFormat}` }));
            setConvertedUrl(url);

            toast.success("Video converted successfully!");
        } catch (error) {
            toast.error("An error occurred during conversion.");
            console.error(error);
        } finally {
            setIsConverting(false);
            setProgress(0);
        }
    };

    return (
        <div className="space-y-6">
            {!isFFmpegLoaded && (
                <Alert>
                    <Loader2 className="h-4 w-4 animate-spin"/>
                    <AlertTitle>Loading Converter</AlertTitle>
                    <AlertDescription>The video conversion engine is loading. This might take a moment.</AlertDescription>
                </Alert>
            )}

            <FileDropzone 
                onDrop={onDrop}
                accept={{ 'video/*': ['.mp4', '.avi', '.webm', '.mov', '.mkv'] }}
                multiple={false}
                disabled={isConverting || !isFFmpegLoaded}
            />

            {file && (
                <>
                    <div className="p-2 border rounded-lg">
                        <p className="font-semibold truncate">Selected: {file.name}</p>
                    </div>
                    <div className="space-y-2">
                         <Label>Output Format</Label>
                         <Select value={outputFormat} onValueChange={(v: OutputFormat) => setOutputFormat(v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="mp4">MP4</SelectItem>
                                <SelectItem value="webm">WebM</SelectItem>
                                <SelectItem value="mov">MOV</SelectItem>
                                <SelectItem value="avi">AVI</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </>
            )}

            {isConverting && (
                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Converting... {progress}%</p>
                    <Progress value={progress} />
                </div>
            )}
            
            <Button onClick={convertVideo} disabled={!file || isConverting || !isFFmpegLoaded} className="w-full" size="lg">
                {isConverting ? <Loader2 className="mr-2 animate-spin" /> : <MonitorPlay className="mr-2" />}
                Convert Video
            </Button>
            
            {convertedUrl && (
                 <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-semibold">Conversion Complete</h3>
                    <video src={convertedUrl} controls className="w-full rounded-md" />
                    <a href={convertedUrl} download={`${file?.name.split('.').slice(0, -1).join('.')}.${outputFormat}`}>
                        <Button className="w-full" variant="outline"><Download className="mr-2" /> Download Converted Video</Button>
                    </a>
                </div>
            )}
        </div>
    );
}