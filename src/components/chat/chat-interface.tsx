
'use client';

import { useState, useEffect, useRef } from 'react';
import { useFirestore, useCollection, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, addDoc, serverTimestamp, doc, setDoc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send } from 'lucide-react';
import { formatRelative } from 'date-fns';

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: { seconds: number };
}

interface ChatInterfaceProps {
  userId: string;
}

export default function ChatInterface({ userId }: ChatInterfaceProps) {
  const { user: currentUser } = useUser();
  const firestore = useFirestore();
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const messagesCollection = useMemoFirebase(() => collection(firestore, 'chats', userId, 'messages'), [firestore, userId]);
  const messagesQuery = useMemoFirebase(() => query(messagesCollection, orderBy('timestamp', 'asc')), [messagesCollection]);
  const { data: messages, isLoading } = useCollection<Omit<Message, 'id'>>(messagesQuery);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
        const scrollableView = scrollAreaRef.current.querySelector('div');
        if(scrollableView) {
            scrollableView.scrollTop = scrollableView.scrollHeight;
        }
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    const text = newMessage;
    setNewMessage('');

    const chatDocRef = doc(firestore, 'chats', userId);

    await addDoc(messagesCollection, {
      text: text,
      senderId: currentUser.uid,
      timestamp: serverTimestamp(),
    });

    // Update the parent chat doc for sorting and notifications
    await setDoc(chatDocRef, {
        userId: userId,
        userEmail: currentUser.email, // Assume the user is starting or replying to their own chat
        lastMessage: text,
        updatedAt: serverTimestamp(),
        isReadByAdmin: false,
    }, { merge: true });
  };
  
  const getInitials = (id: string) => id.substring(0, 2).toUpperCase();

  return (
    <div className="flex flex-col h-full w-full">
      <ScrollArea className="flex-grow pr-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {isLoading && <p>Loading messages...</p>}
          {messages?.map((msg, index) => {
            const isCurrentUser = msg.senderId === currentUser?.uid;
            const previousMessage = messages[index - 1];
            const showAvatar = !previousMessage || previousMessage.senderId !== msg.senderId;

            return (
              <div key={msg.id} className={`flex items-end gap-2.5 ${isCurrentUser ? 'justify-end' : ''}`}>
                {!isCurrentUser && (
                  <Avatar className={showAvatar ? 'visible' : 'invisible'}>
                    <AvatarFallback>{getInitials(msg.senderId)}</AvatarFallback>
                  </Avatar>
                )}
                <div className={`flex flex-col gap-1 max-w-xs`}>
                    <div className={`p-3 rounded-lg ${isCurrentUser ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none'}`}>
                        <p className="text-sm">{msg.text}</p>
                    </div>
                    {msg.timestamp && (
                        <span className={`text-xs text-muted-foreground ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                            {formatRelative(new Date(msg.timestamp.seconds * 1000), new Date())}
                        </span>
                    )}
                </div>
                 {isCurrentUser && (
                  <Avatar className={showAvatar ? 'visible' : 'invisible'}>
                     <AvatarFallback>{getInitials(currentUser?.displayName || currentUser?.email || 'Me')}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
      <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          autoComplete="off"
        />
        <Button type="submit" size="icon" disabled={!newMessage.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}

    