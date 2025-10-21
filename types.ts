
import type { User as FirebaseUser } from "firebase/auth";

export interface AppUser extends FirebaseUser {}

export interface ChatUser {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
}

export interface Message {
  id: string;
  text: string;
  createdAt: number;
  uid: string;
  displayName: string;
  photoURL: string | null;
}