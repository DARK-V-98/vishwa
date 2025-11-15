
'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import ChatInterface from '@/components/chat/chat-interface';

export default function MessagesPage() {
    const { user, isUserLoading } = useUser();
    const router = useRouter();

    if (isUserLoading) {
        return (
            <div className="container py-12 pt-24">
                <Skeleton className="h-8 w-1/4 mb-4" />
                <Skeleton className="h-4 w-1/2 mb-8" />
                <Card><CardContent className="p-6"><Skeleton className="h-96 w-full" /></CardContent></Card>
            </div>
        );
    }
    
    if (!user) {
        router.push('/auth');
        return null;
    }

    return (
        <div className="container py-12 pt-24 flex flex-col" style={{ height: 'calc(100vh - 4rem)'}}>
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Messages</h1>
                <p className="text-muted-foreground">Chat directly with our support team.</p>
            </div>

            <Card className="flex-grow flex flex-col">
                <CardHeader>
                    <CardTitle>Admin Chat</CardTitle>
                    <CardDescription>Ask questions about your orders or our services.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                    <ChatInterface userId={user.uid} />
                </CardContent>
            </Card>
        </div>
    );
}
