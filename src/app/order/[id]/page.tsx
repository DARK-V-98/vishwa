
'use client';

import { Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, getDoc, updateDoc, setDoc, serverTimestamp, collection, where, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, Loader2, Frown, CheckCircle, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import type { WebOrder, WebOrderDetail } from '@/lib/types';
import OrderDetailForm from '@/components/forms/OrderDetailForm';

function OrderClaimPage() {
    const { id } = useParams();
    const orderId = Array.isArray(id) ? id[0] : id;
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const router = useRouter();

    const [order, setOrder] = useState<WebOrder | null>(null);
    const [orderDetail, setOrderDetail] = useState<WebOrderDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isBinding, setIsBinding] = useState(false);
    const [isBound, setIsBound] = useState(false);
    
    useEffect(() => {
        if (isUserLoading || !firestore) return;

        if (!user) {
            // User not logged in, stop loading and show login prompt.
            setIsLoading(false);
            return;
        }

        const fetchAndBindOrder = async () => {
            setIsLoading(true);
            
            const orderDocRef = doc(firestore, 'webOrders', orderId);
            const orderDocSnap = await getDoc(orderDocRef);

            if (!orderDocSnap.exists()) {
                setError("This order ID is invalid or has expired.");
                setIsLoading(false);
                return;
            }

            const orderData = { ...orderDocSnap.data(), docId: orderDocSnap.id } as WebOrder;

            // Check if another user has already claimed this order.
            if (orderData.userId && orderData.userId !== user.uid) {
                setError("This order has already been claimed by another user.");
                setIsLoading(false);
                return;
            }
            
            setOrder(orderData);

            // Fetch existing details if they exist
            const detailDocRef = doc(firestore, 'webOrders', orderId, 'details', 'client');
            const detailDocSnap = await getDoc(detailDocRef);
            if (detailDocSnap.exists()) {
                setOrderDetail(detailDocSnap.data() as WebOrderDetail);
            }

            // If order isn't bound to anyone, bind it to the current user.
            if (!orderData.userId) {
                setIsBinding(true);
                try {
                    await updateDoc(orderDocRef, { 
                        userId: user.uid,
                        status: 'Pending Client Details',
                        updatedAt: serverTimestamp(),
                     });
                    setOrder(prev => prev ? { ...prev, userId: user.uid, status: 'Pending Client Details' } : null);
                    setIsBound(true); // Show success message
                } catch (e: any) {
                    setError("Failed to link the order to your account. Please contact support.");
                } finally {
                    setIsBinding(false);
                }
            } else {
                 setIsBound(true); // Already bound, just proceed
            }

            setIsLoading(false);
        };
        
        fetchAndBindOrder();

    }, [user, isUserLoading, firestore, orderId, router]);
    
    if (isLoading || isBinding) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center px-4">
                 <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
                 <h2 className="text-2xl font-semibold mb-2">
                    {isBinding ? 'Linking Order to Your Account...' : 'Loading Your Order...'}
                 </h2>
                 <p className="text-muted-foreground">Please wait a moment.</p>
            </div>
        );
    }
    
     if (!user) {
        return (
            <div className="container py-12 pt-24 max-w-lg mx-auto">
                 <Card>
                    <CardHeader className="text-center">
                        <LogIn className="mx-auto h-12 w-12 text-primary" />
                        <CardTitle>Authentication Required</CardTitle>
                        <CardDescription>Please sign in to view and claim your order.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" onClick={() => router.push(`/auth?redirect=/order/${orderId}`)}>
                            Sign In or Register
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (error) {
        return (
             <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center px-4">
                <Frown className="w-16 h-16 text-destructive mb-4" />
                <h2 className="text-2xl font-semibold mb-2">An Error Occurred</h2>
                <p className="text-muted-foreground max-w-sm mb-6">{error}</p>
                 <Button onClick={() => router.push('/')}>Return to Homepage</Button>
            </div>
        )
    }
    
    if (isBound && !orderDetail) {
        return (
            <div className="container py-12 pt-24 max-w-2xl mx-auto animate-in fade-in-50">
                <Card className="text-center shadow-strong">
                    <CardHeader>
                        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                        <CardTitle className="text-2xl">Order Linked Successfully!</CardTitle>
                        <CardDescription>Your Order ID <strong>#{orderId}</strong> is now linked to your account.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Please proceed to the next step to provide your project details.</p>
                    </CardContent>
                    <CardFooter>
                         <Button className="w-full" onClick={() => setIsBound(false)}>
                            Fill Out Project Details <ArrowRight className="ml-2 h-4 w-4"/>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }
    
    if (order && orderDetail) {
         return (
             <div className="container py-12 pt-24 max-w-2xl mx-auto">
                 <Card className="text-center shadow-strong">
                    <CardHeader>
                        <CheckCircle className="mx-auto h-12 w-12 text-primary" />
                        <CardTitle className="text-2xl">Details Submitted</CardTitle>
                        <CardDescription>You have already submitted the details for order <strong>#{orderId}</strong>.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">You can now track the progress of your project from your dashboard.</p>
                    </CardContent>
                    <CardFooter>
                         <Button className="w-full" asChild>
                            <Link href="/dashboard/my-websites">
                                Go to My Websites <ArrowRight className="ml-2 h-4 w-4"/>
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
         )
    }
    
    if (order) {
        return (
            <div className="container py-12 pt-24 max-w-4xl mx-auto animate-in fade-in-50">
                <OrderDetailForm order={order} />
            </div>
        )
    }
    
    return null; // Should not be reached
}

export default function OrderPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OrderClaimPage />
        </Suspense>
    );
}

