
'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Package, Calendar, Tag, Circle, CreditCard } from 'lucide-react';

interface TopupOrder {
    id: string;
    packageName: string;
    packagePrice: number;
    paymentMethod: 'online' | 'bank';
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
                    <CardDescription>
                        Here are the details of your recent orders.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {ordersLoading && (
                        <div className="space-y-2">
                            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                        </div>
                    )}
                    {error && <p className="text-destructive">Error loading your orders. Please try again later.</p>}
                    {!ordersLoading && orders && orders.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">You haven't placed any orders yet.</p>
                    )}
                    {!ordersLoading && orders && orders.length > 0 && (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead><Calendar className="inline-block h-4 w-4 mr-2"/>Date</TableHead>
                                    <TableHead><Package className="inline-block h-4 w-4 mr-2"/>Package</TableHead>
                                    <TableHead><Tag className="inline-block h-4 w-4 mr-2"/>Price</TableHead>
                                    <TableHead><CreditCard className="inline-block h-4 w-4 mr-2"/>Payment</TableHead>
                                    <TableHead><Circle className="inline-block h-4 w-4 mr-2"/>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell>{format(new Date(order.createdAt.seconds * 1000), 'PPp')}</TableCell>
                                        <TableCell className="font-medium">{order.packageName}</TableCell>
                                        <TableCell>LKR {order.packagePrice.toLocaleString()}</TableCell>
                                        <TableCell className="capitalize">{order.paymentMethod}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(order.status)} className="capitalize">{order.status}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
