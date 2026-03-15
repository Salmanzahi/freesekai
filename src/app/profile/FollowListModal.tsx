import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FollowUser } from "./socialhandling";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

export function FollowListModal({
    open,
    onOpenChange,
    title,
    users,
    loading
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    users: FollowUser[];
    loading: boolean;
}) {
    const router = useRouter();
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md max-h-[80vh] flex flex-col p-4 sm:p-6">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto pr-2 space-y-4 py-4 min-h-[300px]">
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            ))}
                        </div>
                    ) : users.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-8">
                            <p className="text-muted-foreground">No users found.</p>
                        </div>
                    ) : (
                        users.map((u) => (
                            <div 
                                key={u.uid} 
                                className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors"
                                onClick={() => router.push(`/profile/${u.uid}`)}
                            >
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={u.photoURL ?? undefined} className="object-cover" />
                                    <AvatarFallback>{u.username?.charAt(0) ?? "U"}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="font-medium text-sm">{u.username ?? "Unknown User"}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
