import React, { useState, useEffect, useRef } from 'react';
import { database } from '../firebase/config';
import { ref, query, orderByChild, onValue, push, serverTimestamp, limitToLast, runTransaction } from 'firebase/database';
import type { AppUser, Message, ChatUser } from '../types';
import ChatMessage from './ChatMessage';

interface ChatRoomProps {
  user: AppUser;
  chat: { chatId: string; recipient: ChatUser } | null;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ user, chat }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [formValue, setFormValue] = useState('');
  const dummy = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!chat) {
      setMessages([]);
      return;
    };

    const messagesRef = ref(database, `messages/${chat.chatId}`);
    const q = query(messagesRef, orderByChild('createdAt'), limitToLast(100));

    const unsubscribe = onValue(q, (snapshot) => {
      const messagesData: Message[] = [];
      snapshot.forEach((childSnapshot) => {
        messagesData.push({ id: childSnapshot.key!, ...childSnapshot.val() } as Message);
      });
      setMessages(messagesData);
    }, (error) => {
      console.error(`Error fetching messages for chat ${chat.chatId}:`, error);
    });

    return () => unsubscribe();
  }, [chat]);

  useEffect(() => {
    dummy.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formValue.trim() === '' || !chat) return;

    const { uid, displayName, photoURL } = user;
    const messagesRef = ref(database, `messages/${chat.chatId}`);

    try {
      await push(messagesRef, {
        text: formValue,
        createdAt: serverTimestamp(),
        uid,
        displayName,
        photoURL
      });
      
      // Increment unread count for the recipient
      const unreadRef = ref(database, `unreadCounts/${chat.recipient.uid}/${chat.chatId}`);
      runTransaction(unreadRef, (currentCount) => {
        return (currentCount || 0) + 1;
      });

      setFormValue('');
    } catch (error)
 {
      console.error("Error sending message:", error);
    }
  };

  if (!chat) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-gray-50 text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <h2 className="text-2xl font-semibold">Select a chat</h2>
        <p>Start a conversation with anyone from the list.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <header className="flex items-center p-4 bg-gray-50 border-b border-gray-200">
        <img src={chat.recipient.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${chat.recipient.uid}`} alt={chat.recipient.displayName || 'User'} className="w-8 h-8 rounded-full mr-3" />
        <h1 className="text-xl font-semibold text-gray-700">{chat.recipient.displayName || 'Anonymous User'}</h1>
      </header>
      
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map(msg => <ChatMessage key={msg.id} message={msg} currentUser={user} />)}
        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage} className="flex items-center p-4 bg-white border-t border-gray-200">
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none"
          aria-label="Chat message input"
        />
        <button 
          type="submit" 
          disabled={!formValue.trim()} 
          className="p-2 rounded-full text-sky-500 disabled:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400"
          aria-label="Send message"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;