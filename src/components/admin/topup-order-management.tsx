
'use client';

import { useState } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface TopupPackage {
  id: string;
  name: string;
  price: number;
  realPrice?: number;
}

interface TopupOrder {
  id: string;
  playerId: string;
  packageName: string;
  packagePrice: number;
  paymentMethod: 'online' | 'bank' | 'manual';
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: { seconds: number; nanoseconds: number };
  source?: 'website' | 'manual';
  profit?: number;
}

function ManualOrderDialog({ packages, onOrderAdded }: { packages: TopupPackage[], onOrderAdded: () => void }) {
    const firestore = useFirestore();
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [playerId, setPlayerId] = useState('');
    const [selectedPackageId, setSelectedPackageId] = useState('');

    const handleAddOrder = async () => {
        if (!playerId || !selectedPackageId) {
            toast.error("Please enter a Player ID and select a package.");
            return;
        }

        const selectedPackage = packages.find(p => p.id === selectedPackageId);
        if (!selectedPackage) {
            toast.error("Selected package not found.");
            return;
        }

        setIsSubmitting(true);
        try {
            const profit = selectedPackage.price - (selectedPackage.realPrice || 0);

            await addDoc(collection(firestore, 'topupOrders'), {
                playerId,
                packageId: selectedPackage.id,
                packageName: selectedPackage.name,
                packagePrice: selectedPackage.price,
                paymentMethod: 'manual',
                status: 'completed',
                source: 'manual',
                profit: profit,
                createdAt: serverTimestamp(),
            });

            toast.success("Manual order added successfully!");
            onOrderAdded();
            setIsOpen(false);
            setPlayerId('');
            setSelectedPackageId('');
        } catch (err: any) {
            toast.error(`Failed to add order: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
         <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Manual Order
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Manual WhatsApp Order</DialogTitle>
                    <DialogDescription>
                        Manually record an order placed outside the website. Profit will be calculated automatically.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="manual-player-id">Player ID</Label>
                        <Input id="manual-player-id" value={playerId} onChange={(e) => setPlayerId(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="manual-package-id">Package</Label>
                        <Select value={selectedPackageId} onValueChange={setSelectedPackageId}>
                            <SelectTrigger><SelectValue placeholder="Select a package..." /></SelectTrigger>
                            <SelectContent>
                                {packages.map(p => (
                                    <SelectItem key={p.id} value={p.id}>{p.name} (LKR {p.price})</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={handleAddOrder} disabled={isSubmitting}>
                        {isSubmitting ? 'Adding...' : 'Add Order'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


export default function TopupOrderManagement() {
  const firestore = useFirestore();
  
  const ordersCollection = useMemoFirebase(() => collection(firestore, 'topupOrders'), [firestore]);
  const ordersQuery = useMemoFirebase(() => query(ordersCollection, orderBy('createdAt', 'desc')), [ordersCollection]);
  const { data: orders, isLoading: ordersLoading, error: ordersError, forceRefresh } = useCollection<Omit<TopupOrder, 'id'>>(ordersQuery);
  
  const packagesCollection = useMemoFirebase(() => collection(firestore, 'topupPackages'), [firestore]);
  const packagesQuery = useMemoFirebase(() => query(packagesCollection, orderBy('order')), [packagesCollection]);
  const { data: packages, isLoading: packagesLoading, error: packagesError } = useCollection<Omit<TopupPackage, 'id'>>(packagesQuery);


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

  const isLoading = ordersLoading || packagesLoading;
  const error = ordersError || packagesError;

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <CardTitle>Top-up Orders</CardTitle>
          <CardDescription>
            View and manage all incoming top-up orders from the store.
          </CardDescription>
        </div>
        {!isLoading && packages && <ManualOrderDialog packages={packages} onOrderAdded={forceRefresh} />}
      </CardHeader>
      <CardContent>
        {isLoading && (
            <div className="space-y-2">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
        )}
        {error && <p className="text-destructive">Error loading data: {error.message}</p>}
        {!isLoading && orders && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Player ID</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Profit</TableHead>
                <TableHead>Source</TableHead>
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
                  <TableCell className={order.profit && order.profit > 0 ? 'text-green-500' : 'text-red-500'}>
                    {order.profit !== undefined ? `LKR ${order.profit.toLocaleString()}` : 'N/A'}
                  </TableCell>
                   <TableCell>
                    <Badge variant={order.source === 'manual' ? 'secondary' : 'outline'} className="capitalize">{order.source || 'Website'}</Badge>
                   </TableCell>
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
