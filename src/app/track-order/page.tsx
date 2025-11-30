
'use client';

import { useState } from 'react';
import { useFirestore } from '@/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Search, Server, GitBranch, ShieldCheck, TestTube, CheckCircle, Package, Calendar, Info } from 'lucide-react';
import { WebOrder, WebOrderUpdate } from '@/lib/types';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const stageIcons = {
    Designing: <GitBranch />,
    Developing: <Server />,
    Testing: <TestTube />,
    Completed: <CheckCircle />,
};

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [order, setOrder] = useState<WebOrder | null>(null);
    const [updates, setUpdates] = useState<WebOrderUpdate[]>([]);
    const firestore = useFirestore();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderId.trim()) {
            setError("Please enter an Order ID.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setOrder(null);
        setUpdates([]);

        try {
            const ordersRef = collection(firestore, 'webOrders');
            const q = query(ordersRef, where("id", "==", orderId.trim()));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setError("No order found with this ID. Please check the ID and try again.");
            } else {
                const orderDoc = querySnapshot.docs[0];
                const orderData = { ...orderDoc.data(), docId: orderDoc.id } as WebOrder;
                setOrder(orderData);
                
                // Fetch updates
                const updatesRef = collection(firestore, 'webOrders', orderDoc.id, 'updates');
                const updatesQuery = query(updatesRef, orderBy('timestamp', 'desc'));
                const updatesSnapshot = await getDocs(updatesQuery);
                const updatesData = updatesSnapshot.docs.map(doc => doc.data() as WebOrderUpdate);
                setUpdates(updatesData);
            }
        } catch (err: any) {
            console.error("Error fetching order:", err);
            setError("An error occurred while fetching your order. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container py-12 pt-24 min-h-screen">
            <div className="max-w-2xl mx-auto text-center mb-12">
                <h1 className="text-4xl font-bold mb-2">Track Your Website Order</h1>
                <p className="text-muted-foreground">
                    Enter your unique Order ID below to see the latest progress on your project.
                </p>
            </div>

            <Card className="max-w-lg mx-auto mb-12 shadow-strong">
                <CardHeader>
                    <CardTitle>Find Your Order</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
                        <Label htmlFor="orderId" className="sr-only">Order ID</Label>
                        <Input 
                            id="orderId" 
                            placeholder="e.g., 4829A" 
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                        />
                        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                            {isLoading ? <Loader2 className="animate-spin" /> : <Search className="mr-2" />}
                            Track
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {error && (
                 <Alert variant="destructive" className="max-w-lg mx-auto">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {order && (
                <Card className="max-w-4xl mx-auto animate-in fade-in-50">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div>
                                <CardTitle className="text-2xl">Order Progress: #{order.id}</CardTitle>
                                <CardDescription>Status as of {format(new Date(), "PPP")}</CardDescription>
                            </div>
                             <Badge variant="secondary" className="text-lg px-4 py-2">{order.status}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-8">
                         {/* Progress Bar */}
                        <div className="space-y-4">
                            <h3 className="font-semibold">Current Stage: {order.currentStage}</h3>
                            <div className="flex justify-between items-center gap-2 text-xs text-muted-foreground">
                                {Object.keys(stageIcons).map(stage => (
                                    <div key={stage} className="flex flex-col items-center flex-1">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${order.currentStage === stage ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                            {stageIcons[stage as keyof typeof stageIcons]}
                                        </div>
                                        <span className="mt-1">{stage}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <Separator/>
                        
                        {/* Updates Feed */}
                        <div className="space-y-4">
                            <h3 className="font-semibold">Project Updates</h3>
                            {updates.length > 0 ? (
                                <div className="space-y-6">
                                    {updates.map((update, index) => (
                                        <div key={index} className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${index === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                                    <Calendar className="h-5 w-5"/>
                                                </div>
                                                {index < updates.length - 1 && <div className="w-px h-full bg-border"></div>}
                                            </div>
                                            <div className="pb-6">
                                                <p className="font-semibold">{update.stage}</p>
                                                <p className="text-sm text-muted-foreground">{format(new Date((update.timestamp as unknown as Timestamp).seconds * 1000), 'PPp')}</p>
                                                <p className="mt-2 text-sm">{update.note}</p>
                                                {update.attachmentUrl && (
                                                    <Button variant="link" asChild className="p-0 h-auto mt-2">
                                                        <Link href={update.attachmentUrl} target="_blank" rel="noopener noreferrer">View Attachment</Link>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-sm">No updates posted by the admin yet.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
