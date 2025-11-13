
'use client';

import { useState } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface TopupOrder {
  id: string;
  playerId: string;
  packageName: string;
  packagePrice: number;
  paymentMethod: 'online' | 'bank';
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: { seconds: number; nanoseconds: number };
}

export default function TopupOrderManagement() {
  const firestore = useFirestore();
  const ordersCollection = useMemoFirebase(() => collection(firestore, 'topupOrders'), [firestore]);
  const ordersQuery = useMemoFirebase(() => query(ordersCollection, orderBy('createdAt', 'desc')), [ordersCollection]);
  const { data: orders, isLoading, error } = useCollection<Omit<TopupOrder, 'id'>>(ordersQuery);

  const handleStatusChange = async (orderId: string, newStatus: TopupOrder['status']) => {
    const orderDoc = doc(firestore, 'topupOrders', orderId);
    try {
      await updateDoc(orderDoc, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}.`);
    } catch (err: any) {
      toast.error(`Failed to update status: ${err.message}`);
    }
  };

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
    <Card>
      <CardHeader>
        <CardTitle>Top-up Orders</CardTitle>
        <CardDescription>
          View and manage all incoming top-up orders from the store.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
            <div className="space-y-2">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
        )}
        {error && <p className="text-destructive">Error loading orders: {error.message}</p>}
        {!isLoading && orders && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Player ID</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{format(new Date(order.createdAt.seconds * 1000), 'PPp')}</TableCell>
                  <TableCell>{order.playerId}</TableCell>
                  <TableCell className="font-medium">{order.packageName}</TableCell>
                  <TableCell>LKR {order.packagePrice.toLocaleString()}</TableCell>
                  <TableCell className="capitalize">{order.paymentMethod}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(order.status)} className="capitalize">{order.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'processing')}>Mark as Processing</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'completed')}>Mark as Completed</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => handleStatusChange(order.id, 'cancelled')}>
                          Cancel Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

    