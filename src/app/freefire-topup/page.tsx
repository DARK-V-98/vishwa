
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useFirestore, useCollection, useDoc, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Gem, ShieldCheck, Zap, Image as ImageIcon, Banknote, CreditCard, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';

interface TopupPackage {
  id: string;
  name: string;
  price: number;
  realPrice?: number;
  category: 'Gems' | 'Membership' | 'Other';
  imageUrl?: string;
  order: number;
}

interface PaymentSettings {
    onlinePaymentEnabled: boolean;
    bankTransferEnabled: boolean;
}

interface CartItem extends TopupPackage {
    quantity: number;
}

export default function FreefireTopupPage() {
  const firestore = useFirestore();
  const { user } = useUser();
  const router = useRouter();

  const packagesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    const packagesCollection = collection(firestore, 'topupPackages');
    return query(packagesCollection, orderBy('order'));
  }, [firestore]);
  const { data: packages, isLoading: packagesLoading, error: packagesError } = useCollection<TopupPackage>(packagesQuery);
  
  const paymentSettingsDoc = useMemoFirebase(() => firestore ? doc(firestore, 'settings', 'payment') : null, [firestore]);
  const { data: paymentSettings, isLoading: settingsLoading } = useDoc<PaymentSettings>(paymentSettingsDoc);

  const [playerId, setPlayerId] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'bank' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPrice = useMemo(() => {
      return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart]);

  const addToCart = (pkg: TopupPackage) => {
    setCart(prevCart => {
        const existingItem = prevCart.find(item => item.id === pkg.id);
        if (existingItem) {
            return prevCart.map(item => 
                item.id === pkg.id ? { ...item, quantity: item.quantity + 1 } : item
            );
        }
        return [...prevCart, { ...pkg, quantity: 1 }];
    });
    toast.success(`${pkg.name} added to cart!`);
  };

  const updateQuantity = (packageId: string, newQuantity: number) => {
    setCart(prevCart => {
        if (newQuantity <= 0) {
            return prevCart.filter(item => item.id !== packageId);
        }
        return prevCart.map(item => 
            item.id === packageId ? { ...item, quantity: newQuantity } : item
        );
    });
  };

  const removeFromCart = (packageId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== packageId));
    toast.info("Item removed from cart.");
  };

  const handlePlaceOrder = async () => {
    if (!user || !firestore) {
      toast.error('You must create an account to place an order.', {
        action: { label: "Sign Up / Log In", onClick: () => router.push('/auth') },
      });
      return;
    }

    const userDocRef = doc(firestore, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists() || !userDoc.data()?.username) {
        toast.error("Please complete your profile to place an order.", {
            description: "You'll be redirected to complete your profile.",
            action: { label: "Complete Profile", onClick: () => router.push('/auth/complete-profile') }
        });
        router.push('/auth/complete-profile');
        return;
    }

    if (!playerId) { toast.error('Please enter your Player ID.'); return; }
    if (cart.length === 0) { toast.error('Your cart is empty.'); return; }
    if (!paymentMethod) { toast.error('Please select a payment method.'); return; }

    setIsSubmitting(true);

    try {
        const orderItems = cart.map(item => ({
            packageId: item.id,
            packageName: item.name,
            packagePrice: item.price,
            quantity: item.quantity,
            profit: (item.price - (item.realPrice || 0)) * item.quantity,
        }));
        
        const totalProfit = orderItems.reduce((sum, item) => sum + item.profit, 0);

        const ordersCollection = collection(firestore, 'topupOrders');
        await addDoc(ordersCollection, {
            userId: user.uid,
            userEmail: user.email,
            playerId,
            items: orderItems,
            totalPrice: totalPrice,
            paymentMethod,
            status: 'pending',
            createdAt: serverTimestamp(),
            source: 'website',
            profit: totalProfit,
        });

        toast.success(`Your order for ${cart.length} item(s) has been placed successfully!`);
        setPlayerId('');
        setCart([]);
        setPaymentMethod(null);
    } catch (err: any) {
        toast.error(`Failed to place order: ${err.message}`);
    } finally {
        setIsSubmitting(false);
    }
  };

  const isLoading = packagesLoading || settingsLoading;
  
  const isValidUrl = (url: string | undefined): url is string => {
    if (!url) return false;
    try { new URL(url); return true; } catch (e) { return false; }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10">
        <Image src="/tp.png" alt="Free Fire Top-up Background" fill className="object-cover" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-12 pt-24">
        <div className="max-w-4xl mx-auto text-center space-y-6 mb-12">
          <div className="inline-block"><span className="px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-semibold border border-secondary/20">Game Top-up</span></div>
          <h1 className="text-4xl md:text-6xl font-bold"><span className="bg-gradient-accent bg-clip-text text-transparent">DARK DIAMOND STORE</span></h1>
          <p className="text-xl text-muted-foreground">Instantly top-up your Free Fire diamonds. Enter your Player ID, select a package, and get your diamonds in seconds.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <Card className="border-border/50 bg-card/70 backdrop-blur-sm shadow-strong">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Gem className="text-primary" />Create Your Order</CardTitle>
                <CardDescription>Complete the steps below to place your top-up order.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-2">
                  <Label htmlFor="playerId" className="text-lg font-semibold">Step 1: Enter Player ID</Label>
                  <Input id="playerId" type="text" placeholder="Enter your Free Fire Player ID" value={playerId} onChange={(e) => setPlayerId(e.target.value)} className="h-12 text-lg"/>
                </div>

                <div className="space-y-4">
                   <Label className="text-lg font-semibold">Step 2: Choose Your Packages</Label>
                  {isLoading && (<div className="grid grid-cols-2 md:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}</div>)}
                  {packagesError && <p className="text-destructive">Could not load packages. Please try again later.</p>}
                  {!isLoading && packages && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {packages.map((pkg) => (
                        <Card key={pkg.id} className="cursor-pointer transition-all overflow-hidden border-border/50 hover:shadow-medium">
                            <CardContent className="p-0 text-center relative flex flex-col h-full">
                                <div className="h-48 w-full flex items-center justify-center p-2 relative bg-black/10">
                                  {isValidUrl(pkg.imageUrl) ? (<Image src={pkg.imageUrl} alt={pkg.name} layout="fill" className="object-contain p-2" />) : (<ImageIcon className="h-8 w-8 text-muted-foreground" />)}
                                </div>
                                <div className="p-4 pt-2 space-y-2 flex-grow flex flex-col justify-between">
                                  <p className="text-base font-bold flex-grow">{pkg.name}</p>
                                  <div>
                                     <p className="text-md text-primary font-semibold">LKR {pkg.price.toLocaleString()}</p>
                                     <Button size="sm" className="w-full mt-2" onClick={() => addToCart(pkg)}>Add to Cart</Button>
                                  </div>
                                </div>
                            </CardContent>
                        </Card>
                        ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6 sticky top-24">
             <Card className="border-border/50 bg-card/70 backdrop-blur-sm shadow-strong">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ShoppingCart className="text-primary"/>Your Cart</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   {cart.length === 0 ? (
                       <p className="text-muted-foreground text-center py-4">Your cart is empty.</p>
                   ) : (
                       <div className="space-y-3">
                           {cart.map(item => (
                               <div key={item.id} className="flex items-center gap-3">
                                   <div className="flex-grow">
                                       <p className="font-semibold">{item.name}</p>
                                       <p className="text-sm text-muted-foreground">LKR {item.price.toLocaleString()}</p>
                                   </div>
                                   <div className="flex items-center gap-1">
                                       <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus className="h-3 w-3" /></Button>
                                       <span className="w-6 text-center">{item.quantity}</span>
                                       <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="h-3 w-3" /></Button>
                                   </div>
                                   <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onClick={() => removeFromCart(item.id)}><Trash2 className="h-4 w-4"/></Button>
                               </div>
                           ))}
                       </div>
                   )}
                   {cart.length > 0 && (
                     <div className="border-t pt-4 mt-4 space-y-4">
                        <div className="flex justify-between text-xl font-bold">
                            <span>Total:</span>
                            <span className="text-primary">LKR {totalPrice.toLocaleString()}</span>
                        </div>
                        <div className="space-y-2">
                           <Label className="font-semibold">Payment Method</Label>
                             <RadioGroup value={paymentMethod || ''} onValueChange={(val: 'online' | 'bank') => setPaymentMethod(val)} className="grid grid-cols-1 gap-2">
                                {paymentSettings?.onlinePaymentEnabled && (<Card className={`cursor-pointer p-2 ${paymentMethod === 'online' ? 'border-primary ring-2 ring-primary' : ''}`} onClick={() => setPaymentMethod('online')}><CardContent className="p-1 flex items-center gap-2"><CreditCard className="h-4 w-4"/><p className="text-sm font-medium">Online Payment</p><RadioGroupItem value="online" className="ml-auto" /></CardContent></Card>)}
                                {paymentSettings?.bankTransferEnabled && (<Card className={`cursor-pointer p-2 ${paymentMethod === 'bank' ? 'border-primary ring-2 ring-primary' : ''}`} onClick={() => setPaymentMethod('bank')}><CardContent className="p-1 flex items-center gap-2"><Banknote className="h-4 w-4"/><p className="text-sm font-medium">Bank Transfer</p><RadioGroupItem value="bank" className="ml-auto" /></CardContent></Card>)}
                             </RadioGroup>
                        </div>
                     </div>
                   )}
                </CardContent>
                 {cart.length > 0 && (
                    <CardFooter>
                       <Button size="lg" className="w-full text-lg py-7" variant="hero" onClick={handlePlaceOrder} disabled={!playerId || !paymentMethod || isLoading || isSubmitting}>{isSubmitting ? 'Placing Order...' : 'Place Order'}</Button>
                    </CardFooter>
                 )}
            </Card>

             <Card className="border-border/50 bg-card/70 backdrop-blur-sm shadow-strong">
                <CardHeader><CardTitle>How to find your Player ID?</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <ol className="list-decimal list-inside text-muted-foreground space-y-2 text-sm">
                        <li>Open the Free Fire app on your device.</li>
                        <li>Go to your in-game profile page.</li>
                        <li>Your Player ID will be displayed below your username.</li>
                        <li>Copy the ID and paste it here.</li>
                    </ol>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center"><Image src="/hf.png" alt="Free Fire Profile Example" width={400} height={225} className="rounded-md object-cover"/></div>
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
