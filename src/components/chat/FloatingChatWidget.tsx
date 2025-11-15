
'use client';

import { useState } from 'react';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MessageSquare, LogIn } from 'lucide-react';
import ChatInterface from './chat-interface';
import { useRouter } from 'next/navigation';
import { Skeleton } from '../ui/skeleton';

export default function FloatingChatWidget() {
  const { user, isUserLoading } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLoginRedirect = () => {
    setIsOpen(false);
    router.push('/auth');
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="hero"
          size="lg"
          className="fixed bottom-6 right-6 rounded-full w-16 h-16 shadow-strong z-50 animate-in fade-in zoom-in-50"
        >
          <MessageSquare className="h-8 w-8" />
          <span className="sr-only">Open Chat</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md h-[80vh] max-h-[600px] flex flex-col p-0">
        <DialogHeader className="p-6 pb-2 border-b">
          <DialogTitle>Admin Chat</DialogTitle>
          <DialogDescription>
            Have a question? Chat directly with our support team.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-auto">
            {isUserLoading ? (
                 <div className="p-6 space-y-4">
                    <Skeleton className="h-10 w-2/3" />
                    <Skeleton className="h-10 w-1/2 ml-auto" />
                    <Skeleton className="h-10 w-3/4" />
                </div>
            ) : user ? (
                <ChatInterface userId={user.uid} />
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <p className="mb-4 text-muted-foreground">Please log in to start a conversation.</p>
                    <Button onClick={handleLoginRedirect}>
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign In or Register
                    </Button>
                </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
