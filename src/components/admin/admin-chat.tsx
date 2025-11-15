'use client';

import { useState } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import ChatInterface from '@/components/chat/chat-interface';

interface Chat {
  id: string;
  userEmail: string;
  lastMessage: string;
  updatedAt: { seconds: number };
  isReadByAdmin: boolean;
}

export default function AdminChat() {
  const firestore = useFirestore();
  const [selectedChatUserId, setSelectedChatUserId] = useState<string | null>(null);

  const chatsQuery = useMemoFirebase(() => {
    // This query will only be created if firestore is available.
    // The useCollection hook will handle the null case and wait.
    if (!firestore) return null;
    const chatsCollection = collection(firestore, 'chats');
    return query(chatsCollection, orderBy('updatedAt', 'desc'));
  }, [firestore]);

  // The hook will now only run the query if `chatsQuery` is not null.
  // Security rules on the backend will ensure only admins can actually get the data.
  const { data: chats, isLoading: chatsLoading, error: chatsError } = useCollection<Omit<Chat, 'id'>>(chatsQuery);
  
  const getInitials = (email: string) => email ? email.substring(0, 2).toUpperCase() : '??';
  
  const handleSelectChat = async (userId: string) => {
    if (!firestore) return;
    setSelectedChatUserId(userId);
    const chatDocRef = doc(firestore, 'chats', userId);
    try {
      await updateDoc(chatDocRef, { isReadByAdmin: true });
    } catch (e) {
      console.warn("Could not mark chat as read:", e);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle>Customer Chats</CardTitle>
        <CardDescription>
          Select a chat from the sidebar to view the conversation and respond.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow grid md:grid-cols-3 gap-6 overflow-hidden">
        {/* Chat List */}
        <div className="md:col-span-1 border-r pr-4 flex flex-col h-full">
          <h3 className="text-lg font-semibold mb-4 flex-shrink-0">Conversations</h3>
          {chatsLoading && (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          )}
          {chatsError && <p className="text-destructive text-sm">Failed to load chats. Ensure you have admin permissions.</p>}
          <ScrollArea className="flex-grow -mr-4 pr-4">
            <div className="space-y-2">
              {chats?.map(chat => (
                <button
                  key={chat.id}
                  onClick={() => handleSelectChat(chat.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${selectedChatUserId === chat.id ? 'bg-muted' : 'hover:bg-muted/50'}`}
                >
                  <div className="flex items-center gap-3">
                      <Avatar>
                          <AvatarFallback>{getInitials(chat.userEmail)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-grow truncate">
                          <p className="font-semibold truncate">{chat.userEmail}</p>
                          <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                      </div>
                      {!chat.isReadByAdmin && <Badge variant="destructive" className="animate-pulse">New</Badge>}
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Window */}
        <div className="md:col-span-2 flex flex-col h-full overflow-hidden">
          {selectedChatUserId ? (
            <ChatInterface userId={selectedChatUserId} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center bg-muted rounded-lg">
              <p className="text-lg font-semibold">Select a conversation</p>
              <p className="text-sm text-muted-foreground">Choose a chat from the left to start messaging.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
