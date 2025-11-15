
'use client';

import { useState, useEffect, useRef } from 'react';
import { useFirestore, useCollection, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, MessageSquarePlus, BrainCircuit } from 'lucide-react';
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
  
  const isAdminView = currentUser?.email === 'tikfese@gmail.com';

  const messagesCollection = useMemoFirebase(() => collection(firestore, 'chats', userId, 'messages'), [firestore, userId]);
  const messagesQuery = useMemoFirebase(() => query(messagesCollection, orderBy('timestamp', 'asc')), [messagesCollection]);
  const { data: messages, isLoading } = useCollection<Omit<Message, 'id'>>(messagesQuery);

  // Auto-scroll to bottom
  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
    if (viewport) {
      setTimeout(() => {
        viewport.scrollTop = viewport.scrollHeight;
      }, 100);
    }
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || !currentUser) return;

    const textToSend = text;
    setNewMessage('');

    const chatDocRef = doc(firestore, 'chats', userId);

    await addDoc(messagesCollection, {
      text: textToSend,
      senderId: currentUser.uid,
      timestamp: serverTimestamp(),
    });
    
    const updateData: any = {
        lastMessage: textToSend,
        updatedAt: serverTimestamp(),
    };

    if (isAdminView) {
        updateData.isReadByAdmin = true;
    } else {
        updateData.isReadByAdmin = false;
        if (currentUser.email) {
          updateData.userEmail = currentUser.email;
          updateData.userId = currentUser.uid;
        }
    }
    
    await setDoc(chatDocRef, updateData, { merge: true });
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(newMessage);
  };
  
  const getInitials = (id: string) => (id || 'U').substring(0, 2).toUpperCase();
  
  // This is a placeholder for admin identification. A robust solution would use custom claims.
  const isSenderAdmin = (senderId: string) => senderId === 'gS5p2W02a2PSZ8J3a3aRLe3HxyE3';

  const suggestionMessages = isAdminView
  ? ["Can you please provide your order ID?", "How can I assist you today?"]
  : ["Hello, I have a question about my order.", "I need help with a payment."];

  return (
    <div className="flex flex-col h-full w-full bg-background rounded-b-lg">
      <ScrollArea className="flex-grow pr-4 -mr-4" ref={scrollAreaRef}>
        <div className="space-y-4 p-4">
          {isLoading && <p className="text-center text-muted-foreground">Loading messages...</p>}
          {messages && messages.length === 0 && !isLoading && (
             <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                <MessageSquarePlus className="h-10 w-10 mb-4" />
                <p className="font-semibold text-lg">Start the conversation</p>
                <p className="text-sm">No messages here yet. Send a message or use a suggestion below.</p>
             </div>
          )}
          {messages?.map((msg, index) => {
            const isCurrentUserMsg = msg.senderId === currentUser?.uid;
            const previousMessage = messages[index - 1];
            const showAvatar = !previousMessage || previousMessage.senderId !== msg.senderId;

            return (
              <div key={msg.id} className={`flex items-end gap-2.5 ${isCurrentUserMsg ? 'justify-end' : ''}`}>
                {!isCurrentUserMsg && (
                  <Avatar className={`${showAvatar ? 'visible' : 'invisible'} border`}>
                    {isSenderAdmin(msg.senderId) ? (
                      <div className="flex items-center justify-center h-full w-full bg-muted">
                        <BrainCircuit className="h-6 w-6 text-foreground" />
                      </div>
                    ) : (
                      <AvatarFallback>{getInitials(userId)}</AvatarFallback>
                    )}
                  </Avatar>
                )}
                <div className={`flex flex-col gap-1 max-w-[70%]`}>
                    <div className={`p-3 rounded-lg ${isCurrentUserMsg ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none'}`}>
                        <p className="text-sm">{msg.text}</p>
                    </div>
                    {msg.timestamp && (
                        <span className={`text-xs text-muted-foreground px-1 ${isCurrentUserMsg ? 'text-right' : 'text-left'}`}>
                            {formatRelative(new Date(msg.timestamp.seconds * 1000), new Date())}
                        </span>
                    )}
                </div>
                 {isCurrentUserMsg && (
                  <Avatar className={`${showAvatar ? 'visible' : 'invisible'} border`}>
                    <AvatarFallback>{getInitials(currentUser?.displayName || currentUser?.email || 'Me')}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
      <div className="flex-shrink-0 p-4 border-t">
        {!isLoading && (
          <div className="pb-2 flex flex-wrap gap-2">
              {suggestionMessages.map(text => (
                  <Button key={text} variant="outline" size="sm" onClick={() => sendMessage(text)}>
                      {text}
                  </Button>
              ))}
          </div>
        )}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            autoComplete="off"
            disabled={!currentUser}
          />
          <Button type="submit" size="icon" disabled={!newMessage.trim() || !currentUser}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
