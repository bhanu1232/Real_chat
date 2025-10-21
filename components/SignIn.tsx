
import React from 'react';
import { auth, googleProvider, database } from '../firebase/config';
import { signInWithPopup } from 'firebase/auth';
import { ref, set } from 'firebase/database';

const SignIn: React.FC = () => {
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Create or update user data in Realtime Database
      const userRef = ref(database, 'users/' + user.uid);
      await set(userRef, {
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });

    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome</h1>
        <p className="text-gray-500 mb-8">Sign in with Google to start chatting.</p>
        <button
          onClick={signInWithGoogle}
          className="flex items-center justify-center px-6 py-3 bg-white text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors border border-gray-300 shadow-sm"
        >
          <svg className="w-5 h-5 mr-3" xmlns="http://www.w.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,34.556,44,29.865,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default SignIn;