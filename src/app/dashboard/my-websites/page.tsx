
'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Briefcase, Eye, GitBranch, Server, TestTube, CheckCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { WebOrder } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const stageIcons = {
    Designing: <GitBranch className="h-4 w-4 mr-2"/>,
    Developing: <Server className="h-4 w-4 mr-2"/>,
    Testing: <TestTube className="h-4 w-4 mr-2"/>,
    Completed: <CheckCircle className="h-4 w-4 mr-2"/>,
};

export default function MyWebsitesPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const router = useRouter();

    const ordersQuery = useMemoFirebase(() => {
        if (!user) return null;
        return query(collection(firestore, 'webOrders'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
    }, [firestore, user]);

    const { data: orders, isLoading: ordersLoading, error } = useCollection<WebOrder>(ordersQuery);
    
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

    return (
        <div className="container py-12 pt-24">
            <h1 className="text-4xl font-bold mb-2">My Website Projects</h1>
            <p className="text-muted-foreground mb-8">A list of all your ongoing and completed website projects.</p>

            <Card>
                <CardHeader>
                    <CardTitle>Your Projects</CardTitle>
                    <CardDescription>Track the progress and details of your website orders here.</CardDescription>
                </CardHeader>
                <CardContent>
                    {ordersLoading && <div className="space-y-2">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div>}
                    {error && <p className="text-destructive">Error loading your projects. Please try again later.</p>}
                    {!ordersLoading && orders && orders.length === 0 && (
                         <div className="text-center py-16">
                            <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-semibold">No Website Projects Found</h3>
                            <p className="mt-1 text-sm text-muted-foreground">You haven't been assigned any website projects yet.</p>
                            <Button asChild className="mt-4">
                                <Link href="/contact">Contact Us to Start</Link>
                            </Button>
                        </div>
                    )}
                    {!ordersLoading && orders && orders.length > 0 && (
                        <Accordion type="single" collapsible className="w-full">
                            {orders.map((order) => (
                                <AccordionItem value={order.id} key={order.id}>
                                    <AccordionTrigger>
                                        <div className="flex justify-between items-center w-full pr-4">
                                            <div className="text-left">
                                                <p className="font-semibold text-lg">{order.websiteType} Website</p>
                                                <p className="text-sm text-muted-foreground">Order ID: #{order.id}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                 <Badge variant={order.status === 'Completed' ? 'default' : 'secondary'} className="capitalize">{order.status}</Badge>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="p-4 bg-muted/50 rounded-md space-y-4">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-semibold flex items-center">
                                                        {stageIcons[order.currentStage]}
                                                        Current Stage: {order.currentStage}
                                                    </p>
                                                     <p className="text-sm text-muted-foreground">
                                                        Total Cost: LKR {order.totalCost.toLocaleString()}
                                                     </p>
                                                </div>
                                                 <Button asChild variant="outline" size="sm">
                                                    <Link href={`/track-order?id=${order.id}`} target="_blank">
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Public Tracking Page
                                                    </Link>
                                                </Button>
                                            </div>
                                            {order.monthlyAmount && (
                                                 <p className="text-sm font-semibold text-primary">
                                                    Payment Plan: LKR {order.monthlyAmount.toLocaleString()}/month for {order.monthsAllowed} months
                                                 </p>
                                            )}
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
