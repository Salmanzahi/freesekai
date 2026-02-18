"use client"

import { useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { PenSquare } from "lucide-react"
import { useState } from "react";
import { ProfilePicEditModal } from "@/components/profile/profilepicedit";
import type { User } from "firebase/auth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { auth } from "@/lib/firebase";
import { fetchUsernameByUid, updateUsername as updateusername, validateUsername} from "./profilehandling";
import { getProfileImageUrl } from "./profilehandling"
import { Separator } from "@/components/ui/separator"
import { UserPost } from "./userpostpage";
import { useUserPosts } from "./userpost";

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

    const { postsCount } = useUserPosts(authUser?.uid ?? "");
    
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
        <div className="min-h-screen items-center justify-center align-middle pt-12 sm:pt-24 px-2 sm:px-4">
            <Card className="bg-transparent border-none shadow-none">
                <CardHeader className=''>
                    <CardTitle className="text-left text-xl px-4">Ur Profile</CardTitle>
             
                       <div className="my-4 w-full flex flex-row justify-between items-center px-4">
                          <div className="relative">
                             <Avatar className="h-24 w-24 items-center justify-center">
                                <AvatarImage src={profileImg ?? auth.currentUser?.photoURL ?? undefined} />
                                <AvatarFallback>
                                    {username?.charAt(0) ?? auth.currentUser?.displayName?.charAt(0) ?? "U"}
                                </AvatarFallback>
                            </Avatar>
                            <span className="absolute bottom-0 right-0 rounded-full bg-white p-1 shadow hover:bg-gray-100 cursor-pointer active:bg-gray-200" onClick={() => setPicModalOpen(true)}>
                                <PenSquare className="h-4 w-4 text-gray-700" />
                            </span>
                          </div>
                          
                          <div className="text-right">
                             {authUser === undefined || usernameLoading ? (
                                <div className="space-y-2 flex flex-col items-end">
                                  <Skeleton className="h-6 w-48" />
                                  <Skeleton className="h-4 w-64" />
                                </div>
                              ) : (
                                <>
                                  <p className="text-sm md:text-xl   font-semibold">{username ?? authUser?.displayName ?? "Unknown User"}</p>
                                  <p className="text-xs md:text-sm text-muted-foreground">{authUser?.email ?? "No Email"}</p>
                                </>
                              )}
                           </div>
                        </div>
                
                 
                   
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
                     <div className="flex items-center justify-around w-full mt-6 mb-2">
                        <div className="flex flex-col items-center hover:bg-muted/50 p-2 rounded-lg cursor-pointer transition-colors flex-1">
                           <span className="font-bold text-xl">0</span>
                           <span className="text-xs text-muted-foreground uppercase tracking-wider">Following</span>
                        </div>
                        <Separator orientation="vertical" className="h-8 bg-border/60" />
                        <div className="flex flex-col items-center hover:bg-muted/50 p-2 rounded-lg cursor-pointer transition-colors flex-1">
                           <span className="font-bold text-xl">0</span>
                           <span className="text-xs text-muted-foreground uppercase tracking-wider">Followers</span>
                        </div>
                         <Separator orientation="vertical" className="h-8 bg-border/60" />
                        <div className="flex flex-col items-center hover:bg-muted/50 p-2 rounded-lg cursor-pointer transition-colors flex-1">
                           <span className="font-bold text-xl">{postsCount}</span>
                           <span className="text-xs text-muted-foreground uppercase tracking-wider">Posts</span>
                        </div>
                     </div>
                     <Separator className="mt-2" />
                    
                </CardHeader>
               
                <CardContent className="ml-4">
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
         <UserPost />
        </div>
       
      
    )
}


