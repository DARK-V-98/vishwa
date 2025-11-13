
'use client';

import { useState, useEffect, useRef } from 'react';
import { useFirestore, useCollection, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, addDoc, serverTimestamp, doc, setDoc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, MessageSquarePlus, Robot } from 'lucide-react';
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
    if (scrollAreaRef.current) {
        const scrollableView = scrollAreaRef.current.querySelector('div');
        if(scrollableView) {
            scrollableView.scrollTop = scrollableView.scrollHeight;
        }
    }
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || !currentUser) return;

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
        userEmail: isAdminView ? messages?.find(m => m.senderId !== currentUser.uid)?.senderId || 'User' : currentUser.email,
        lastMessage: text,
        updatedAt: serverTimestamp(),
        isReadByAdmin: isAdminView,
    }, { merge: true });
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(newMessage);
  };
  
  const getInitials = (id: string) => id.substring(0, 2).toUpperCase();
  const isAdminMessage = (senderId: string) => senderId === 'H2y0nKq3esS3dY3NcdiVymL9XQ23';

  const suggestionMessages = isAdminView
  ? ["What is your name?", "What is your contact number?"]
  : ["Hello, my name is "];


  return (
    <div className="flex flex-col h-full w-full">
      <ScrollArea className="flex-grow pr-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {isLoading && <p>Loading messages...</p>}
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
            const isSenderAdmin = isAdminMessage(msg.senderId);

            return (
              <div key={msg.id} className={`flex items-end gap-2.5 ${isCurrentUserMsg ? 'justify-end' : ''}`}>
                {!isCurrentUserMsg && (
                  <Avatar className={`${showAvatar ? 'visible' : 'invisible'} border`}>
                    {isSenderAdmin ? (
                      <div className="flex items-center justify-center h-full w-full bg-muted">
                        <Robot className="h-6 w-6 text-foreground" />
                      </div>
                    ) : (
                      <AvatarFallback>{getInitials(msg.senderId)}</AvatarFallback>
                    )}
                  </Avatar>
                )}
                <div className={`flex flex-col gap-1 max-w-xs`}>
                    <div className={`p-3 rounded-lg ${isCurrentUserMsg ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none'}`}>
                        <p className="text-sm">{msg.text}</p>
                    </div>
                    {msg.timestamp && (
                        <span className={`text-xs text-muted-foreground ${isCurrentUserMsg ? 'text-right' : 'text-left'}`}>
                            {formatRelative(new Date(msg.timestamp.seconds * 1000), new Date())}
                        </span>
                    )}
                </div>
                 {isCurrentUserMsg && (
                  <Avatar className={`${showAvatar ? 'visible' : 'invisible'} border`}>
                     {isSenderAdmin ? (
                      <div className="flex items-center justify-center h-full w-full bg-muted">
                        <Robot className="h-6 w-6 text-foreground" />
                      </div>
                    ) : (
                      <AvatarFallback>{getInitials(currentUser?.displayName || currentUser?.email || 'Me')}</AvatarFallback>
                    )}
                  </Avatar>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
      {messages && messages.length === 0 && !isLoading && (
        <div className="py-2 flex flex-wrap gap-2">
            {suggestionMessages.map(text => (
                <Button key={text} variant="outline" size="sm" onClick={() => sendMessage(text)}>
                    {text}
                </Button>
            ))}
        </div>
      )}
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
