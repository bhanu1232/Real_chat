
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// User-provided Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6YFyaGGIIyZUa4zfsGbP90EhAbjgr4cQ",
  authDomain: "chat-4cff8.firebaseapp.com",
  databaseURL: "https://chat-4cff8-default-rtdb.firebaseio.com",
  projectId: "chat-4cff8",
  storageBucket: "chat-4cff8.appspot.com",
  messagingSenderId: "327642223817",
  appId: "1:327642223817:web:4cd7862f325e7f81632918",
  measurementId: "G-8PPKEYYKED"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const database = getDatabase(app);
export const googleProvider = new GoogleAuthProvider();