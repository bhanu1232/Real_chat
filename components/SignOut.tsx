
import React from 'react';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';

const SignOut: React.FC = () => {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return auth.currentUser && (
    <button
      onClick={handleSignOut}
      className="px-4 py-2 text-sm text-gray-600 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
    >
      Sign Out
    </button>
  );
};

export default SignOut;