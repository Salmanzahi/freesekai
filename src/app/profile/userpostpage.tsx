"use client"
import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { PostCard } from "../home/cardload"
import { Skeleton } from "@/components/ui/skeleton"
import { useUserPosts } from "./userpost"

export function UserPost() {
    return (
        <div className="w-full">
            <h1 className="text-2xl font-bold mb-4 px-4">Your Posts</h1>
            <ListPost />
        </div>
    )
}

function ListPost() {
    const [userId, setUserId] = useState<string>('');
    const [authLoading, setAuthLoading] = useState(true);

    // Listen for auth state
    useEffect(() => {
        const unsubscribe =  onAuthStateChanged(auth, (user) => {
            setUserId(user?.uid ?? '');
            setAuthLoading(false);
            console.log('current state', user?.uid)
        });
        return () => unsubscribe();
    }, []);

    // // Use the hook to fetch posts (it handles its own loading state)
    // console.log('test')
    const { posts, loading: postsLoading } =   useUserPosts(userId);

    const loading = authLoading || postsLoading;

    return (
        <div className="space-y-6 px-4 pb-10">
            {loading ? (
                <Skeleton className="h-64" />
            ) : posts.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No posts yet.</p>
            ) : (
                posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))
            )}
        </div>
    )
}