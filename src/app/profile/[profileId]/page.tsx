"use client"

import { use, useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useUserPosts } from "../userpost"
import { PostCard } from "@/app/home/cardload"
import { fetchUsernameByUid, getProfileImageUrl } from "../profilehandling"
import { useFollowStats, useIsFollowing, followUser, unfollowUser } from "../socialhandling"
import type { User } from "firebase/auth"
import { toast } from "sonner"
import { ProfileHeader, type StatItem } from "../ProfileHeader"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ProfilePage({ params }: { params: Promise<{ profileId: string }> }) {
    const { profileId } = use(params)
    const router = useRouter()

    // Auth State
    const [authUser, setAuthUser] = useState<User | null>(null)
    const [authLoading, setAuthLoading] = useState(true)

    // Profile State
    const [username, setUsername] = useState<string | null>(null)
    const [profileImg, setProfileImg] = useState<string | null>(null)
    const [profileLoading, setProfileLoading] = useState(true)

    // Following / Social Stats
    const { followersCount, followingCount } = useFollowStats(profileId)
    const isFollowing = useIsFollowing(authUser?.uid, profileId)
    const [followActionLoading, setFollowActionLoading] = useState(false)

    // Get posts
    const { posts, loading: postsLoading, postsCount } = useUserPosts(profileId)

    // Auth listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setAuthUser(user)
            setAuthLoading(false)
        })
        return () => unsubscribe()
    }, [])

    // Fetch the target user's data
    useEffect(() => {
        const fetchUserData = async () => {
            setProfileLoading(true)
            try {
                const usernameRes = await fetchUsernameByUid(profileId)
                const profileImageUrl = await getProfileImageUrl(profileId)
                setUsername(usernameRes.username ?? "Unknown User")
                setProfileImg(profileImageUrl)
            } catch (err) {
                console.error("Failed to fetch user data:", err)
                setUsername("Unknown User")
            } finally {
                setProfileLoading(false)
            }
        }

        if (profileId) {
            fetchUserData()
        }
    }, [profileId])

    const handleFollowToggle = async () => {
        if (!authUser) {
            toast.error("You need to be logged in to do this")
            return
        }

        setFollowActionLoading(true)
        try {
            if (isFollowing) {
                await unfollowUser(authUser.uid, profileId)
                toast.success("Unfollowed successfully")
            } else {
                await followUser(authUser.uid, profileId)
                toast.success("Followed successfully")
            }
        } catch (error) {
            console.error(error)
            toast.error("Failed to update follow status")
        } finally {
            setFollowActionLoading(false)
        }
    }

    const isOwnProfile = authUser?.uid === profileId

    const stats: StatItem[] = [
        { label: "Following", value: followingCount },
        { label: "Followers", value: followersCount },
        { label: "Posts", value: postsCount },
    ]

    return (
        <div className="min-h-screen items-center justify-center align-middle pt-12 sm:pt-24 px-2 sm:px-4">
            <Button className="ml-4 mt-6" variant="ghost" onClick={() => router.back()}>
                <ArrowLeft />
                Back
            </Button>
            <ProfileHeader
                title={isOwnProfile ? "Your Profile" : "Profile"}
                avatarSrc={profileImg}
                avatarFallback={username?.charAt(0) ?? "U"}
                loading={profileLoading}
                stats={stats}
                infoContent={
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
                }
            />

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
