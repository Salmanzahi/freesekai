'use client'

import { createContext, useContext } from 'react'
import type { RoomData } from '../roomHandling'

interface RoomContextValue {
  room: RoomData
  userId: string
}

const RoomContext = createContext<RoomContextValue | null>(null)

export function RoomProvider({ room, userId, children }: RoomContextValue & { children: React.ReactNode }) {
  return (
    <RoomContext.Provider value={{ room, userId }}>
      {children}
    </RoomContext.Provider>
  )
}

export function useRoom() {
  const ctx = useContext(RoomContext)
  if (!ctx) throw new Error('useRoom must be used within RoomProvider')
  return ctx
}
