'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { verifyRoomAccess, type RoomData } from '../roomHandling'
import { RoomProvider } from './roomContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export default function RoomLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const params = useParams()
  const roomId = params.roomId as string

  const [loading, setLoading] = useState(true)
  const [room, setRoom] = useState<RoomData | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [accessDenied, setAccessDenied] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setAccessDenied('no_auth')
        setLoading(false)
        return
      }

      setUserId(user.uid)
      const result = await verifyRoomAccess(roomId, user.uid)

      if (!result.authorized) {
        setAccessDenied(result.reason)
        setLoading(false)
        return
      }

      setRoom(result.room)
      setAccessDenied(null)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [roomId])

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

  if (accessDenied) {
    return (
      <div className="p-4 mt-24 max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Access Denied</CardTitle>
            <CardDescription>
              {accessDenied === 'no_auth' && 'You need to sign in to access this room.'}
              {accessDenied === 'not_member' && 'You are not a member of this room.'}
              {accessDenied === 'room_not_found' && 'This room does not exist.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            {accessDenied === 'no_auth' ? (
              <Button onClick={() => router.push('/login')}>Sign In</Button>
            ) : (
              <Button onClick={() => router.push('/room')}>Back to Rooms</Button>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!room || !userId) return null

  return (
    <RoomProvider room={room} userId={userId}>
      {children}
    </RoomProvider>
  )
}
