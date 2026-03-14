"use client"

import { use, useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useUserPosts } from "../userpost"
import { PostCard } from "@/app/home/cardload"
import { fetchUsernameByUid, getProfileImageUrl } from "../profilehandling"
import { useFollowStats, useIsFollowing, followUser, unfollowUser } from "../socialhandling"
import type { User } from "firebase/auth"
import { toast } from "sonner"

export default function ProfilePage({ params }: { params: Promise<{ profileId: string }> }) {
    const { profileId } = use(params);
    
    // Auth State
    const [authUser, setAuthUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);

    // Profile State
    const [username, setUsername] = useState<string | null>(null);
    const [profileImg, setProfileImg] = useState<string | null>(null);
    const [profileLoading, setProfileLoading] = useState(true);

    // Following / Social Stats
    const { followersCount, followingCount } = useFollowStats(profileId);
    const isFollowing = useIsFollowing(authUser?.uid, profileId);
    const [followActionLoading, setFollowActionLoading] = useState(false);

    // Get posts 
    const { posts, loading: postsLoading, postsCount } = useUserPosts(profileId);

    // Auth listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setAuthUser(user);
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Fetch the target user's data
    useEffect(() => {
        const fetchUserData = async () => {
            setProfileLoading(true);
            try {
                const usernameRes = await fetchUsernameByUid(profileId);
                const profileImageUrl = await getProfileImageUrl(profileId);
                setUsername(usernameRes.username ?? "Unknown User");
                setProfileImg(profileImageUrl);
            } catch (err) {
                console.error("Failed to fetch user data:", err);
                setUsername("Unknown User");
            } finally {
                setProfileLoading(false);
            }
        };

        if (profileId) {
            fetchUserData();
        }
    }, [profileId]);

    const handleFollowToggle = async () => {
        if (!authUser) {
            toast.error("You need to be logged in to do this");
            return;
        }
        
        setFollowActionLoading(true);
        try {
            if (isFollowing) {
                await unfollowUser(authUser.uid, profileId);
                toast.success("Unfollowed successfully");
            } else {
                await followUser(authUser.uid, profileId);
                toast.success("Followed successfully");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update follow status");
        } finally {
            setFollowActionLoading(false);
        }
    };

    const isOwnProfile = authUser?.uid === profileId;

    return (
        <div className="min-h-screen items-center justify-center align-middle pt-12 sm:pt-24 px-2 sm:px-4">
            <Card className="bg-transparent border-none shadow-none">
                <CardHeader>
                    <CardTitle className="text-left text-xl px-4">{isOwnProfile ? "Your Profile" : "Profile"}</CardTitle>
                    <div className="my-4 w-full flex flex-row justify-between items-center px-4">
                        <div className="relative">
                            <Avatar className="h-24 w-24 items-center justify-center">
                                <AvatarImage src={profileImg ?? undefined} />
                                <AvatarFallback>
                                    {username?.charAt(0) ?? "U"}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        
                        <div className="text-right flex flex-col items-end gap-2">
                            {profileLoading ? (
                                <div className="space-y-2 flex flex-col items-end">
                                    <Skeleton className="h-6 w-48" />
                                </div>
                            ) : (
                                <>
                                    <p className="text-sm md:text-xl font-semibold">{username}</p>
                                    {!isOwnProfile && !authLoading && authUser && (
                                        <Button 
                                            onClick={handleFollowToggle} 
                                            disabled={followActionLoading}
                                            variant={isFollowing ? "outline" : "default"}
                                            className="w-full mt-2"
                                            size="sm"
                                        >
                                            {isFollowing ? "Unfollow" : "Follow"}
                                        </Button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-around w-full mt-6 mb-2">
                        <div className="flex flex-col items-center hover:bg-muted/50 p-2 rounded-lg transition-colors flex-1">
                            <span className="font-bold text-xl">{followingCount}</span>
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Following</span>
                        </div>
                        <Separator orientation="vertical" className="h-8 bg-border/60" />
                        <div className="flex flex-col items-center hover:bg-muted/50 p-2 rounded-lg transition-colors flex-1">
                            <span className="font-bold text-xl">{followersCount}</span>
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Followers</span>
                        </div>
                        <Separator orientation="vertical" className="h-8 bg-border/60" />
                        <div className="flex flex-col items-center hover:bg-muted/50 p-2 rounded-lg transition-colors flex-1">
                            <span className="font-bold text-xl">{postsCount}</span>
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Posts</span>
                        </div>
                    </div>
                    <Separator className="mt-2" />
                </CardHeader>
            </Card>

            <div className="w-full mt-4">
                <h1 className="text-xl font-bold mb-4 px-4">{username} Posts</h1>
                <div className="space-y-6 mx-4 md:mx-40 pb-10">
                    {postsLoading ? (
                        <Skeleton className="h-64" />
                    ) : posts.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">No posts yet.</p>
                    ) : (
                        posts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
