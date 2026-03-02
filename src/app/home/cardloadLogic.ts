


import { firedb } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, Timestamp, deleteDoc, doc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { isAuth } from '@/lib/isauth';
import { isAdmin } from '@/lib/isAdmin';
import { getUserByUid, type UserData } from '@/lib/userProperties';
import { supabase } from "@/lib/supabase";
// ─── Types ───────────────────────────────────────────────
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

export interface Reply {
  id: string;
  createdAt: Timestamp | null;
  text: string;
  userId: string;
}

// ─── Hooks ───────────────────────────────────────────────

export  function useAuthStatus() {
  const [authStatus, setAuthStatus] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const status = await isAuth();
      setAuthStatus(status);
    }
    checkAuth();
  }, []);

  return authStatus;
}

export  function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
 

  useEffect(() => {
    setLoading(true);
    const postsRef = collection(firedb, 'posts');
    const q = query(postsRef, orderBy('createdAt', 'desc'));
   
    const triggerncleaup = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];
      setPosts(fetchedPosts);
      setLoading(false);
    });

    return () => triggerncleaup();
  }, []);

  return { posts, loading };
}


export function useReplies(postId: string) {
  const [replies, setReplies] = useState<Reply[]>([]);

  useEffect(() => {
    const repliesRef = collection(firedb, `posts/${postId}/replies`);
    const q = query(repliesRef, orderBy('createdAt', 'desc'));

   const unsubscribe = onSnapshot(q, (snapshot) => {
   
      const repliesArray = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Reply[];
      setReplies(repliesArray);
    });

    return () => unsubscribe();
  }, [postId]);

  return replies;
}

export function useUserData(userId: string) {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (!userId) return;
    getUserByUid(userId).then(setUserData);
  }, [userId]);

  return userData;
}

export function useAdminStatus(userId: string) {
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const checkAdminStatus = async () => {
      const admin = await isAdmin(userId);
      setIsAdminUser(admin);
    };
    checkAdminStatus();
  }, [userId]);

  return isAdminUser;
}

// ─── Actions ─────────────────────────────────────────────

export async function newReplies(postId: string, text: string, replyUserId: string) {
  const authStatus = await isAuth();

  if (!authStatus) {
    alert("You must be logged in to reply.");
    return false;
  }

  const repliesRef = collection(firedb, `posts/${postId}/replies`);
  await addDoc(repliesRef, {
    text,
    createdAt: serverTimestamp(),
    userId: replyUserId
  });
  return true;
}


export async function deletePost(postId: string, userId: string) {
  const authStatus = await isAuth();

  if (!authStatus) {
    alert("You must be logged in to delete a post.");
    return false;
  }
  try {
    const userRed = collection(firedb, 'users', userId, 'posts');
    const postsRef = collection(firedb, 'posts');
    await deleteDoc(doc(postsRef, postId));
    console.log('success 1')
    await deleteDoc(doc(userRed, postId));
    console.log('success 2')

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
  
}

export async function deleteImage(postId: string){
  try {
    const { data, error } = await supabase
      .storage.deleteBucket(`posts/${postId}`);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("deleteImage error:", error);
    return false;
  }
} 