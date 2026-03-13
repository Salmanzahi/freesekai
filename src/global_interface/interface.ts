import { Timestamp } from 'firebase/firestore';


export interface Reply {
  id: string;
  createdAt: Timestamp | null;
  text: string;
  userId: string;
}// ─── Types ───────────────────────────────────────────────
export interface Post {
  id: string;
  body: string;
  createdAt: Timestamp;
  image: string | null;
  imageFile: File | null;
  showProfile: boolean;
  spotifyTrack: string;
  title: string;
  userId: string;
  like?: number;
}
export interface UserData {
  username: string;
  photoURL: string | null;
  createdAt: Timestamp;
}

