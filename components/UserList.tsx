import React, { useState, useEffect } from 'react';
import { database } from '../firebase/config';
import { ref, onValue, set, serverTimestamp } from 'firebase/database';
import type { AppUser, ChatUser } from '../types';
import SignOut from './SignOut';

interface UserListProps {
  currentUser: AppUser;
  onSelectChat: (chat: { chatId: string; recipient: ChatUser }) => void;
  selectedChatId: string | undefined;
}

const UserList: React.FC<UserListProps> = ({ currentUser, onSelectChat, selectedChatId }) => {
  const [allUsers, setAllUsers] = useState<ChatUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [unreadCounts, setUnreadCounts] = useState<{ [chatId: string]: number }>({});

  // Fetch all users and listen for updates
  useEffect(() => {
    const usersRef = ref(database, 'users');
    const unsubscribe = onValue(
      usersRef, 
      (snapshot) => {
        const usersData: ChatUser[] = [];
        const usersVal = snapshot.val();
        if (usersVal) {
          Object.values(usersVal).forEach((user) => {
            const typedUser = user as ChatUser;
            if (typedUser.uid && typedUser.uid !== currentUser.uid) {
                usersData.push(typedUser);
            }
          });
        }
        setAllUsers(usersData);
        setLoading(false);
      },
      (error) => {
        console.error("Firebase Read Error: Failed to fetch users.", error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [currentUser.uid]);

  // Listen for unread message counts
  useEffect(() => {
    const countsRef = ref(database, `unreadCounts/${currentUser.uid}`);
    const unsubscribe = onValue(countsRef, (snapshot) => {
      setUnreadCounts(snapshot.val() || {});
    });
    return () => unsubscribe();
  }, [currentUser.uid]);


  // Handle selecting a user to chat with
  const handleSelectUser = async (user: ChatUser) => {
    const chatId = [currentUser.uid, user.uid].sort().join('_');
    const members = { [currentUser.uid]: true, [user.uid]: true };
    
    // Reset unread count for this chat
    const unreadRef = ref(database, `unreadCounts/${currentUser.uid}/${chatId}`);
    set(unreadRef, null); // Set to null to remove it

    const chatRef = ref(database, `chats/${chatId}`);
    try {
      await set(chatRef, {
        members: members,
        lastActivity: serverTimestamp(),
      });
      onSelectChat({ chatId: chatId, recipient: user });
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  const filteredUsers = allUsers.filter(user =>
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <header className="flex justify-between items-center p-4 border-b border-gray-200">
         <div className="flex items-center">
            <img 
                src={currentUser.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${currentUser.uid}`} 
                alt={currentUser.displayName || 'Current User'} 
                className="w-10 h-10 rounded-full" 
            />
            <span className="ml-3 font-semibold text-gray-800">{currentUser.displayName}</span>
        </div>
        <SignOut />
      </header>

      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search for a user..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
          aria-label="Search users"
        />
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <svg className="animate-spin h-6 w-6 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : filteredUsers.length > 0 ? (
          <ul>
            {filteredUsers.map(user => {
              const chatId = [currentUser.uid, user.uid].sort().join('_');
              const isSelected = selectedChatId === chatId;
              const unreadCount = unreadCounts[chatId];
              return (
                <li 
                  key={user.uid} 
                  onClick={() => handleSelectUser(user)}
                  className={`flex items-center p-4 cursor-pointer transition-colors ${
                    isSelected ? 'bg-sky-100' : 'hover:bg-gray-200'
                  }`}
                  aria-selected={isSelected}
                >
                  <img src={user.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${user.uid}`} alt={user.displayName || 'User'} className="w-10 h-10 rounded-full" />
                  <span className="ml-4 text-gray-800 font-medium">{user.displayName || 'Anonymous User'}</span>
                  {unreadCount > 0 && (
                    <span className="ml-auto bg-sky-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="text-center text-gray-500 p-8">
            <p>{searchTerm ? 'No users match your search.' : 'No other users found.'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;