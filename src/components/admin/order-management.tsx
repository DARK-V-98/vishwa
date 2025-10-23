
"use client";

import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, Timestamp } from "firebase/firestore";
import { Skeleton } from "../ui/skeleton";
import { format } from "date-fns";

interface DesignOrder {
    id: string;
    serviceType: 'logo' | 'post';
    clientName: string;
    status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
    createdAt: Timestamp;
}

export function OrderManagement() {
  const firestore = useFirestore();

  const ordersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'designOrders'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: orders, isLoading, error } = useCollection<DesignOrder>(ordersQuery);

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Completed': return 'outline';
            case 'In Progress': return 'default';
            case 'Pending': return 'secondary';
            default: return 'destructive';
        }
    }

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Design Orders</CardTitle>
                    <CardDescription>
                    Track and manage all incoming design service orders.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return <p>Error loading design orders: {error.message}</p>
    }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Design Orders</CardTitle>
        <CardDescription>
          Track and manage all incoming design service orders.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Type</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Created</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.serviceType === 'logo' ? 'Logo Design' : 'Post Design'}</TableCell>
                <TableCell>{order.clientName}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                </TableCell>
                <TableCell>{format(order.createdAt.toDate(), 'PPP')}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View Order</DropdownMenuItem>
                      <DropdownMenuItem>Update Status</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Cancel Order</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

    