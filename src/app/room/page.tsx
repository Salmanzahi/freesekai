"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { RoomList } from "./roomlist";
import { handleCreate, handleJoin } from "./roomHandling";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BackComponent } from "@/components/myComponent/backComponent";
export default function Room() {
    const router = useRouter();
    const [isAuthUser, setIsAuthUser] = useState(false);
    const [roomName, setRoomName] = useState("");
    const [keyAccess, setKeyAccess] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [userId, setUserId] = useState('');

    const [dialog, setDialog] = useState<{ open: boolean; title: string; message: string; roomId: string | null }>({
        open: false, title: '', message: '', roomId: null,
    });

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUserId(user.uid);
                setIsAuthUser(true);
            } else {
                setIsAuthUser(false);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleJoinRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!roomName || !keyAccess || !userId) return;
        setSubmitting(true);

        const result = await handleJoin(roomName, keyAccess, userId);

        if (result.status && result.roomId) {
            setDialog({
                open: true,
                title: result.message === 'already_member' ? 'Welcome Back' : 'Joined!',
                message: result.message === 'already_member'
                    ? `You're already in "${roomName}".`
                    : `You've joined "${roomName}" successfully.`,
                roomId: result.roomId,
            });
        } else {
            setDialog({
                open: true,
                title: 'Failed',
                message: result.message,
                roomId: null,
            });
        }

        setRoomName("");
        setKeyAccess("");
        setSubmitting(false);
    }

    const handleCreateRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!roomName || !keyAccess || !userId) return;
        setSubmitting(true);

        const result = await handleCreate(roomName, keyAccess, userId);

        if (result.status && result.roomId) {
            setDialog({
                open: true,
                title: 'Room Created',
                message: `"${roomName}" has been created.`,
                roomId: result.roomId,
            });
        } else {
            setDialog({
                open: true,
                title: 'Error',
                message: result.message as string,
                roomId: null,   
            });
        }

        setRoomName("");
        setKeyAccess("");
        setSubmitting(false);
    }

    const closeDialog = () => setDialog({ open: false, title: '', message: '', roomId: null });

    if (loading) return null;

    return (
        <div className="p-4">
            <BackComponent className="ml-4 mt-4 md:mt-16" route="/" />
            <Card className="mt-2 shadow-none bg-transparent border-none">
                <CardHeader>
                    <CardTitle>Room Page</CardTitle>
                    <CardDescription>
                        Create or join a room with a name and key access
                    </CardDescription>
                    <CardAction>
                        {!isAuthUser && (
                            <Button variant="link" asChild>
                                <Link href="/login">Sign In</Link>
                            </Button>
                        )}
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-4">
                                <Label htmlFor="room-id">Room Name</Label>
                                <Input
                                    id="room-id"
                                    value={roomName}
                                    onChange={(e) => setRoomName(e.target.value)}
                                    type="text"
                                    placeholder="Enter room name..."
                                    disabled={!isAuthUser || submitting}
                                    required
                                />
                                <Label htmlFor="key-access">Key Access</Label>
                                <Input
                                    id="key-access"
                                    value={keyAccess}
                                    onChange={(e) => setKeyAccess(e.target.value)}
                                    type="password"
                                    placeholder="Enter key access"
                                    disabled={!isAuthUser || submitting}
                                    required
                                />
                            </div>
                        </div>
                        <CardFooter className="flex-row mt-4 px-0">
                            <Button
                                className="w-1/2"
                                onClick={handleJoinRoom}
                                disabled={!isAuthUser || submitting || !roomName || !keyAccess}
                            >
                                {submitting ? "..." : "Join Room"}
                            </Button>
                            <Button
                                variant="link"
                                className="w-1/2"
                                onClick={handleCreateRoom}
                                disabled={!isAuthUser || submitting || !roomName || !keyAccess}
                            >
                                {submitting ? "..." : "Create Room"}
                            </Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>

            <Dialog open={dialog.open} onOpenChange={closeDialog}>
                <DialogContent>
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-center">{dialog.title}</DialogTitle>
                        <p className="text-sm text-center text-muted-foreground mt-1">{dialog.message}</p>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={closeDialog}>Close</Button>
                        {dialog.roomId && (
                            <Button onClick={() => { closeDialog(); router.push(`/room/${dialog.roomId}`); }}>
                                Go to Room
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="mt-4">
                
                <RoomList />
               
            </div>
        </div>
    );
}