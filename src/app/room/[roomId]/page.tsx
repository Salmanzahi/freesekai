"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { getRoomMembers, leaveRoom, kickMember } from "../roomHandling"
import { getUserByUid } from "@/lib/userProperties"
import { type UserData } from "@/global_interface/interface"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
// import Link from "next/link"
import { useRoom } from "./roomContext"
import { RoomBreadcrumb } from "./roomBreadcrumb"
import { PostCard } from "./postCard"
import { LucideArchiveX } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
// import { PostCard } from "@/app/home/cardload"

interface MemberInfo {
  uid: string;
  role?: string;
  userData: UserData | null;
}

export default function RoomPage() {
  const router = useRouter()
  const params = useParams()
  const roomId = params.roomId as string
  const { room, userId } = useRoom()

  const [loading, setLoading] = useState(true)
  const [members, setMembers] = useState<MemberInfo[]>([])
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    const fetchMembers = async () => {

      const rawMembers = await getRoomMembers(roomId)
      const withUserData = await Promise.all(
        rawMembers.map(async (m) => ({
          uid: m.uid,
          role: (m as Record<string, unknown>).role as string | undefined,
          userData: await getUserByUid(m.uid),
        }))
      )
      setMembers(withUserData)
      setLoading(false)
    }
    fetchMembers()
  }, [roomId])



  const handleLeave = async () => {
    const ok = await leaveRoom(roomId, userId)
    if (ok) router.push("/room")
  }

  const handleKick = async (uid: string) => {
    const success = await kickMember(roomId, uid);
    if (success) {
      toast.success("Member kicked successfully.");
      setMembers((prev) => prev.filter((m) => m.uid !== uid));
    } else {
      toast.error("Failed to kick the member.");
    }
  }

  useEffect(() => {
    const checkOwner = async () => {
      const rawMembers = await getRoomMembers(roomId)
      const getCurrUswr = rawMembers.find((m) => m.uid === userId)
      // console.log("getCurrUswr", getCurrUswr)
      const isCurrOwner = getCurrUswr?.role === "owner"
      if (isCurrOwner) {
        console.log("isCurrOwner", isCurrOwner)
        setIsOwner(true)
      }
      // console.log("isCurrOwner", isCurrOwner)
      // console.log("rawMembers", rawMembers)
    }
    checkOwner()
  }, [roomId, userId])

  if (loading) {
    return (
      <div className="p-4 mt-24 max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
        <div className="space-y-2 mt-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 mt-24 max-w-2xl mx-auto">
      <Card className="shadow-none bg-transparent border-none">
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <RoomBreadcrumb
              trail={[{ label: "Rooms", href: "/room" }]}
              currentPage={room.roomName}
            />
            <Button variant="destructive" size="sm" onClick={handleLeave}>
              Leave Room
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Members</h3>
            {members.map((m) => (
              <div key={m.uid} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  {m.userData?.photoURL ? (
                    <Image
                      src={m.userData.photoURL}
                      width={32}
                      height={32}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                      {(m.userData?.username?.[0] || "?").toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-medium">
                    {m.userData?.username || "Unknown"}
                  </span>
                  {m.uid === userId && (
                    <span className="text-xs text-muted-foreground">(You)</span>
                  )}
                </div>
                {m.role === "owner" && <Badge variant="secondary">Owner</Badge>}
                {isOwner && m.role !== "owner" && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive" size='sm'>
                        <LucideArchiveX/> Kick 
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Kick Member</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to kick {m.userData?.username || "this user"} from the room?
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button variant="destructive" onClick={() => handleKick(m.uid)}>
                            Confirm Kick
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )
                }
                
              </div>
            ))}
          </div>
        </CardContent>
         <Button className='w-3/4 items-center justify-center mx-auto' onClick={() => router.push(`/room/${roomId}/create`)}>Create a Post !
         
         </Button>
      </Card>
      <PostCard/>
      
    </div>
  )
}