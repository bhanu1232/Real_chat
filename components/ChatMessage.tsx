import React from 'react';
import type { AppUser, Message } from '../types';

interface ChatMessageProps {
  message: Message;
  currentUser: AppUser;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, currentUser }) => {
  const { text, uid, displayName } = message;
  const messageIsSent = uid === currentUser.uid;

  const formattedName = displayName || 'Anonymous';

  if (messageIsSent) {
    return (
      <div className="flex justify-end">
        <div className="max-w-xs lg:max-w-md px-4 py-2 bg-sky-500 text-white rounded-t-2xl rounded-bl-2xl shadow">
          <p className="break-words">{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2">
      <div className="flex flex-col">
        <span className="text-xs text-gray-500 mb-1 ml-1">{formattedName}</span>
        <div className="max-w-xs lg:max-w-md px-4 py-2 bg-gray-200 text-gray-800 rounded-t-2xl rounded-br-2xl shadow">
          <p className="break-words">{text}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;