
'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Fingerprint, ArrowLeft, Shield, Copy, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const featureList = [
    { icon: Fingerprint, title: "Instant Decoding", description: "Paste your JWT and see the decoded header and payload immediately." },
    { icon: Shield, title: "100% Client-Side", description: "Your token is never sent to a server, ensuring complete privacy." },
    { icon: Copy, title: "Easy Copying", description: "Copy the decoded JSON with a single click." },
];

const howItWorksSteps = [
    "Find the JWT (JSON Web Token) you want to inspect. It's a long string with two dots.",
    "Paste the entire token into the input area.",
    "The tool will automatically decode the token's Header and Payload.",
    "Review the decoded data, which is displayed in formatted JSON.",
];

const faqItems = [
    { q: "Is the JWT Decoder safe to use with sensitive tokens?", a: "Yes. This tool is 100% client-side. The decoding happens entirely in your browser. Your token is never transmitted over the network, making it safe for sensitive data." },
    { q: "Does this tool validate the JWT signature?", a: "No. This tool only decodes the token to display its contents. It does not verify the signature against a secret key. To verify the signature, you would need the secret key and server-side code." },
    { q: "What does 'Invalid Token' mean?", a: "This error appears if the text you pasted is not a valid JWT. A JWT must consist of three parts separated by dots (Header.Payload.Signature), with the Header and Payload being valid Base64Url-encoded JSON." },
    { q: "Can I edit the token here?", a: "This is a decoder-only tool. You cannot edit or re-sign tokens here." },
];

const CodeBlock = ({ title, data }: { title: string, data: object | null }) => {
    const jsonString = data ? JSON.stringify(data, null, 2) : "{}";
    
    const handleCopy = () => {
        if(data){
            navigator.clipboard.writeText(jsonString);
            toast.success(`${title} copied to clipboard!`);
        }
    };
    
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">{title}</h3>
                 <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!data}><Copy className="mr-2"/>Copy</Button>
            </div>
            <pre className="p-4 bg-muted rounded-md text-sm overflow-x-auto">
                <code>{jsonString}</code>
            </pre>
        </div>
    )
};


export default function JwtDecoderPage() {
    const [token, setToken] = useState('');
    const [decodedHeader, setDecodedHeader] = useState<object | null>(null);
    const [decodedPayload, setDecodedPayload] = useState<object | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token.trim()) {
            setDecodedHeader(null);
            setDecodedPayload(null);
            setError('');
            return;
        }

        const parts = token.split('.');
        if (parts.length !== 3) {
            setError('Invalid token structure. A JWT must have three parts separated by dots.');
            setDecodedHeader(null);
            setDecodedPayload(null);
            return;
        }

        try {
            const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
            const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
            setDecodedHeader(header);
            setDecodedPayload(payload);
            setError('');
        } catch (e) {
            setError('Invalid token. Could not decode Base64Url parts.');
            setDecodedHeader(null);
            setDecodedPayload(null);
        }
    }, [token]);

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
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent">JWT Decoder</h1>
                    <p className="text-xl text-muted-foreground mt-4 max-w-3xl mx-auto">A secure, client-side tool to decode and inspect JSON Web Tokens instantly. Paste your token to see the header and payload data.</p>
                </div>
            </section>
            <section className="container mx-auto px-4 pb-16">
                <Card className="max-w-4xl mx-auto shadow-strong">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Fingerprint /> Decode Your JWT</CardTitle>
                        <CardDescription>Paste your token below. Decoding happens in your browser and your data is never sent to a server.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                             <Label htmlFor="jwt-input">JWT Token</Label>
                             <Textarea id="jwt-input" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Paste your token here..." rows={5} className="font-mono text-sm" />
                        </div>
                        {error && <div className="text-destructive flex items-center gap-2 text-sm"><AlertTriangle />{error}</div>}
                        <div className="grid md:grid-cols-2 gap-6">
                            <CodeBlock title="Header" data={decodedHeader} />
                            <CodeBlock title="Payload" data={decodedPayload} />
                        </div>
                    </CardContent>
                </Card>
            </section>
            
             <div className="container mx-auto px-4 py-16 space-y-16 max-w-4xl">
                 <section>
                    <h2 className="text-3xl font-bold text-center mb-10">JWT Decoder Features</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
