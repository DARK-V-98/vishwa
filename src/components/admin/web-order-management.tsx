
'use client';

import { useState } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, Loader2, Copy, Link as LinkIcon, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { format } from 'date-fns';
import Link from 'next/link';
import { WebOrder } from '@/lib/types';
import { Badge } from '../ui/badge';

function generateOrderId(): string {
    const digits = Math.floor(1000 + Math.random() * 9000);
    const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    return `${digits}${letter}`;
}

const websiteTypes = ["Business", "Ecommerce", "LMS", "Portfolio", "Custom"];

function NewOrderDialog() {
    const firestore = useFirestore();
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [clientPhone, setClientPhone] = useState('');
    const [websiteType, setWebsiteType] = useState('');
    const [totalCost, setTotalCost] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!clientPhone || !websiteType || !totalCost) {
            toast.error("Please fill all fields.");
            return;
        }
        setIsSubmitting(true);

        const newOrderId = generateOrderId();
        const cost = parseFloat(totalCost);

        try {
            const orderData = {
                id: newOrderId,
                createdByAdmin: true,
                userId: null,
                clientPhone,
                websiteType,
                totalCost: cost,
                status: 'Pending Client Details',
                currentStage: 'Designing',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };
            
            await addDoc(collection(firestore, 'webOrders'), orderData);
            
            const orderLink = `${window.location.origin}/order/${newOrderId}`;
            navigator.clipboard.writeText(orderLink);
            toast.success("Order created and link copied to clipboard!", {
                description: `Order ID: ${newOrderId}`,
            });

            setIsOpen(false);
            setClientPhone('');
            setWebsiteType('');
            setTotalCost('');
        } catch (err: any) {
            toast.error(`Failed to create order: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Web Order
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Website Order</DialogTitle>
                    <DialogDescription>
                        This will generate a unique link for the client to complete their order details.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="clientPhone">Client Phone/WhatsApp</Label>
                        <Input id="clientPhone" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="websiteType">Website Type</Label>
                         <Select onValueChange={setWebsiteType} value={websiteType}>
                            <SelectTrigger><SelectValue placeholder="Select a type..." /></SelectTrigger>
                            <SelectContent>
                                {websiteTypes.map(type => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="totalCost">Total Website Cost (LKR)</Label>
                        <Input id="totalCost" type="number" value={totalCost} onChange={(e) => setTotalCost(e.target.value)} required />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="animate-spin" /> : 'Create & Copy Link'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function WebOrderManagement() {
    const firestore = useFirestore();
    const ordersCollection = useMemoFirebase(() => collection(firestore, 'webOrders'), [firestore]);
    const ordersQuery = useMemoFirebase(() => query(ordersCollection, orderBy('createdAt', 'desc')), [ordersCollection]);
    const { data: orders, isLoading, error } = useCollection<WebOrder>(ordersQuery);
    
    const copyLink = (orderId: string) => {
        const orderLink = `${window.location.origin}/order/${orderId}`;
        navigator.clipboard.writeText(orderLink);
        toast.success("Order link copied to clipboard!");
    }

    return (
        <div>
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Manage Web Orders</h2>
                    <p className="text-muted-foreground">Create new orders and track client project progress.</p>
                </div>
                <NewOrderDialog />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Website Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && [...Array(3)].map((_, i) => (
                                <TableRow key={i}><TableCell colSpan={6}><Skeleton className="h-8" /></TableCell></TableRow>
                            ))}
                            {error && <TableRow><TableCell colSpan={6} className="text-destructive text-center">Error: {error.message}</TableCell></TableRow>}
                            {!isLoading && orders?.map(order => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-mono">{order.id}</TableCell>
                                    <TableCell>{order.userId || order.clientPhone}</TableCell>
                                    <TableCell>{order.websiteType}</TableCell>
                                    <TableCell>
                                        <Badge variant={order.status === 'Pending Client Details' ? 'secondary' : 'default'}>{order.status}</Badge>
                                    </TableCell>
                                    <TableCell>{format(order.createdAt.seconds * 1000, 'PP')}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="outline" size="sm" onClick={() => copyLink(order.id)}>
                                            <LinkIcon className="h-4 w-4" />
                                        </Button>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/order/${order.id}`} target="_blank"><Eye className="h-4 w-4" /></Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {!isLoading && orders?.length === 0 && <TableRow><TableCell colSpan={6} className="text-center h-24">No orders found.</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
