import React, { useState } from 'react';
import type { AppUser, ChatUser } from '../types';
import UserList from './UserList';
import ChatRoom from './ChatRoom';

interface MainChatViewProps {
  user: AppUser;
}

const MainChatView: React.FC<MainChatViewProps> = ({ user }) => {
  const [selectedChat, setSelectedChat] = useState<{ chatId: string; recipient: ChatUser } | null>(null);

  return (
    <div className="flex h-full w-full">
      <div className="w-1/3 min-w-[300px] max-w-[400px] border-r border-gray-200 bg-gray-50">
        <UserList 
          currentUser={user} 
          onSelectChat={setSelectedChat}
          selectedChatId={selectedChat?.chatId}
        />
      </div>
      <div className="flex-1">
        <ChatRoom user={user} chat={selectedChat} />
      </div>
    </div>
  );
};

export default MainChatView;
