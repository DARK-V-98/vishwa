
'use client';

import { useState, useEffect } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
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
import { Gem, ShieldCheck, Zap, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface TopupPackage {
  id: string;
  name: string;
  price: number;
  category: 'Gems' | 'Membership' | 'Other';
  imageUrl?: string;
  order: number;
}


export default function FreefireTopupPage() {
  const firestore = useFirestore();
  const packagesCollection = useMemoFirebase(() => collection(firestore, 'topupPackages'), [firestore]);
  const packagesQuery = useMemoFirebase(() => query(packagesCollection, orderBy('order')), [packagesCollection]);
  const { data: packages, isLoading, error } = useCollection<Omit<TopupPackage, 'id'>>(packagesQuery);

  const [playerId, setPlayerId] = useState('');
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);

  const handleTopUp = () => {
    if (!playerId) {
      toast.error('Please enter your Player ID.');
      return;
    }
    if (!selectedPackageId) {
      toast.error('Please select a package.');
      return;
    }
    const pkg = packages?.find(p => p.id === selectedPackageId);
    toast.success(
      `Top-up successful! "${pkg?.name}" will be sent to Player ID: ${playerId}.`
    );
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
              Free Fire Top-up (SG)
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
                  Select Your Top-up
                </CardTitle>
                <CardDescription>
                  Choose a package and enter your Player ID.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Player ID Input */}
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

                {/* Diamond Packages */}
                <div className="space-y-4">
                   <Label className="text-lg font-semibold">
                    Step 2: Choose a Package
                  </Label>
                  {isLoading && (
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
                     </div>
                  )}
                  {error && <p className="text-destructive">Could not load packages. Please try again later.</p>}
                  {!isLoading && packages && (
                    <RadioGroup
                        value={selectedPackageId || ''}
                        onValueChange={setSelectedPackageId}
                        className="grid grid-cols-2 md:grid-cols-3 gap-4"
                    >
                        {packages.map((pkg) => (
                        <Card
                            key={pkg.id}
                            className={`cursor-pointer transition-all ${
                            selectedPackageId === pkg.id
                                ? 'border-primary ring-2 ring-primary shadow-strong'
                                : 'border-border/50 hover:shadow-medium'
                            }`}
                            onClick={() => setSelectedPackageId(pkg.id)}
                        >
                            <CardContent className="p-4 text-center space-y-2 relative">
                                <RadioGroupItem value={pkg.id} id={pkg.id} className="absolute top-2 right-2" />
                                <div className="mx-auto w-12 h-12 flex items-center justify-center mb-2">
                                  {pkg.category === 'Gems' ? (
                                      <Gem className="h-8 w-8 text-secondary" />
                                  ) : pkg.imageUrl ? (
                                      <Image src={pkg.imageUrl} alt={pkg.name} width={48} height={48} className="object-contain" />
                                  ) : (
                                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                  )}
                                </div>
                                <p className="text-lg font-bold">{pkg.name}</p>
                                <p className="text-md text-primary font-semibold">
                                LKR {pkg.price.toLocaleString()}
                                </p>
                            </CardContent>
                        </Card>
                        ))}
                    </RadioGroup>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                 <Button
                  size="lg"
                  className="w-full text-lg py-7"
                  variant="hero"
                  onClick={handleTopUp}
                  disabled={!playerId || !selectedPackageId || isLoading}
                >
                  <Zap className="mr-2" />
                  Top-up Now
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Info Panel */}
          <div className="space-y-6 sticky top-24">
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
                         src="https://picsum.photos/seed/ff-profile/400/225"
                         alt="Free Fire Profile Example"
                         width={400}
                         height={225}
                         className="rounded-md object-cover"
                         data-ai-hint="game profile screenshot"
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
