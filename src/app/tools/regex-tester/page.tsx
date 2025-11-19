
'use client';
import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Regex, Copy, ArrowLeft, Zap, Shield, TestTube2, Users } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

const featureList = [
    { icon: Zap, title: "Live Matching", description: "See results instantly as you type your pattern and test string." },
    { icon: Shield, title: "100% Client-Side", description: "Your data is processed in your browser and is never uploaded." },
    { icon: Regex, title: "Flag Support", description: "Easily toggle global (g), case-insensitive (i), and multiline (m) flags." },
    { icon: TestTube2, title: "Match Highlighting", description: "Visually identify all matches directly within your test string." },
];

const howItWorksSteps = [
    "Enter your regular expression pattern in the first input field.",
    "Type or paste the text you want to test in the 'Test String' area.",
    "Select the desired flags (g, i, m) using the checkboxes.",
    "The 'Result' and 'Matches' sections will update in real-time.",
    "Review the highlighted text and the list of matches found."
];

const faqItems = [
    { q: "Is the Regex Tester free?", a: "Yes, this tool is completely free and has no usage limits." },
    { q: "Is my test data safe?", a: "Absolutely. All regex processing happens locally in your browser. Your patterns and test strings are never sent to a server." },
    { q: "What do the flags mean?", a: "'g' (Global) finds all matches instead of stopping after the first. 'i' (Case-insensitive) ignores letter casing. 'm' (Multiline) allows start (^) and end ($) anchors to match the start/end of lines, not just the whole string." },
    { q: "What happens if my regex is invalid?", a: "The tool will detect an invalid pattern and display an error message, helping you to debug it." },
];


export default function RegexTesterPage() {
    const [pattern, setPattern] = useState('');
    const [testString, setTestString] = useState('');
    const [flags, setFlags] = useState({ g: true, i: false, m: false });
    const [error, setError] = useState('');

    const handleFlagChange = (flag: 'g' | 'i' | 'm') => {
        setFlags(prev => ({ ...prev, [flag]: !prev[flag] }));
    };

    const { matches, highlightedText } = useMemo(() => {
        if (!pattern) return { matches: [], highlightedText: testString };

        let regex;
        let foundMatches = [];
        let outputText: (string | JSX.Element)[] = [testString];

        try {
            const flagString = Object.entries(flags).filter(([, val]) => val).map(([key]) => key).join('');
            regex = new RegExp(pattern, flagString);
            setError('');
        } catch (e: any) {
            setError(e.message);
            return { matches: [], highlightedText: testString };
        }

        if (testString) {
            if (flags.g) {
                foundMatches = Array.from(testString.matchAll(regex));
                let lastIndex = 0;
                outputText = [];
                foundMatches.forEach((match, i) => {
                    if (match.index > lastIndex) {
                        outputText.push(testString.substring(lastIndex, match.index));
                    }
                    outputText.push(<mark key={i} className="bg-primary/20">{match[0]}</mark>);
                    lastIndex = match.index + match[0].length;
                });
                if (lastIndex < testString.length) {
                    outputText.push(testString.substring(lastIndex));
                }
            } else {
                const match = testString.match(regex);
                if (match) {
                    foundMatches.push(match as any);
                    outputText = [
                        testString.substring(0, match.index),
                        <mark key="0" className="bg-primary/20">{match[0]}</mark>,
                        testString.substring(match.index + match[0].length),
                    ];
                }
            }
        }

        return { matches: foundMatches, highlightedText: <>{outputText}</> };

    }, [pattern, testString, flags]);
    
    const copyMatches = () => {
        const matchesText = matches.map((match, i) => `Match ${i+1}: ${match[0]}\nGroups: ${JSON.stringify(Array.from(match).slice(1))}`).join('\n\n');
        navigator.clipboard.writeText(matchesText);
        toast.success("Match data copied to clipboard!");
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
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent">Regex Tester</h1>
                    <p className="text-xl text-muted-foreground mt-4 max-w-3xl mx-auto">A simple, secure, and real-time tool to test and debug your regular expressions. All processing is done client-side.</p>
                </div>
            </section>
            <section className="container mx-auto px-4 pb-16">
                <Card className="max-w-4xl mx-auto shadow-strong">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Regex /> Test Your Regular Expression</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                             <Label htmlFor="regex-pattern">Regular Expression</Label>
                             <Input id="regex-pattern" value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="e.g., \b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b" className="font-mono"/>
                        </div>

                         <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="flag-g" checked={flags.g} onCheckedChange={() => handleFlagChange('g')} />
                                <Label htmlFor="flag-g">Global (g)</Label>
                            </div>
                             <div className="flex items-center space-x-2">
                                <Checkbox id="flag-i" checked={flags.i} onCheckedChange={() => handleFlagChange('i')} />
                                <Label htmlFor="flag-i">Case-insensitive (i)</Label>
                            </div>
                             <div className="flex items-center space-x-2">
                                <Checkbox id="flag-m" checked={flags.m} onCheckedChange={() => handleFlagChange('m')} />
                                <Label htmlFor="flag-m">Multiline (m)</Label>
                            </div>
                        </div>
                        {error && <p className="text-destructive text-sm">{error}</p>}

                        <div className="space-y-2">
                             <Label htmlFor="test-string">Test String</Label>
                             <Textarea id="test-string" value={testString} onChange={(e) => setTestString(e.target.value)} placeholder="Paste the text you want to test here..." rows={8} className="font-mono"/>
                        </div>

                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="font-semibold">Result</h3>
                            <div className="p-4 bg-muted rounded-md min-h-[100px] whitespace-pre-wrap font-mono text-sm">{highlightedText}</div>
                        </div>

                        <div className="space-y-4 pt-4 border-t">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold">Matches Found ({matches.length})</h3>
                                <Button variant="outline" size="sm" onClick={copyMatches} disabled={matches.length === 0}><Copy className="mr-2"/>Copy Matches</Button>
                            </div>
                            <div className="max-h-60 overflow-y-auto space-y-2">
                                {matches.map((match, i) => (
                                    <div key={i} className="p-2 border rounded">
                                        <p><Badge variant="secondary">Match {i+1}</Badge> <code className="font-mono bg-muted/50 p-1 rounded">{match[0]}</code></p>
                                        {match.length > 1 && <p className="text-xs text-muted-foreground mt-1">Groups: {JSON.stringify(Array.from(match).slice(1))}</p>}
                                    </div>
                                ))}
                                {matches.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No matches found.</p>}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>
            
             <div className="container mx-auto px-4 py-16 space-y-16 max-w-4xl">
                 <section>
                    <h2 className="text-3xl font-bold text-center mb-10">Why Use Our Regex Tester?</h2>
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

