
'use client';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Copy, FileCode2, Shield, Zap } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const featureList = [
    { icon: Zap, title: "Live Preview", description: "See your formatted HTML output instantly as you type." },
    { icon: Shield, title: "100% Client-Side", description: "Your text is processed in your browser and is never uploaded." },
    { icon: FileCode2, title: "Clean HTML Output", description: "Generates semantic and clean HTML5 code from your Markdown." },
    { icon: Copy, title: "One-Click Copy", description: "Easily copy the generated HTML source code to your clipboard." },
];

const howItWorksSteps = [
    "Type or paste your Markdown text into the left-hand editor.",
    "The HTML preview on the right will update in real-time.",
    "Review the formatted output to ensure it looks correct.",
    "Click the 'Copy HTML' button to copy the generated HTML source to your clipboard."
];

const faqItems = [
    { q: "Is the Markdown Converter free to use?", a: "Yes, this tool is completely free, with no usage limits or sign-ups required." },
    { q: "Is my data private?", a: "Absolutely. All conversion happens locally in your browser. Your text is never sent to a server, ensuring complete confidentiality." },
    { q: "What version of Markdown is supported?", a: "This tool supports CommonMark, a widely-used and highly compatible Markdown specification. It covers all the essential syntax like headers, lists, code blocks, tables, and more." },
    { q: "Can I use this for my blog or documentation?", a: "Yes, this is a perfect tool for drafting content for blogs, static site generators (like Jekyll or Hugo), or project documentation." },
];

export default function MarkdownConverterPage() {
    const [markdown, setMarkdown] = useState(`# Hello, world!\n\nThis is a **live** Markdown to HTML converter.\n\n- Write Markdown on the left.\n- See the HTML result on the right.`);
    
    const copyHtml = () => {
        // This is a simplified approach. For perfect HTML string generation, a library like `marked` would be used,
        // but react-markdown is already in the project for rendering. This gets the innerHTML of the rendered output.
        const previewElement = document.getElementById('html-preview');
        if (previewElement) {
            navigator.clipboard.writeText(previewElement.innerHTML);
            toast.success("HTML copied to clipboard!");
        } else {
            toast.error("Could not copy HTML.");
        }
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
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent">Markdown to HTML Converter</h1>
                    <p className="text-xl text-muted-foreground mt-4 max-w-3xl mx-auto">A fast, secure, client-side tool to convert your Markdown into clean HTML with a live preview.</p>
                </div>
            </section>
            <section className="container mx-auto px-4 pb-16">
                <Card className="max-w-6xl mx-auto shadow-strong">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><FileCode2 /> Markdown Editor & Preview</CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                             <Label htmlFor="markdown-input">Markdown Input</Label>
                             <Textarea 
                                id="markdown-input" 
                                value={markdown} 
                                onChange={(e) => setMarkdown(e.target.value)} 
                                placeholder="Type your Markdown here..." 
                                rows={15} 
                                className="font-mono h-full"
                             />
                        </div>
                         <div className="space-y-2">
                             <div className="flex justify-between items-center">
                                <Label>HTML Preview</Label>
                                <Button variant="secondary" size="sm" onClick={copyHtml}><Copy className="mr-2"/> Copy HTML</Button>
                             </div>
                             <div id="html-preview" className="prose dark:prose-invert border rounded-md p-4 min-h-[358px] bg-muted/30">
                                <ReactMarkdown>{markdown}</ReactMarkdown>
                             </div>
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
