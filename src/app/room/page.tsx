"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { isAuth } from "@/lib/isauth";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
// import { Skeleton } from "@/components/ui/skeleton";
import {RoomList} from "./roomlist";
import { handleCreate, handleJoin } from "./roomHandling";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";


function cleanForm(setRoomName: (value: string) => void, setKeyAccess: (value: string) => void) {
    setRoomName("");
    setKeyAccess("");
}
export default function Room() {
    const router = useRouter();
    const [isAuthUser, setIsAuthUser] = useState(false);
    const [roomName, setRoomName] = useState("");
    const [keyAccess, setKeyAccess] = useState("");
    const [loading, setLoading] = useState(true);
    const[openDialog, setOpenDialog] = useState({status: false, message: ''});
    const[userId, setUserId] = useState('');
    useEffect(() => {
        const checkAuth = async () => {
            const authenticated = await isAuth();
            setIsAuthUser(authenticated);
            setLoading(false);
        };
       checkAuth()
       return () => {
        setIsAuthUser(false);
       }
    }, []);
   
       useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                router.push('/');
            }
        });
        return () => unsubscribe();
       }, [router]);
   
    
    const handleJoinRoom =  async () => {
        console.log('handleJoinRoom Triggered')
        console.log(roomName, keyAccess);
        const handle = await handleJoin(roomName, keyAccess, userId);
        if (handle.status){
            console.log('open dialog')
            setOpenDialog({status: true, message: handle.message});

        } else {
            console.log('close dialog')
            setOpenDialog({status: true, message: handle.message});
        }
        

    }
    const handleCreateRoom = async () => {
        console.log('handleCreateRoom Triggered')
        console.log(roomName, keyAccess);
        await handleCreate(roomName, keyAccess, userId);
        alert("Room created successfully")
        cleanForm(setRoomName, setKeyAccess);
    }
    return (
        <div className=" p-4">
                <Card className="mt-24 shadow-none bg-transparent border-none">
                    <CardHeader>
                        <CardTitle>
                            Room Page
                        </CardTitle>
                        <CardDescription>
                            Enter your room ID to join the room {userId}
                        </CardDescription>
                        <CardAction>
                            <Button variant="link">{!isAuthUser && <Link href="/login">Sign In</Link>}
                            </Button>
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-4">
                                    <Label htmlFor="room-id">Room Name</Label>
                                    <Input
                                        id="room-id"
                                        name="room-id"
                                        value={roomName}
                                        onChange={(e) => setRoomName(e.target.value)}
                                        type="text"
                                        placeholder="Perserikatan Rusdi Ngawi...."
                                        required
                                    />
                                    <Label htmlFor="key-access">Key Access</Label>
                                    <Input
                                        id="key-access"
                                        name="key-access"
                                        value={keyAccess}
                                        onChange={(e) => setKeyAccess(e.target.value)}
                                        type="text"
                                        placeholder="Enter your key access"
                                        required
                                    />
                                </div>
                            </div>
                            <CardFooter className="flex-row  mt-4">
                                <Button type="submit" className="w-1/2" onClick={handleJoinRoom}>
                                    Join Room
                                </Button>
                                <Button variant="link" className="w-1/2" onClick={handleCreateRoom}>
                                 Create Room
                                </Button>
                            </CardFooter>
                        </form>
                    </CardContent>
                </Card>
                <Dialog open={openDialog.status} onOpenChange={() => setOpenDialog({status: false, message: ''})}>
                    <DialogContent>
                        <DialogHeader className="mb-4">
                            <DialogTitle className="text-center">{openDialog.message}</DialogTitle>
                            
                        </DialogHeader>
                        <DialogFooter>

                                <Button variant="ghost" onClick={() => setOpenDialog({status: false, message: ''})}>
                                    Close
                                </Button>
                                <Button variant="default" onClick={() => setOpenDialog({status: false, message: ''})}>
                                    Join Room
                                </Button>
                          
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <div className="mt-4">
                    <RoomList />
                </div>
        </div>
    );
}