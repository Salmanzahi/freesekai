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

import { getDocs, getDoc } from 'firebase/firestore';

export type FollowUser = {
    uid: string;
    username: string | null;
    photoURL: string | null;
};

export async function getFollowUsersData(uids: string[]): Promise<FollowUser[]> {
    const usersData: FollowUser[] = [];
    for (const uid of uids) {
        const userRef = doc(firedb, 'users', uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            const data = userSnap.data();
            usersData.push({
                uid,
                username: data.username || null,
                photoURL: data.photoURL || null,
            });
        }
    }
    return usersData;
}

export async function getFollowers(profileId: string): Promise<FollowUser[]> {
    const followersRef = collection(firedb, 'users', profileId, 'followers');
    const snapshot = await getDocs(followersRef);
    const uids = snapshot.docs.map(doc => doc.id);
    return getFollowUsersData(uids);
}

export async function getFollowing(profileId: string): Promise<FollowUser[]> {
    const followingRef = collection(firedb, 'users', profileId, 'following');
    const snapshot = await getDocs(followingRef);
    const uids = snapshot.docs.map(doc => doc.id);
    return getFollowUsersData(uids);
}

