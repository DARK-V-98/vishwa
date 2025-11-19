
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Server, ArrowLeft, Send, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
type KeyValuePair = { id: number; key: string; value: string };

const CodeBlock = ({ data }: { data: string }) => {
    try {
        const parsed = JSON.parse(data);
        return <pre className="p-4 bg-muted rounded-md text-sm overflow-x-auto">{JSON.stringify(parsed, null, 2)}</pre>;
    } catch {
        return <pre className="p-4 bg-muted rounded-md text-sm overflow-x-auto whitespace-pre-wrap">{data}</pre>;
    }
};

export default function ApiTesterPage() {
    const [url, setUrl] = useState('');
    const [method, setMethod] = useState<Method>('GET');
    const [headers, setHeaders] = useState<KeyValuePair[]>([{ id: 1, key: 'Content-Type', value: 'application/json' }]);
    const [body, setBody] = useState('');
    const [response, setResponse] = useState<{ status: number; headers: Headers; body: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const addHeader = () => setHeaders([...headers, { id: Date.now(), key: '', value: '' }]);
    const updateHeader = (id: number, field: 'key' | 'value', value: string) => {
        setHeaders(headers.map(h => (h.id === id ? { ...h, [field]: value } : h)));
    };
    const removeHeader = (id: number) => setHeaders(headers.filter(h => h.id !== id));

    const handleSend = async () => {
        if (!url) {
            toast.error("Please enter a URL.");
            return;
        }

        setLoading(true);
        setError('');
        setResponse(null);

        const requestHeaders = new Headers();
        headers.forEach(h => {
            if (h.key && h.value) {
                requestHeaders.append(h.key, h.value);
            }
        });

        const options: RequestInit = {
            method,
            headers: requestHeaders,
        };

        if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
            options.body = body;
        }

        try {
            const res = await fetch(url, options);
            const resBody = await res.text();
            setResponse({ status: res.status, headers: res.headers, body: resBody });
            toast.success(`Request successful with status ${res.status}`);
        } catch (e: any) {
            setError(`Network Error: ${e.message}`);
            toast.error(`Request failed: ${e.message}`);
        } finally {
            setLoading(false);
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
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent">API Tester</h1>
                    <p className="text-xl text-muted-foreground mt-4 max-w-3xl mx-auto">A lightweight, browser-based client to test your API endpoints. A mini Postman, right in your browser.</p>
                </div>
            </section>
            <section className="container mx-auto px-4 pb-16">
                <Card className="max-w-4xl mx-auto shadow-strong">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Server /> Make a Request</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col sm:flex-row gap-2">
                            <Select value={method} onValueChange={(v: Method) => setMethod(v)}>
                                <SelectTrigger className="w-full sm:w-[120px]"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="GET">GET</SelectItem>
                                    <SelectItem value="POST">POST</SelectItem>
                                    <SelectItem value="PUT">PUT</SelectItem>
                                    <SelectItem value="DELETE">DELETE</SelectItem>
                                    <SelectItem value="PATCH">PATCH</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://api.example.com/data" className="flex-grow" />
                            <Button onClick={handleSend} disabled={loading} className="sm:w-auto w-full">
                                {loading ? <Loader2 className="animate-spin" /> : <Send />}
                                <span className="ml-2">Send</span>
                            </Button>
                        </div>
                        
                        <Tabs defaultValue="headers">
                            <TabsList>
                                <TabsTrigger value="headers">Headers</TabsTrigger>
                                <TabsTrigger value="body" disabled={!['POST', 'PUT', 'PATCH'].includes(method)}>Body</TabsTrigger>
                            </TabsList>
                            <TabsContent value="headers" className="mt-4 space-y-2">
                                {headers.map(h => (
                                    <div key={h.id} className="flex gap-2 items-center">
                                        <Input value={h.key} onChange={e => updateHeader(h.id, 'key', e.target.value)} placeholder="Key" />
                                        <Input value={h.value} onChange={e => updateHeader(h.id, 'value', e.target.value)} placeholder="Value" />
                                        <Button variant="ghost" size="icon" onClick={() => removeHeader(h.id)}><Trash2 className="text-destructive" /></Button>
                                    </div>
                                ))}
                                <Button variant="outline" size="sm" onClick={addHeader}>Add Header</Button>
                            </TabsContent>
                            <TabsContent value="body" className="mt-4">
                                <Textarea value={body} onChange={e => setBody(e.target.value)} placeholder='{ "key": "value" }' rows={8} className="font-mono" />
                            </TabsContent>
                        </Tabs>

                        {error && <p className="text-destructive">{error}</p>}
                        
                        {(response || loading) && (
                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="text-xl font-bold">Response</h3>
                                {loading && <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="animate-spin" /> Fetching response...</div>}
                                {response && (
                                     <div>
                                        <div className="flex items-center gap-4 mb-2">
                                            <p>Status: <span className={`font-bold ${response.status >= 400 ? 'text-red-500' : 'text-green-500'}`}>{response.status}</span></p>
                                        </div>
                                        <Tabs defaultValue="body">
                                            <TabsList>
                                                <TabsTrigger value="body">Body</TabsTrigger>
                                                <TabsTrigger value="headers">Headers</TabsTrigger>
                                            </TabsList>
                                            <TabsContent value="body" className="mt-4"><CodeBlock data={response.body} /></TabsContent>
                                            <TabsContent value="headers" className="mt-4">
                                                <pre className="p-4 bg-muted rounded-md text-sm overflow-x-auto">
                                                    <code>{Array.from(response.headers.entries()).map(([k, v]) => `${k}: ${v}`).join('\n')}</code>
                                                </pre>
                                            </TabsContent>
                                        </Tabs>
                                     </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
