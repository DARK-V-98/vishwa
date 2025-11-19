
'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { KeyRound, Copy } from 'lucide-react';
import { toast } from 'sonner';

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
    
    const copyToClipboard = () => {
        if (!password) return;
        navigator.clipboard.writeText(password);
        toast.success("Password copied to clipboard!");
    };

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <section className="pt-24 pb-12 md:pt-32 md:pb-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent">Password Generator</h1>
                    <p className="text-xl text-muted-foreground mt-4">Create strong, secure passwords with custom settings.</p>
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
                         <Button onClick={generatePassword} className="w-full">Generate Password</Button>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
