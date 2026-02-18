import { firedb } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import type { Post } from '../home/cardloadLogic';

export function useUserPosts(userId: string) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setPosts([]);
            setLoading(false);
             console.log('userpost triggered (not triggered)' , userId)
            return;
           
        }

        // Real-time listener on the user's posts subcollection
        const userPostsRef = collection(firedb, 'users', userId, 'posts');
        const q = query(userPostsRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            if (snapshot.empty) {
                setPosts([]);
                setLoading(false);
                return;
            }

            // Fetch each post by document ID in parallel
            const fetched = await Promise.all(       
                snapshot.docs.map(async (refDoc) => {
                    const postSnap = await getDoc(doc(firedb, 'posts', refDoc.id));
                    if (!postSnap.exists()) return null;
                    return { id: postSnap.id, ...postSnap.data() } as Post;
                })
            );
            console.log('userpost triggered', fetched)

            const posts = fetched.filter((p): p is Post => p !== null);
            setPosts(posts);
            console.log('Filtered posts', posts.length)
            setLoading(false);
            
        });

        return () => unsubscribe();
    }, [userId]);


    return { posts, loading, postsCount: posts.length };
}
