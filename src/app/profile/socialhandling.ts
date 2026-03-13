import { firedb } from '@/lib/firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';

export function useFollowStats(profileId: string) {
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);

    useEffect(() => {
        if (!profileId) return;
        
        const followersRef = collection(firedb, 'users', profileId, 'followers');
        const followingRef = collection(firedb, 'users', profileId, 'following');

        const unsubFollowers = onSnapshot(followersRef, (snapshot) => {
            setFollowersCount(snapshot.size);
        });

        const unsubFollowing = onSnapshot(followingRef, (snapshot) => {
            setFollowingCount(snapshot.size);
        });

        return () => {
            unsubFollowers();
            unsubFollowing();
        };
    }, [profileId]);

    return { followersCount, followingCount };
}

export function useIsFollowing(currentUserId: string | undefined, profileId: string) {
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        if (!currentUserId || !profileId) {
            setIsFollowing(false);
            return;
        }

        const docRef = doc(firedb, 'users', profileId, 'followers', currentUserId);
        const unsub = onSnapshot(docRef, (docSnap) => {
            setIsFollowing(docSnap.exists());
        });

        return () => unsub();
    }, [currentUserId, profileId]);

    return isFollowing;
}

export async function followUser(currentUserId: string, profileId: string) {
    if (!currentUserId || !profileId || currentUserId === profileId) return;

    // Add current user to profile's followers
    const profileFollowersRef = doc(firedb, 'users', profileId, 'followers', currentUserId);
    await setDoc(profileFollowersRef, { followedAt: new Date() });

    // Add profile to current user's following
    const currentUserFollowingRef = doc(firedb, 'users', currentUserId, 'following', profileId);
    await setDoc(currentUserFollowingRef, { followedAt: new Date() });
}

export async function unfollowUser(currentUserId: string, profileId: string) {
    if (!currentUserId || !profileId) return;

    // Remove current user from profile's followers
    const profileFollowersRef = doc(firedb, 'users', profileId, 'followers', currentUserId);
    await deleteDoc(profileFollowersRef);

    // Remove profile from current user's following
    const currentUserFollowingRef = doc(firedb, 'users', currentUserId, 'following', profileId);
    await deleteDoc(currentUserFollowingRef);
}
