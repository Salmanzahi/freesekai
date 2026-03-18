"use client"

import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { CardContent } from "@/components/ui/card"
import { PenSquare } from "lucide-react"
import { ProfilePicEditModal } from "@/components/profile/profilepicedit"
import type { User } from "firebase/auth"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { auth } from "@/lib/firebase"
import {
  fetchUsernameByUid,
  updateUsername as updateusername,
  validateUsername,
  getProfileImageUrl,
} from "./profilehandling"
import { UserPost } from "./userpostpage"
import { useUserPosts } from "./userpost"
import { toast } from "sonner"
import { CreateCard } from "../create/createcard"
import {
  useFollowStats,
  getFollowers,
  getFollowing,
  type FollowUser,
} from "./socialhandling"
import { FollowListModal } from "./FollowListModal"
import { ProfileHeader, type StatItem } from "./ProfileHeader"
import { BackComponent } from "@/components/myComponent/backComponent"

export default function Profile() {
  const [usernameModalOpen, setUsernameModalOpen] = useState(false)
  const [picModalOpen, setPicModalOpen] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [tempUsername, setTempUsername] = useState<string | null>(null)
  const [authUser, setAuthUser] = useState<User | null | undefined>(undefined)
  const [username, setUsername] = useState<string | null>(null)
  const [usernameLoading, setUsernameLoading] = useState(true)
  const [profileImg, setProfileImg] = useState<string | null>(null)
  const [usernameError, setUsernameError] = useState<boolean>(false)

  const [followersModalOpen, setFollowersModalOpen] = useState(false)
  const [followingModalOpen, setFollowingModalOpen] = useState(false)
  const [followersList, setFollowersList] = useState<FollowUser[]>([])
  const [followingList, setFollowingList] = useState<FollowUser[]>([])
  const [followLoading, setFollowLoading] = useState(false)

  const { followersCount, followingCount } = useFollowStats(authUser?.uid ?? "")
  const { postsCount } = useUserPosts(authUser?.uid ?? "")

  // ---- handlers ----
  const handleOpenFollowers = async () => {
    setFollowersModalOpen(true)
    if (authUser?.uid) {
      setFollowLoading(true)
      const list = await getFollowers(authUser.uid)
      setFollowersList(list)
      setFollowLoading(false)
    }
  }

  const handleOpenFollowing = async () => {
    setFollowingModalOpen(true)
    if (authUser?.uid) {
      setFollowLoading(true)
      const list = await getFollowing(authUser.uid)
      setFollowingList(list)
      setFollowLoading(false)
    }
  }

  // ---- effects ----
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user ?? null)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const fetchUserData = async (u: User) => {
      setUsernameLoading(true)
      try {
        const usernameRes = await fetchUsernameByUid(u.uid)
        const profileImageUrl = await getProfileImageUrl(u.uid)
        setUsername(usernameRes.username)
        setProfileImg(profileImageUrl)
      } catch (err) {
        console.error("Failed to fetch user data:", err)
        setUsername(null)
        setProfileImg(null)
      } finally {
        setUsernameLoading(false)
      }
    }

    if (authUser === undefined) return
    if (authUser === null) {
      window.location.href = "/"
      return
    }
    fetchUserData(authUser)
  }, [authUser])

  // ---- derived ----
  const stats: StatItem[] = [
    { label: "Following", value: followingCount, onClick: handleOpenFollowing },
    { label: "Followers", value: followersCount, onClick: handleOpenFollowers },
    { label: "Posts", value: postsCount },
  ]

  return (
    <div className="min-h-screen items-center justify-center align-middle  sm:pt-24 px-2 sm:px-4">
      <BackComponent className="ml-4 mt-4 md:mt-0" route="/" />
      <ProfileHeader
        title="Ur Profile"
        avatarSrc={profileImg ?? auth.currentUser?.photoURL}
        avatarFallback={username?.charAt(0) ?? auth.currentUser?.displayName?.charAt(0) ?? "U"}
        loading={authUser === undefined || usernameLoading}
        stats={stats}
        avatarOverlay={
          <span
            className="absolute bottom-0 right-0 rounded-full bg-white p-1 shadow hover:bg-gray-100 cursor-pointer active:bg-gray-200"
            onClick={() => setPicModalOpen(true)}
          >
            <PenSquare className="h-4 w-4 text-gray-700" />
          </span>
        }
        infoContent={
          <>
            <p className="text-sm md:text-xl font-semibold">
              {username ?? authUser?.displayName ?? "Unknown User"}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground">
              {authUser?.email ?? "No Email"}
            </p>
          </>
        }
        extraContent={
          showAlert ? (
            <div className="fixed top-4 right-4 w-full max-w-sm z-50 transition-all duration-500 ease-in-out transform animate-fade-in-up">
              <Alert>
                <AlertTitle>Profile updated</AlertTitle>
                <AlertDescription>Username saved successfully.</AlertDescription>
              </Alert>
              <style jsx global>{`
                @keyframes fadeInUp {
                  0% { opacity: 0; transform: translateY(30px); }
                  100% { opacity: 1; transform: translateY(0); }
                }
              `}</style>
            </div>
          ) : null
        }
      />

      {/* ---- Own-profile specific: edit username & create post ---- */}
      <CardContent className="p-4">
        <p className="text-sm ml-3 my-2">Username</p>
        <div className="flex items-center gap-2 w-full">
          <div></div>
          <Input
            placeholder="Enter your new username"
            readOnly
            value={username ?? authUser?.displayName ?? ""}
            className="cursor-default"
          />
          <Dialog
            open={usernameModalOpen}
            onOpenChange={(open) => {
              if (open) setTempUsername(username ?? authUser?.displayName ?? "")
              setUsernameModalOpen(open)
            }}
          >
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Edit Username"
                onClick={() => {
                  setTempUsername(username ?? authUser?.displayName ?? "")
                  setUsernameModalOpen(true)
                }}
              >
                <PenSquare className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Username</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center gap-4 py-4">
                <Input
                  placeholder="Enter your username"
                  value={tempUsername ?? ""}
                  onChange={(e) => setTempUsername(e.target.value)}
                  className="mb-2"
                  id="username"
                />
                <span className="text-sm text-muted-foreground">
                  Update your username information.
                </span>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="secondary" onClick={() => setUsernameModalOpen(false)}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  onClick={async () => {
                    if (authUser && tempUsername !== null) {
                      const validation = await validateUsername(tempUsername, 5, 20)
                      if (!validation.ok) {
                        toast.error(validation.reason)
                        setUsernameModalOpen(true)
                        setTimeout(() => setUsernameError(false), 2000)
                        return
                      }
                      setUsernameError(false)
                      const res = await updateusername(authUser.uid, tempUsername)
                      if (!res.ok) {
                        toast.error(res.reason)
                        setUsernameModalOpen(true)
                        setTimeout(() => setUsernameError(false), 2000)
                        return
                      }
                      setUsername(tempUsername)
                      setUsernameModalOpen(false)
                      setShowAlert(true)
                      setTimeout(() => setShowAlert(false), 1000)
                    }
                  }}
                >
                  Save
                </Button>
                {usernameError && usernameModalOpen && (
                  <div className="w-full text-center text-sm text-red-500 mt-2">
                    {tempUsername && /[^A-Za-z0-9_]/.test(tempUsername)
                      ? "Username can only contain letters, numbers, and underscores."
                      : tempUsername && (tempUsername.length < 5 || tempUsername.length > 10)
                        ? "Username must be 5-10 characters long."
                        : ""}
                  </div>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="mt-4 w-full p-4">Create a Post !</Button>
          </DialogTrigger>
          <DialogContent className="max-w-full sm:max-w-3/4 h-screen sm:h-auto sm:max-h-[90vh] flex flex-col p-0 gap-0">
            <DialogHeader className="px-6 pt-6 pb-2">
              <DialogTitle>Create a Post</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <CreateCard />
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>

      {/* ---- Modals ---- */}
      <FollowListModal
        open={followersModalOpen}
        onOpenChange={setFollowersModalOpen}
        title="Followers"
        users={followersList}
        loading={followLoading}
      />
      <FollowListModal
        open={followingModalOpen}
        onOpenChange={setFollowingModalOpen}
        title="Following"
        users={followingList}
        loading={followLoading}
      />
      <ProfilePicEditModal open={picModalOpen} onClose={() => setPicModalOpen(false)} />
      <UserPost />
    </div>
  )
}
