
'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Package, Calendar, Tag, Circle, CreditCard, ShoppingCart } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface OrderItem {
    packageName: string;
    packagePrice: number;
    quantity: number;
}

interface TopupOrder {
    id: string;
    items: OrderItem[];
    totalPrice: number;
    paymentMethod: 'online' | 'bank' | 'manual';
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    createdAt: { seconds: number; nanoseconds: number };
}

export default function MyOrdersPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const router = useRouter();

    const ordersQuery = useMemoFirebase(() => {
        if (!user) return null;
        const ordersCollection = collection(firestore, 'topupOrders');
        return query(ordersCollection, where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
    }, [firestore, user]);

    const { data: orders, isLoading: ordersLoading, error } = useCollection<Omit<TopupOrder, 'id'>>(ordersQuery);
    
    if (isUserLoading) {
        return (
            <div className="container py-12 pt-24">
                <Skeleton className="h-8 w-1/4 mb-4" />
                <Skeleton className="h-4 w-1/2 mb-8" />
                <Card><CardContent className="p-6"><Skeleton className="h-40 w-full" /></CardContent></Card>
            </div>
        );
    }
    
    if (!user) {
        router.push('/auth');
        return null;
    }

    const getStatusVariant = (status: TopupOrder['status']): "default" | "secondary" | "destructive" | "outline" => {
        switch (status) {
          case 'completed': return 'default';
          case 'processing': return 'secondary';
          case 'cancelled': return 'destructive';
          case 'pending':
          default: return 'outline';
        }
    }

    return (
        <div className="container py-12 pt-24">
            <h1 className="text-4xl font-bold mb-2">My Orders</h1>
            <p className="text-muted-foreground mb-8">A history of all your top-up purchases.</p>

            <Card>
                <CardHeader>
                    <CardTitle>Your Top-up History</CardTitle>
                    <CardDescription>Here are the details of your recent orders.</CardDescription>
                </CardHeader>
                <CardContent>
                    {ordersLoading && <div className="space-y-2">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>}
                    {error && <p className="text-destructive">Error loading your orders. Please try again later.</p>}
                    {!ordersLoading && orders && orders.length === 0 && <p className="text-center text-muted-foreground py-8">You haven't placed any orders yet.</p>}
                    {!ordersLoading && orders && orders.length > 0 && (
                        <Accordion type="single" collapsible className="w-full">
                            {orders.map((order) => (
                                <AccordionItem value={order.id} key={order.id}>
                                    <AccordionTrigger>
                                        <div className="flex justify-between w-full pr-4">
                                            <div className="text-left">
                                                <p className="font-semibold">Order ID: ...{order.id.slice(-6)}</p>
                                                <p className="text-sm text-muted-foreground">{format(new Date(order.createdAt.seconds * 1000), 'PPp')}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Badge variant={getStatusVariant(order.status)} className="capitalize">{order.status}</Badge>
                                                <p className="font-semibold text-lg">LKR {order.totalPrice.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="p-4 bg-muted/50 rounded-md">
                                             <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead><Package className="inline-block h-4 w-4 mr-2"/>Package</TableHead>
                                                        <TableHead className="text-center">Quantity</TableHead>
                                                        <TableHead className="text-right"><Tag className="inline-block h-4 w-4 mr-2"/>Unit Price</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {order.items.map((item, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{item.packageName}</TableCell>
                                                            <TableCell className="text-center">{item.quantity}</TableCell>
                                                            <TableCell className="text-right">LKR {item.packagePrice.toLocaleString()}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                            <p className="text-sm text-muted-foreground capitalize mt-4">Payment Method: {order.paymentMethod}</p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
