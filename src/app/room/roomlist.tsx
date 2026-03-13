"use client"
import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { getUserRooms, getRoomMemberCount, type RoomData } from "./roomHandling"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Users } from "lucide-react"

export function RoomList() {
  const [rooms, setRooms] = useState<RoomData[]>([])
  const [loading, setLoading] = useState(true)
  const [memberCounts, setMemberCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setRooms([])
        setLoading(false)
        return
      }
      const userRooms = await getUserRooms(user.uid)
      setRooms(userRooms)

      const counts: Record<string, number> = {}
      await Promise.all(
        userRooms.map(async (room) => {
          counts[room.id] = await getRoomMemberCount(room.id)
        })
      )
      setMemberCounts(counts)

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  if (rooms.length === 0) {
    return (
      <Card className="shadow-none bg-transparent border-dashed">
        <CardContent className="flex items-center justify-center py-8 text-muted-foreground text-sm">
          No rooms yet. Create or join one above.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">Your Rooms</h3>
      {rooms.map((room) => (
        <Card key={room.id} className="transition-colors hover:bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
            <div className="flex items-center gap-3">
              <CardTitle className="text-base font-medium">{room.roomName}</CardTitle>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{memberCounts[room.id] ?? "…"}</span>
              </div>
            </div>
            <Link href={`/room/${room.id}`}>
              <Button variant="outline" size="sm">Open</Button>
            </Link>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}