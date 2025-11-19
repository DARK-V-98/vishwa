
'use client';
import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Palette, Copy, ArrowLeft, RefreshCw, Zap, Shield, Globe, Users } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

// --- Color Conversion Utilities ---
type RGB = { r: number; g: number; b: number };
type HSL = { h: number; s: number; l: number };

function hexToRgb(hex: string): RGB | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHex({ r, g, b }: RGB): string {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function rgbToHsl({ r, g, b }: RGB): HSL {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToRgb({ h, s, l }: HSL): RGB {
    s /= 100; l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s,
          x = c * (1 - Math.abs((h / 60) % 2 - 1)),
          m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (h >= 0 && h < 60) { r = c; g = x; } else
    if (h >= 60 && h < 120) { r = x; g = c; } else
    if (h >= 120 && h < 180) { g = c; b = x; } else
    if (h >= 180 && h < 240) { g = x; b = c; } else
    if (h >= 240 && h < 300) { r = x; b = c; } else
    if (h >= 300 && h < 360) { r = c; b = x; }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    return { r, g, b };
}

const ColorCard = ({ color, name }: { color: string; name?: string }) => {
    const rgb = hexToRgb(color);
    const hsl = rgb ? rgbToHsl(rgb) : null;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`Copied "${text}" to clipboard!`);
    };

    return (
        <div className="flex flex-col">
            <div style={{ backgroundColor: color }} className="h-24 w-full rounded-t-lg border-b" />
            <div className="bg-muted/30 p-3 rounded-b-lg space-y-1 text-xs font-mono">
                {name && <p className="font-sans font-semibold text-sm">{name}</p>}
                <div className="flex justify-between items-center cursor-pointer" onClick={() => copyToClipboard(color.toUpperCase())}><span>{color.toUpperCase()}</span> <Copy className="h-3 w-3 text-muted-foreground" /></div>
                {rgb && <div className="flex justify-between items-center cursor-pointer" onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}><span>rgb({rgb.r}, {rgb.g}, {rgb.b})</span> <Copy className="h-3 w-3 text-muted-foreground" /></div>}
                {hsl && <div className="flex justify-between items-center cursor-pointer" onClick={() => copyToClipboard(`hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`)}><span>hsl({Math.round(hsl.h)}, {Math.round(hsl.s)}%, {Math.round(hsl.l)}%)</span> <Copy className="h-3 w-3 text-muted-foreground" /></div>}
            </div>
        </div>
    );
};

export default function ColorPaletteGeneratorPage() {
    const [baseColor, setBaseColor] = useState('#6D28D9');

    const harmonies = useMemo(() => {
        const rgb = hexToRgb(baseColor);
        if (!rgb) return null;
        const hsl = rgbToHsl(rgb);
        
        const complementary = hslToRgb({ h: (hsl.h + 180) % 360, s: hsl.s, l: hsl.l });
        const analogous1 = hslToRgb({ h: (hsl.h + 30) % 360, s: hsl.s, l: hsl.l });
        const analogous2 = hslToRgb({ h: (hsl.h - 30 + 360) % 360, s: hsl.s, l: hsl.l });
        const triadic1 = hslToRgb({ h: (hsl.h + 120) % 360, s: hsl.s, l: hsl.l });
        const triadic2 = hslToRgb({ h: (hsl.h - 120 + 360) % 360, s: hsl.s, l: hsl.l });

        return {
            complementary: rgbToHex(complementary),
            analogous: [rgbToHex(analogous1), baseColor, rgbToHex(analogous2)],
            triadic: [rgbToHex(triadic1), baseColor, rgbToHex(triadic2)],
        };
    }, [baseColor]);
    
    const generateRandomColor = () => {
        const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        setBaseColor(randomColor);
    };

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
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent">Color Palette Generator</h1>
                    <p className="text-xl text-muted-foreground mt-4 max-w-3xl mx-auto">Create beautiful, harmonious color palettes for your design projects. Enter a base color or generate one randomly.</p>
                </div>
            </section>
            <section className="container mx-auto px-4 pb-16">
                <Card className="max-w-4xl mx-auto shadow-strong">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Palette /> Generate Your Palette</CardTitle>
                        <CardDescription>Use the color picker or enter a HEX code to start.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="relative">
                                <Label htmlFor="color-picker" className="sr-only">Color Picker</Label>
                                <Input id="color-picker" type="color" value={baseColor} onChange={e => setBaseColor(e.target.value)} className="w-24 h-24 p-0 border-4"/>
                            </div>
                            <div className="flex-grow w-full space-y-2">
                                <Label htmlFor="hex-input">Base Color (HEX)</Label>
                                <Input id="hex-input" value={baseColor} onChange={e => setBaseColor(e.target.value)} className="font-mono text-lg h-12"/>
                            </div>
                            <Button onClick={generateRandomColor} variant="outline" className="w-full sm:w-auto h-12">
                                <RefreshCw className="mr-2" /> Random
                            </Button>
                        </div>
                        
                        {harmonies && (
                            <div className="space-y-6 pt-4 border-t">
                               <div>
                                    <h3 className="font-semibold text-lg mb-2">Complementary</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <ColorCard color={baseColor} name="Base"/>
                                        <ColorCard color={harmonies.complementary} name="Complementary"/>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Analogous</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <ColorCard color={harmonies.analogous[0]} />
                                        <ColorCard color={harmonies.analogous[1]} name="Base" />
                                        <ColorCard color={harmonies.analogous[2]} />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Triadic</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <ColorCard color={harmonies.triadic[0]} />
                                        <ColorCard color={harmonies.triadic[1]} name="Base" />
                                        <ColorCard color={harmonies.triadic[2]} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
