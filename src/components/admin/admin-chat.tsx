
'use client';

import { useState, useEffect } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc, updateDoc, getDoc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import ChatInterface from '@/components/chat/chat-interface';
import { cn } from '@/lib/utils';
import { MessageSquare } from 'lucide-react';

interface Chat {
  id: string; // This is the userId
  userEmail: string;
  userName?: string; // Optional: will be fetched
  lastMessage: string;
  updatedAt: { seconds: number };
  isReadByAdmin: boolean;
}

const ConversationItem = ({ chat, onSelect, isSelected }: { chat: Chat, onSelect: (userId: string) => void, isSelected: boolean }) => {
    const firestore = useFirestore();
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserName = async () => {
            if (!firestore) return;
            const userDocRef = doc(firestore, 'users', chat.id);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const name = `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
                setUserName(name || chat.userEmail);
            } else {
                setUserName(chat.userEmail);
            }
        };
        fetchUserName();
    }, [firestore, chat.id, chat.userEmail]);

    const getInitials = (name: string | null) => {
        if (!name) return '??';
        const parts = name.split(' ');
        if (parts.length > 1) {
            return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    return (
        <button
            onClick={() => onSelect(chat.id)}
            className={cn(
                "w-full text-left p-3 rounded-lg transition-colors",
                isSelected ? 'bg-muted' : 'hover:bg-muted/50'
            )}
        >
            <div className="flex items-center gap-3">
                <Avatar className="border">
                    <AvatarFallback>{getInitials(userName)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow truncate">
                    <div className="font-semibold truncate">
                        {userName ? userName : <Skeleton className="h-5 w-32"/>}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                </div>
                {!chat.isReadByAdmin && <Badge variant="destructive" className="animate-pulse">New</Badge>}
            </div>
        </button>
    );
};


export default function AdminChat() {
  const firestore = useFirestore();
  const [selectedChatUserId, setSelectedChatUserId] = useState<string | null>(null);

  const chatsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    const chatsCollection = collection(firestore, 'chats');
    return query(chatsCollection, orderBy('updatedAt', 'desc'));
  }, [firestore]);

  const { data: chats, isLoading: chatsLoading, error: chatsError } = useCollection<Omit<Chat, 'id'>>(chatsQuery);
  
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
    <Card className="h-full flex flex-col shadow-strong">
      <CardHeader className="flex-shrink-0">
        <CardTitle>Customer Chats</CardTitle>
        <CardDescription>
          Select a chat from the sidebar to view the conversation and respond.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow grid md:grid-cols-3 gap-6 overflow-hidden">
        {/* Chat List */}
        <div className={cn(
          "md:col-span-1 border-r pr-4 flex flex-col h-full transition-transform duration-300 ease-in-out",
          selectedChatUserId ? "hidden md:flex" : "flex"
        )}>
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
                <ConversationItem 
                    key={chat.id}
                    chat={chat}
                    onSelect={handleSelectChat}
                    isSelected={selectedChatUserId === chat.id}
                />
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Window */}
        <div className={cn(
          "md:col-span-2 flex flex-col h-full overflow-hidden transition-transform duration-300 ease-in-out",
          selectedChatUserId ? "flex" : "hidden md:flex"
        )}>
          {selectedChatUserId ? (
            <ChatInterface userId={selectedChatUserId} onBack={() => setSelectedChatUserId(null)} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center bg-muted rounded-lg">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4"/>
              <p className="text-lg font-semibold">Select a conversation</p>
              <p className="text-sm text-muted-foreground">Choose a chat from the left to start messaging.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
