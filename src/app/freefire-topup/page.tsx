
'use client';

import { useState, useEffect } from 'react';
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
import { Gem, ShieldCheck, Zap, Image as ImageIcon, Banknote, CreditCard } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';

interface TopupPackage {
  id: string;
  name: string;
  price: number;
  category: 'Gems' | 'Membership' | 'Other';
  imageUrl?: string;
  order: number;
}

interface PaymentSettings {
    onlinePaymentEnabled: boolean;
    bankTransferEnabled: boolean;
}

interface UserProfile {
    username?: string;
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
  const { data: packages, isLoading: packagesLoading, error: packagesError } = useCollection<Omit<TopupPackage, 'id'>>(packagesQuery);
  
  const paymentSettingsDoc = useMemoFirebase(() => firestore ? doc(firestore, 'settings', 'payment') : null, [firestore]);
  const { data: paymentSettings, isLoading: settingsLoading } = useDoc<PaymentSettings>(paymentSettingsDoc);

  const [playerId, setPlayerId] = useState('');
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'bank' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePlaceOrder = async () => {
    if (!user || !firestore) {
      toast.error('You must create an account to place an order.', {
        action: {
          label: "Sign Up / Log In",
          onClick: () => router.push('/auth'),
        },
      });
      return;
    }

    // Check if user profile is complete
    const userDocRef = doc(firestore, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists() || !userDoc.data()?.username) {
        toast.error("Please complete your profile to place an order.", {
            description: "You'll be redirected to complete your profile.",
            action: {
                label: "Complete Profile",
                onClick: () => router.push('/auth/complete-profile'),
            }
        });
        router.push('/auth/complete-profile');
        return;
    }


    if (!playerId) {
      toast.error('Please enter your Player ID.');
      return;
    }
    if (!selectedPackageId) {
      toast.error('Please select a package.');
      return;
    }
    if (!paymentMethod) {
      toast.error('Please select a payment method.');
      return;
    }

    const selectedPackage = packages?.find(p => p.id === selectedPackageId);
    if (!selectedPackage) {
        toast.error('Selected package not found.');
        return;
    }

    setIsSubmitting(true);

    try {
        const ordersCollection = collection(firestore, 'topupOrders');
        await addDoc(ordersCollection, {
            userId: user.uid,
            userEmail: user.email,
            playerId,
            packageId: selectedPackage.id,
            packageName: selectedPackage.name,
            packagePrice: selectedPackage.price,
            paymentMethod,
            status: 'pending',
            createdAt: serverTimestamp(),
        });

        toast.success(
          `Your order for "${selectedPackage.name}" has been placed successfully! We will process it shortly.`
        );
        // Reset form
        setPlayerId('');
        setSelectedPackageId(null);
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
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 opacity-10">
        <Image
          src="/tp.png"
          alt="Free Fire Top-up Background"
          fill
          className="object-cover"
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-12 pt-24">
        {/* Page Header */}
        <div className="max-w-4xl mx-auto text-center space-y-6 mb-12">
          <div className="inline-block">
            <span className="px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-semibold border border-secondary/20">
              Game Top-up
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold">
            <span className="bg-gradient-accent bg-clip-text text-transparent">
              DARK DIAMOND STORE
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Instantly top-up your Free Fire diamonds. Enter your Player ID,
            select a package, and get your diamonds in seconds.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Top-up Form */}
          <div className="lg:col-span-2">
            <Card className="border-border/50 bg-card/70 backdrop-blur-sm shadow-strong">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gem className="text-primary" />
                  Create Your Order
                </CardTitle>
                <CardDescription>
                  Complete the steps below to place your top-up order.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Step 1: Player ID */}
                <div className="space-y-2">
                  <Label htmlFor="playerId" className="text-lg font-semibold">
                    Step 1: Enter Player ID
                  </Label>
                  <Input
                    id="playerId"
                    type="text"
                    placeholder="Enter your Free Fire Player ID"
                    value={playerId}
                    onChange={(e) => setPlayerId(e.target.value)}
                    className="h-12 text-lg"
                  />
                </div>

                {/* Step 2: Diamond Packages */}
                <div className="space-y-4">
                   <Label className="text-lg font-semibold">
                    Step 2: Choose a Package
                  </Label>
                  {isLoading && (
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
                     </div>
                  )}
                  {packagesError && <p className="text-destructive">Could not load packages. Please try again later.</p>}
                  {!isLoading && packages && (
                    <RadioGroup
                        value={selectedPackageId || ''}
                        onValueChange={setSelectedPackageId}
                        className="grid grid-cols-2 md:grid-cols-3 gap-4"
                    >
                        {packages.map((pkg) => (
                        <Card
                            key={pkg.id}
                            className={`cursor-pointer transition-all overflow-hidden ${
                            selectedPackageId === pkg.id
                                ? 'border-primary ring-2 ring-primary shadow-strong'
                                : 'border-border/50 hover:shadow-medium'
                            }`}
                            onClick={() => setSelectedPackageId(pkg.id)}
                        >
                            <CardContent className="p-0 text-center relative flex flex-col h-full">
                                <RadioGroupItem value={pkg.id} id={pkg.id} className="absolute top-2 right-2 z-10 bg-black/50 border-white/50" />
                                <div className="h-48 w-full flex items-center justify-center p-2 relative bg-black/10">
                                  {isValidUrl(pkg.imageUrl) ? (
                                      <Image src={pkg.imageUrl} alt={pkg.name} layout="fill" className="object-contain p-2" />
                                  ) : (
                                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                  )}
                                </div>
                                <div className="p-4 pt-2 space-y-1 flex-grow flex flex-col justify-between">
                                  <p className="text-base font-bold flex-grow">{pkg.name}</p>
                                  <p className="text-md text-primary font-semibold">
                                    LKR {pkg.price.toLocaleString()}
                                  </p>
                                </div>
                            </CardContent>
                        </Card>
                        ))}
                    </RadioGroup>
                  )}
                </div>

                {/* Step 3: Payment Method */}
                <div className="space-y-4">
                    <Label className="text-lg font-semibold">
                        Step 3: Select Payment Method
                    </Label>
                    {isLoading && <Skeleton className="h-24 w-full" />}
                    {!isLoading && (!paymentSettings || (!paymentSettings.onlinePaymentEnabled && !paymentSettings.bankTransferEnabled)) && (
                        <Alert variant="destructive">
                           <AlertTitle>No Payment Methods Available</AlertTitle>
                           <AlertDescription>The admin has not enabled any payment methods. Please check back later.</AlertDescription>
                        </Alert>
                    )}
                    {!isLoading && paymentSettings && (
                        <RadioGroup
                            value={paymentMethod || ''}
                            onValueChange={(val: 'online' | 'bank') => setPaymentMethod(val)}
                            className="grid grid-cols-1 gap-4"
                        >
                            {paymentSettings.onlinePaymentEnabled && (
                                <Card className={`cursor-pointer transition-all ${paymentMethod === 'online' ? 'border-primary ring-2 ring-primary' : 'hover:shadow-medium'}`} onClick={() => setPaymentMethod('online')}>
                                    <CardContent className="p-4 flex items-center gap-4">
                                        <CreditCard className="h-6 w-6 text-primary" />
                                        <div>
                                            <p className="font-semibold">Online Payment</p>
                                            <p className="text-sm text-muted-foreground">Pay securely with your card.</p>
                                        </div>
                                        <RadioGroupItem value="online" className="ml-auto" />
                                    </CardContent>
                                </Card>
                            )}
                            {paymentSettings.bankTransferEnabled && (
                                 <Card className={`cursor-pointer transition-all ${paymentMethod === 'bank' ? 'border-primary ring-2 ring-primary' : 'hover:shadow-medium'}`} onClick={() => setPaymentMethod('bank')}>
                                    <CardContent className="p-4 flex items-start gap-4">
                                        <Banknote className="h-6 w-6 text-primary mt-1" />
                                        <div className="flex-grow">
                                            <p className="font-semibold">Bank Transfer</p>
                                            <p className="text-sm text-muted-foreground">
                                                Manual bank deposit. It will take 10 minutes to 2 hours to fulfill. 24h service available.
                                            </p>
                                            <p className="text-sm text-destructive mt-2">
                                                Please note: Top-up delivery may occasionally be delayed due to game server issues or other technical problems. However, all orders are secure and will be processed as quickly as possible.
                                            </p>
                                        </div>
                                        <RadioGroupItem value="bank" className="ml-auto mt-1" />
                                    </CardContent>
                                </Card>
                            )}
                        </RadioGroup>
                    )}
                </div>
              </CardContent>
              <CardFooter>
                 <Button
                  size="lg"
                  className="w-full text-lg py-7"
                  variant="hero"
                  onClick={handlePlaceOrder}
                  disabled={!playerId || !selectedPackageId || !paymentMethod || isLoading || isSubmitting}
                >
                  {isSubmitting ? 'Placing Order...' : 'Top-up Now'}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Info Panel */}
          <div className="space-y-6 sticky top-24">
             <Card className="border-border/50 bg-card/70 backdrop-blur-sm shadow-strong">
                <CardHeader>
                    <CardTitle>Membership Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                    <p>Weekly/Monthly Memberships offer an abundance of instant and daily rewards.</p>
                    
                    <div className="space-y-2">
                        <p><strong className="text-foreground">Weekly Membership Lite:</strong> An affordable choice, valid for 7 days.</p>
                        <p><strong className="text-foreground">Weekly Rewards:</strong> Offers instant and daily rewards, valid for 7 days.</p>
                        <p><strong className="text-foreground">Monthly Membership:</strong> Offers instant and daily rewards, valid for 30 days.</p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-foreground">Membership Bonus Diamonds</h4>
                        <p>100 Bonus diamonds are provided when you subscribe for the first time. This offer is available only once for a specific membership purchase.</p>
                    </div>
                     <div>
                        <h4 className="font-semibold text-foreground">Daily Check-in</h4>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Daily rewards can be claimed every day within the validity of the subscription.</li>
                            <li>If you logged in but missed that day’s check-in reward, you can reclaim it within 7 days via your mail.</li>
                            <li>If you did not log in on a particular day, you can use Gold to make up for it and reclaim the check-in reward within 7 days.</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
            
            <Card className="border-border/50 bg-card/70 backdrop-blur-sm shadow-strong">
                <CardHeader>
                    <CardTitle>How to find your Player ID?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ol className="list-decimal list-inside text-muted-foreground space-y-2 text-sm">
                        <li>Open the Free Fire app on your device.</li>
                        <li>Go to your in-game profile page.</li>
                        <li>Your Player ID will be displayed below your username.</li>
                        <li>Copy the ID and paste it here.</li>
                    </ol>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                       <Image 
                         src="/hf.png"
                         alt="Free Fire Profile Example"
                         width={400}
                         height={225}
                         className="rounded-md object-cover"
                       />
                    </div>
                </CardContent>
            </Card>

             <Card className="border-border/50 bg-card/70 backdrop-blur-sm shadow-strong">
                <CardHeader>
                    <CardTitle>Why Choose Us?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0 shadow-medium">
                            <Zap className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                            <h4 className="font-semibold">Instant Delivery</h4>
                            <p className="text-sm text-muted-foreground">Diamonds are credited to your account within seconds.</p>
                        </div>
                   </div>
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0 shadow-medium">
                            <ShieldCheck className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                            <h4 className="font-semibold">Secure Payments</h4>
                            <p className="text-sm text-muted-foreground">Your transactions are safe and encrypted.</p>
                        </div>
                   </div>
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
