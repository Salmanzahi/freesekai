"use client"

import { useEffect } from "react"
// import { auth } from "@/lib/firebase"

import { onAuthStateChanged } from "firebase/auth"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { PenSquare } from "lucide-react"
import { useState } from "react";
import type { User } from "firebase/auth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { rtdb, auth } from "@/lib/firebase";
import { fetchUsernameByUid, updateUsername as updateusername, validateUsername, changeImageProfile} from "./profilehandling";
import { getProfileImageUrl } from "./profilehandling"

export default function Profile() {
 
 const [usernameModalOpen, setUsernameModalOpen] = useState(false);
  const [picModalOpen, setPicModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [tempUsername, setTempUsername] = useState<string | null>(null);
  const [authUser, setAuthUser] = useState<User | null | undefined>(undefined); // undefined = loading
  const [username, setUsername] = useState<string | null>(null);
  const [usernameLoading, setUsernameLoading] = useState(true);
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [ usernameError, setUsernameError ] = useState<boolean>(false);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setAuthUser(user ?? null);
        });
        return () => unsubscribe();
    }, []);
    useEffect(() => {
      const fetchUserData = async (u: User) => {
        setUsernameLoading(true);
        try {
          
            const usernameRes = await fetchUsernameByUid(u.uid);
            const profileImageUrl = await getProfileImageUrl(u.uid);
          setUsername(usernameRes.username);
          setProfileImg(profileImageUrl);
        } catch (err) {
          console.error("Failed to fetch user data:", err);
          setUsername(null);
          setProfileImg(null);
        } finally {
          setUsernameLoading(false);
        }
      };

      if (authUser === undefined) {
        
        return;
      }

      if (authUser === null) {
        window.location.href = "/";
        return;
      }

      fetchUserData(authUser);
    }, [authUser]);

    return (
        <div className=" min-h-screen items-center justify-center align-middle p-4  ">
            <Card className="mt-24">
                <CardHeader>
                    <CardTitle className="text-center text-xl">Profile Menu</CardTitle>
                    {/* <CardDescription>Card Description</CardDescription> */}
                    {/* <CardAction>Card Action</CardAction> */}
                    <div className="relative mx-auto my-4 h-24 w-24">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={profileImg ?? auth.currentUser?.photoURL ?? undefined} />
                            <AvatarFallback>
                                {username?.charAt(0) ?? auth.currentUser?.displayName?.charAt(0) ?? "U"}
                            </AvatarFallback>
                        </Avatar>
            <span className="absolute bottom-1 right-1 rounded-full bg-white p-1 shadow hover:bg-gray-100 cursor-pointer active:bg-gray-200" onClick={() => setPicModalOpen(true)}  >
                            <PenSquare className="h-5 w-5 text-gray-700" />
                        </span>
                    </div>
                    {authUser === undefined || usernameLoading ? (
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-48 mx-auto" />
                        <Skeleton className="h-4 w-64 mx-auto" />
                      </div>
                    ) : (
                      <>
                        <p className="text-center text-lg font-semibold">{username ?? authUser?.displayName ?? "Unknown User"}</p>
                        <p className="text-center text-sm text-muted-foreground">{authUser?.email ?? "No Email"}</p>
                      </>
                    )}
                    {showAlert && (
                      <div className="fixed top-4 right-4 w-full max-w-sm z-50 transition-all duration-500 ease-in-out transform animate-fade-in-up">
                      <Alert>
                        <AlertTitle>Profile updated</AlertTitle>
                        <AlertDescription>Username saved successfully.</AlertDescription>
                      </Alert>
                      <style jsx global>{`
                        @keyframes fadeInUp {
                        0% {
                          opacity: 0;
                          transform: translateY(30px);
                        }
                        100% {
                          opacity: 1;
                          transform: translateY(0);
                        }
                        }
                      `}</style>
                      </div>
                    )}
                </CardHeader>
                <CardContent>
                  <p>Username</p>
                    <div className="flex items-center gap-2">
                    <Input
                      placeholder="Enter your new username"
                      readOnly
                      value={username ?? authUser?.displayName ?? ""}
                      className="cursor-default"
                    />
                    <Dialog open={usernameModalOpen} onOpenChange={(open) => {
                      // when opening, seed tempUsername with current username
                      if (open) setTempUsername(username ?? authUser?.displayName ?? "");
                      setUsernameModalOpen(open);
                    }}>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Edit Username"
                          onClick={() => {
                            // open dialog (DialogTrigger won't toggle controlled open prop reliably when controlled)
                            setTempUsername(username ?? authUser?.displayName ?? "");
                            setUsernameModalOpen(true);
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
                            onChange={e => setTempUsername(e.target.value)}
                            className="mb-2"
                            id="username"
                          />
                          <span className="text-sm text-muted-foreground">Update your username information.</span>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="secondary" onClick={() => setUsernameModalOpen(false)}>Cancel</Button>
                          </DialogClose>
                            <Button
                            onClick={async () => {
                              if (authUser && tempUsername !== null) {
                              // Validation: only allow alphanumeric and underscore, 5-10 chars
                                const validation = validateUsername(tempUsername, 5, 20);
                                if (!validation.ok) {
                                  setUsernameError(true);
                                  setUsernameModalOpen(true);
                                  setTimeout(() => setUsernameError(false), 2000);
                                  return;
                                }
                                setUsernameError(false);
                                await updateusername(authUser.uid, tempUsername);
                              setUsername(tempUsername);
                              setUsernameModalOpen(false);
                              setShowAlert(true);
                              setTimeout(() => setShowAlert(false), 1000);
                              }
                            }}
                            >
                            Save
                            </Button>
                            {/* Error message */}
                            {(usernameError && usernameModalOpen) && (
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
                </CardContent>
                {/* <CardFooter>
                    <p>Card Footer</p>
                </CardFooter> */}
            </Card>
      <ProfilePicEditModal open={picModalOpen} onClose={() => setPicModalOpen(false)} />
        </div>
    )
}


function ProfilePicEditModal({ open, onClose }: { open: boolean; onClose: () => void }) {

  const [ authUser, setAuthUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
          setAuthUser(user);
      });
      return () => unsubscribe();
  }, []);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile Picture</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          {/* Placeholder for image upload */}
          <label htmlFor="profile-pic-upload" className="mb-1 text-sm font-medium">
            Upload new profile picture
          </label>
          <Input
            id="profile-pic-upload"
            type="file"
            accept="image/*"
            className="mb-2"
            title="Choose a new profile picture"
          />
          <span className="text-sm text-muted-foreground">Choose a new profile picture.</span>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
               
          </DialogClose>
       <Button
            onClick={async () => {
              if (authUser) {
                // Grab the file input value
                const input = document.getElementById("profile-pic-upload") as HTMLInputElement | null;
                const profilePicFile = input?.files?.[0];
                if (!profilePicFile) return;
                await changeImageProfile(authUser.uid, profilePicFile);
              }
            }}
          >Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ProfileWithPicEdit() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Profile />
      <ProfilePicEditModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}


// username update is handled in ./profilehandling