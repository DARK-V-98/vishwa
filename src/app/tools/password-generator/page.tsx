
'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { KeyRound, Copy, ArrowLeft, Zap, Shield, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

const featureList = [
    { icon: KeyRound, title: "Customizable Rules", description: "Control length, numbers, symbols, and uppercase characters." },
    { icon: Zap, title: "Instant Generation", description: "Create a new, strong password with a single click." },
    { icon: Shield, title: "Secure & Private", description: "Generation happens in your browser; nothing is saved or sent." },
    { icon: Copy, title: "One-Click Copy", description: "Easily copy the generated password to your clipboard." },
];

const howItWorksSteps = [
    "Adjust the slider to set your desired password length (8-64 characters).",
    "Use the checkboxes to include or exclude uppercase letters, numbers, and symbols.",
    "Click the 'Generate Password' button.",
    "Your new, secure password will appear in the display box.",
    "Click the copy icon to instantly copy it to your clipboard."
];

const faqItems = [
    { q: "Is this Password Generator secure?", a: "Yes. It's extremely secure because it runs entirely on your device. The password is generated using your browser's built-in random number generator and is never transmitted over the internet." },
    { q: "Are the generated passwords saved anywhere?", a: "No. We do not store, log, or track any passwords you create. Once you leave the page, the password is gone forever unless you've copied it." },
    { q: "What makes a password 'strong'?", a: "A strong password is long and contains a mix of uppercase letters, lowercase letters, numbers, and symbols. This makes it exponentially harder for attackers to guess or 'brute-force'." },
    { q: "What is the best length for a password?", a: "Longer is always better. Security experts recommend a minimum of 12-16 characters for important accounts. For maximum security, 20 characters or more is ideal." },
    { q: "Can I use this for my bank or email account?", a: "Absolutely. This tool is perfect for creating highly secure passwords for your most sensitive accounts." },
];


export default function PasswordGeneratorPage() {
    const [password, setPassword] = useState('');
    const [length, setLength] = useState(16);
    const [includeUppercase, setIncludeUppercase] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(true);

    const generatePassword = () => {
        const lower = 'abcdefghijklmnopqrstuvwxyz';
        const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
        
        let charSet = lower;
        if (includeUppercase) charSet += upper;
        if (includeNumbers) charSet += numbers;
        if (includeSymbols) charSet += symbols;
        
        let newPassword = '';
        for (let i = 0; i < length; i++) {
            newPassword += charSet.charAt(Math.floor(Math.random() * charSet.length));
        }
        setPassword(newPassword);
        toast.success("New password generated!");
    };
    
    useEffect(() => {
        generatePassword();
    }, [length, includeUppercase, includeNumbers, includeSymbols]);


    const copyToClipboard = () => {
        if (!password) return;
        navigator.clipboard.writeText(password);
        toast.success("Password copied to clipboard!");
    };

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <section className="pt-24 pb-12 md:pt-32 md:pb-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-md mx-auto mb-8 text-left">
                        <Button variant="outline" asChild>
                            <Link href="/tools">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Tools
                            </Link>
                        </Button>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent">Password Generator</h1>
                    <p className="text-xl text-muted-foreground mt-4 max-w-3xl mx-auto">Create strong, secure, and random passwords with custom settings. This free tool runs entirely in your browser for maximum privacy.</p>
                </div>
            </section>
            <section className="container mx-auto px-4 pb-16">
                <Card className="max-w-md mx-auto shadow-strong">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><KeyRound /> Generate a Secure Password</CardTitle>
                        <CardDescription>Customize the options below and generate your new password.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <div className="relative">
                            <Input readOnly value={password} placeholder="Your new password will appear here" className="pr-10 h-12 text-lg font-mono" />
                            <Button variant="ghost" size="icon" className="absolute top-0 right-0 h-full" onClick={copyToClipboard}><Copy/></Button>
                         </div>
                         <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Length: {length}</Label>
                                <Slider value={[length]} onValueChange={(val) => setLength(val[0])} min={8} max={64} step={1} />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="uppercase" checked={includeUppercase} onCheckedChange={(checked) => setIncludeUppercase(!!checked)} />
                                <Label htmlFor="uppercase">Include Uppercase (A-Z)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="numbers" checked={includeNumbers} onCheckedChange={(checked) => setIncludeNumbers(!!checked)} />
                                <Label htmlFor="numbers">Include Numbers (0-9)</Label>
                            </div>
                             <div className="flex items-center space-x-2">
                                <Checkbox id="symbols" checked={includeSymbols} onCheckedChange={(checked) => setIncludeSymbols(!!checked)} />
                                <Label htmlFor="symbols">Include Symbols (!@#$...)</Label>
                            </div>
                         </div>
                         <Button onClick={generatePassword} className="w-full">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Generate New Password
                        </Button>
                    </CardContent>
                </Card>
            </section>

             <div className="container mx-auto px-4 py-16 space-y-16 max-w-4xl">
                 <section>
                    <h2 className="text-3xl font-bold text-center mb-10">Password Generator Features</h2>
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
                    <h2 className="text-3xl font-bold text-center mb-10">Who Is This For?</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                         {["Anyone creating a new account", "Users updating old passwords", "IT Administrators", "Security-conscious individuals"].map(role => (
                            <Badge key={role} variant="secondary" className="px-4 py-2 text-sm">{role}</Badge>
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
