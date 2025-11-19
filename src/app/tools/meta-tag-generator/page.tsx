
'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Copy, Tags, Shield, Zap, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Image from 'next/image';

const featureList = [
    { icon: Zap, title: "Instant Generation", description: "Meta tags are generated in real-time as you type." },
    { icon: Shield, title: "100% Client-Side", description: "Your data is processed in your browser and is never uploaded." },
    { icon: Share2, title: "Social Previews", description: "Generate Open Graph and Twitter Card tags for better social sharing." },
    { icon: Copy, title: "One-Click Copy", description: "Easily copy the generated HTML tags to your clipboard." },
];

const faqItems = [
    { q: "What are meta tags?", a: "Meta tags are snippets of text that describe a page's content; they don't appear on the page itself, but only in the page's source code. They help tell search engines what a web page is about." },
    { q: "Why are Open Graph and Twitter Card tags important?", a: "These specific meta tags control how your content appears when shared on social media platforms like Facebook, Twitter, and LinkedIn. They allow you to specify the title, description, and image that will be displayed." },
    { q: "Is this tool free?", a: "Yes, this tool is 100% free to use with no limitations." },
    { q: "Is my data safe?", a: "Yes. All processing happens locally in your browser. No data is ever sent to a server." },
];


export default function MetaTagGeneratorPage() {
    const [siteTitle, setSiteTitle] = useState('');
    const [description, setDescription] = useState('');
    const [keywords, setKeywords] = useState('');
    const [author, setAuthor] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [siteUrl, setSiteUrl] = useState('');
    const [generatedTags, setGeneratedTags] = useState('');

    useEffect(() => {
        const tags = `<!-- Standard Meta Tags -->
<title>${siteTitle}</title>
<meta name="description" content="${description}">
<meta name="keywords" content="${keywords}">
${author ? `<meta name="author" content="${author}">` : ''}

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${siteUrl}">
<meta property="og:title" content="${siteTitle}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${imageUrl}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${siteUrl}">
<meta property="twitter:title" content="${siteTitle}">
<meta property="twitter:description" content="${description}">
<meta property="twitter:image" content="${imageUrl}">`;
        setGeneratedTags(tags.trim());
    }, [siteTitle, description, keywords, author, imageUrl, siteUrl]);

    const copyToClipboard = () => {
        if (!generatedTags) return;
        navigator.clipboard.writeText(generatedTags);
        toast.success("Meta tags copied to clipboard!");
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
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent">Meta Tag Generator</h1>
                    <p className="text-xl text-muted-foreground mt-4 max-w-3xl mx-auto">Generate essential SEO and social media meta tags for your website to improve visibility and sharing.</p>
                </div>
            </section>
            <section className="container mx-auto px-4 pb-16">
                <div className="grid lg:grid-cols-2 gap-8 items-start">
                    <Card className="shadow-strong">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Tags /> Generate Your Tags</CardTitle>
                            <CardDescription>Fill in the details to create your meta tags.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="siteTitle">Site Title</Label>
                                <Input id="siteTitle" value={siteTitle} onChange={e => setSiteTitle(e.target.value)} placeholder="Your Website Title" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Site Description</Label>
                                <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="A brief description of your website." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="keywords">Keywords</Label>
                                <Input id="keywords" value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="keyword1, keyword2, keyword3" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="author">Author (Optional)</Label>
                                <Input id="author" value={author} onChange={e => setAuthor(e.target.value)} placeholder="John Doe" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="siteUrl">Site URL</Label>
                                <Input id="siteUrl" type="url" value={siteUrl} onChange={e => setSiteUrl(e.target.value)} placeholder="https://example.com" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="imageUrl">Image URL (for social sharing)</Label>
                                <Input id="imageUrl" type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" />
                            </div>
                        </CardContent>
                    </Card>
                    <div className="space-y-8">
                        <Card className="shadow-strong h-full">
                            <CardHeader>
                                <CardTitle>Generated Tags</CardTitle>
                                <CardDescription>Copy and paste this into the `<head>` section of your HTML.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <pre className="p-4 bg-muted rounded-md text-sm overflow-x-auto h-64 font-mono">
                                    <code>{generatedTags}</code>
                                </pre>
                                <Button onClick={copyToClipboard} className="w-full">
                                    <Copy className="mr-2" /> Copy Tags
                                </Button>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Social Preview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="border rounded-lg overflow-hidden">
                                     {imageUrl ? (
                                        <Image
                                            src={imageUrl}
                                            alt="Social Preview"
                                            width={500}
                                            height={261}
                                            className="w-full aspect-[1.91/1] object-cover"
                                            onError={(e) => (e.currentTarget.style.display = 'none')}
                                        />
                                    ) : (
                                        <div className="aspect-[1.91/1] bg-muted flex items-center justify-center">
                                            <p className="text-muted-foreground text-sm">No image provided</p>
                                        </div>
                                    )}
                                    <div className="p-4 bg-background">
                                        <p className="text-xs text-muted-foreground uppercase">{siteUrl ? new URL(siteUrl).hostname : 'example.com'}</p>
                                        <p className="font-semibold truncate">{siteTitle || 'Your Website Title'}</p>
                                        <p className="text-sm text-muted-foreground truncate">{description || 'A brief description of your website.'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
            
             <div className="container mx-auto px-4 py-16 space-y-16 max-w-4xl">
                 <section>
                    <h2 className="text-3xl font-bold text-center mb-10">Meta Tag Generator Features</h2>
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
