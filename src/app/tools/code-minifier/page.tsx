
'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Code, Copy, ArrowLeft, Zap, Shield, FileCheck2, Users, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const featureList = [
    { icon: Code, title: "Multi-Language Support", description: "Minify HTML, CSS, and JavaScript code seamlessly." },
    { icon: Zap, title: "Instant Results", description: "Get your optimized, smaller code in a single click." },
    { icon: Shield, title: "100% Client-Side", description: "Your code is processed in your browser and is never uploaded." },
    { icon: FileCheck2, title: "Significant Reduction", description: "Reduces file size by removing whitespace and comments." },
];

const howItWorksSteps = [
    "Select the code type: HTML, CSS, or JavaScript.",
    "Paste your code into the 'Input' text area.",
    "Click the 'Minify Code' button.",
    "The minified code will appear in the 'Output' text area.",
    "Click the 'Copy' button to copy the result to your clipboard."
];

const faqItems = [
    { q: "Is the Code Minifier free to use?", a: "Yes, this tool is completely free. There are no limits on the amount of code you can minify." },
    { q: "Is my code safe?", a: "Absolutely. All minification happens locally in your browser. Your code is never sent to any server, ensuring complete privacy and security." },
    { q: "What does 'minify' mean?", a: "Minification is the process of removing all unnecessary characters from source code without changing its functionality. This includes removing whitespace, comments, and new lines, which reduces the file size and makes it load faster for users." },
    { q: "Will this break my code?", a: "Our minifier is designed to be safe, but it's always a good practice to test your minified code before deploying it to production, especially with complex JavaScript." },
];

const minifyCSS = (css: string) => {
    return css
        .replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '$1') // remove comments
        .replace(/\s+/g, ' ') // collapse whitespace
        .replace(/ ?([{:;,]) ?/g, '$1') // remove space around delimiters
        .trim();
};

const minifyHTML = (html: string) => {
    return html
        .replace(/<!--[\s\S]*?-->/g, '') // remove comments
        .replace(/>\s+</g, '><') // remove whitespace between tags
        .trim();
};

const minifyJS = (js: string) => {
    // A simple regex approach. For production, a parser-based tool is safer.
    return js
        .replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '$1') // remove comments
        .replace(/\s+/g, ' ') // collapse whitespace
        .replace(/ ?([=;:{}\[\](),!]) ?/g, '$1') // remove space around operators/delimiters
        .trim();
};

export default function CodeMinifierPage() {
    const [inputCode, setInputCode] = useState('');
    const [outputCode, setOutputCode] = useState('');
    const [activeTab, setActiveTab] = useState('css');

    const handleMinify = () => {
        if (!inputCode) {
            toast.warning("Please enter some code to minify.");
            return;
        }
        let minified = '';
        try {
            switch (activeTab) {
                case 'css':
                    minified = minifyCSS(inputCode);
                    break;
                case 'js':
                    minified = minifyJS(inputCode);
                    break;
                case 'html':
                    minified = minifyHTML(inputCode);
                    break;
            }
            setOutputCode(minified);
            toast.success("Code minified successfully!");
        } catch (e) {
            toast.error("An error occurred during minification.");
            console.error(e);
        }
    };
    
    const copyToClipboard = () => {
        if (!outputCode) return;
        navigator.clipboard.writeText(outputCode);
        toast.success("Minified code copied to clipboard!");
    };
    
    const clearFields = () => {
        setInputCode('');
        setOutputCode('');
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
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent">Code Minifier</h1>
                    <p className="text-xl text-muted-foreground mt-4 max-w-3xl mx-auto">Optimize your HTML, CSS, and JavaScript files by reducing their size. A fast, secure, and client-side tool for web developers.</p>
                </div>
            </section>
            <section className="container mx-auto px-4 pb-16">
                <Card className="max-w-4xl mx-auto shadow-strong">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Code /> Minify Your Code</CardTitle>
                        <CardDescription>Select the language, paste your code, and get the minified version instantly.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="css">CSS</TabsTrigger>
                            <TabsTrigger value="js">JavaScript</TabsTrigger>
                            <TabsTrigger value="html">HTML</TabsTrigger>
                          </TabsList>
                        </Tabs>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                           <div className="space-y-2">
                                <Label htmlFor="input-code">Input</Label>
                                <Textarea id="input-code" value={inputCode} onChange={(e) => setInputCode(e.target.value)} placeholder={`Paste your ${activeTab.toUpperCase()} code here...`} rows={10} className="font-mono"/>
                           </div>
                           <div className="space-y-2">
                                <Label htmlFor="output-code">Output</Label>
                                <Textarea id="output-code" value={outputCode} readOnly placeholder="Minified code will appear here..." rows={10} className="font-mono bg-muted/50" />
                           </div>
                        </div>

                         <div className="flex flex-col sm:flex-row gap-2">
                             <Button onClick={handleMinify} className="w-full">
                                <Zap className="mr-2" /> Minify Code
                            </Button>
                             <Button onClick={copyToClipboard} variant="secondary" className="w-full" disabled={!outputCode}>
                                <Copy className="mr-2" /> Copy Result
                            </Button>
                             <Button onClick={clearFields} variant="destructive" className="w-full" disabled={!inputCode && !outputCode}>
                                <Trash2 className="mr-2" /> Clear
                            </Button>
                         </div>
                    </CardContent>
                </Card>
            </section>
            
             <div className="container mx-auto px-4 py-16 space-y-16 max-w-4xl">
                 <section>
                    <h2 className="text-3xl font-bold text-center mb-10">Why Minify Your Code?</h2>
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
