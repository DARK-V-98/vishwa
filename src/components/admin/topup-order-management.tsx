
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, PlusCircle, Trash2, Plus, Minus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface TopupPackage {
  id: string;
  name: string;
  price: number;
  realPrice?: number;
}

interface OrderItem {
    packageId: string;
    packageName: string;
    packagePrice: number;
    quantity: number;
    profit: number;
}

interface TopupOrder {
  id: string;
  playerId: string;
  items: OrderItem[];
  totalPrice: number;
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
    const [cart, setCart] = useState<{pkg: TopupPackage, quantity: number}[]>([]);

    const handleAddToCart = (packageId: string) => {
        const pkg = packages.find(p => p.id === packageId);
        if (!pkg) return;

        setCart(prev => {
            const existing = prev.find(item => item.pkg.id === packageId);
            if (existing) {
                return prev.map(item => item.pkg.id === packageId ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { pkg, quantity: 1 }];
        });
        toast.success(`${pkg.name} added to cart.`);
    }

    const updateQuantity = (packageId: string, newQuantity: number) => {
        setCart(prevCart => {
            if (newQuantity <= 0) {
                return prevCart.filter(item => item.pkg.id !== packageId);
            }
            return prevCart.map(item => 
                item.pkg.id === packageId ? { ...item, quantity: newQuantity } : item
            );
        });
    };

    const removeFromCart = (packageId: string) => {
        setCart(prevCart => prevCart.filter(item => item.pkg.id !== packageId));
        toast.info("Item removed from cart.");
    };

    const handleAddOrder = async () => {
        if (!playerId) { toast.error("Please enter a Player ID."); return; }
        if (cart.length === 0) { toast.error("Please add at least one package."); return; }

        setIsSubmitting(true);
        try {
            const orderItems = cart.map(({ pkg, quantity }) => ({
                packageId: pkg.id,
                packageName: pkg.name,
                packagePrice: pkg.price,
                quantity: quantity,
                profit: (pkg.price - (pkg.realPrice || 0)) * quantity,
            }));
            
            const totalProfit = orderItems.reduce((sum, item) => sum + item.profit, 0);
            const totalPrice = orderItems.reduce((sum, item) => sum + (item.packagePrice * item.quantity), 0);

            await addDoc(collection(firestore, 'topupOrders'), {
                playerId,
                items: orderItems,
                totalPrice: totalPrice,
                paymentMethod: 'manual',
                status: 'completed',
                source: 'manual',
                profit: totalProfit,
                createdAt: serverTimestamp(),
            });

            toast.success("Manual order added successfully!");
            onOrderAdded();
            setIsOpen(false);
            setPlayerId('');
            setCart([]);
        } catch (err: any) {
            toast.error(`Failed to add order: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
         <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4" />Add Manual Order</Button></DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Add Manual WhatsApp Order</DialogTitle>
                    <DialogDescription>Manually record an order placed outside the website.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
                    <div className="space-y-2">
                        <Label htmlFor="manual-player-id">Player ID</Label>
                        <Input id="manual-player-id" value={playerId} onChange={(e) => setPlayerId(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Packages</Label>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                            {packages.map(p => (<Button key={p.id} variant="outline" onClick={() => handleAddToCart(p.id)}>{p.name}</Button>))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Cart</Label>
                        {cart.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No items in cart.</p>
                        ) : (
                            <div className="space-y-3">
                               {cart.map(({pkg, quantity}) => (
                                    <div key={pkg.id} className="flex items-center gap-3">
                                       <div className="flex-grow">
                                           <p className="font-semibold">{pkg.name}</p>
                                           <p className="text-sm text-muted-foreground">LKR {pkg.price.toLocaleString()}</p>
                                       </div>
                                       <div className="flex items-center gap-1">
                                           <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(pkg.id, quantity - 1)}><Minus className="h-3 w-3" /></Button>
                                           <span className="w-6 text-center">{quantity}</span>
                                           <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(pkg.id, quantity + 1)}><Plus className="h-3 w-3" /></Button>
                                       </div>
                                       <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onClick={() => removeFromCart(pkg.id)}><Trash2 className="h-4 w-4"/></Button>
                                   </div>
                               ))}
                           </div>
                        )}
                    </div>
                     {cart.length > 0 && (
                        <div className="border-t pt-4 mt-4 space-y-4">
                            <div className="flex justify-between text-xl font-bold">
                                <span>Total:</span>
                                <span className="text-primary">
                                    LKR {cart.reduce((total, item) => total + (item.pkg.price * item.quantity), 0).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={handleAddOrder} disabled={isSubmitting}>{isSubmitting ? 'Adding...' : 'Add Order'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function TopupOrderManagement() {
  const firestore = useFirestore();
  
  const ordersCollection = useMemoFirebase(() => collection(firestore, 'topupOrders'), [firestore]);
  const ordersQuery = useMemoFirebase(() => query(ordersCollection, orderBy('createdAt', 'desc')), [ordersCollection]);
  const { data: orders, isLoading: ordersLoading, error: ordersError, forceRefresh } = useCollection<TopupOrder>(ordersQuery);
  
  const packagesCollection = useMemoFirebase(() => collection(firestore, 'topupPackages'), [firestore]);
  const packagesQuery = useMemoFirebase(() => query(packagesCollection, orderBy('order')), [packagesCollection]);
  const { data: packages, isLoading: packagesLoading, error: packagesError } = useCollection<TopupPackage>(packagesQuery);

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
      case 'pending': default: return 'outline';
    }
  }

  const isLoading = ordersLoading || packagesLoading;
  const error = ordersError || packagesError;

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <CardTitle>Top-up Orders</CardTitle>
          <CardDescription>View and manage all incoming top-up orders from the store.</CardDescription>
        </div>
        {!isLoading && packages && <ManualOrderDialog packages={packages} onOrderAdded={forceRefresh} />}
      </CardHeader>
      <CardContent>
        {isLoading && <div className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>}
        {error && <p className="text-destructive">Error loading data: {error.message}</p>}
        {!isLoading && orders && (
          <Accordion type="single" collapsible className="w-full">
            {orders.map((order) => (
              <AccordionItem value={order.id} key={order.id}>
                <AccordionTrigger>
                   <div className="grid grid-cols-5 w-full text-sm text-left pr-4">
                        <span className="truncate">{format(new Date(order.createdAt.seconds * 1000), 'PP p')}</span>
                        <span className="truncate">{order.playerId}</span>
                        <span><Badge variant={order.source === 'manual' ? 'secondary' : 'outline'} className="capitalize">{order.source || 'Website'}</Badge></span>
                        <span className={`font-semibold ${order.profit && order.profit > 0 ? 'text-green-500' : order.profit !== undefined ? 'text-red-500' : ''}`}>
                            {order.profit !== undefined ? `LKR ${order.profit.toLocaleString()}` : 'N/A'}
                        </span>
                        <span><Badge variant={getStatusVariant(order.status)} className="capitalize">{order.status}</Badge></span>
                   </div>
                </AccordionTrigger>
                <AccordionContent>
                    <div className="p-4 bg-muted/50 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                           <p className="font-semibold text-lg">Total: LKR {order.totalPrice.toLocaleString()}</p>
                           <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="sm" variant="outline"><MoreHorizontal className="h-4 w-4 mr-2" /> Actions</Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'processing')}>Mark as Processing</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'completed')}>Mark as Completed</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive" onClick={() => handleStatusChange(order.id, 'cancelled')}>Cancel Order</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Package</TableHead>
                                    <TableHead className="text-center">Qty</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
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
                    </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
