"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { getRoomMembers, leaveRoom } from "../roomHandling"
import { getUserByUid, type UserData } from "@/lib/userProperties"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import { useRoom } from "./roomContext"

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
            <div>
              <CardTitle className="text-2xl">{room.roomName}</CardTitle>
              <CardDescription>
                {members.length} member{members.length !== 1 && "s"}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => router.push("/room")}>
                Back
              </Button>
              <Button variant="destructive" size="sm" onClick={handleLeave}>
                Leave Room
              </Button>
            </div>
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
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}