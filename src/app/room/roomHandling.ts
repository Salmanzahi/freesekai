import { firedb } from "@/lib/firebase";
import {
  collection, addDoc, setDoc, doc, getDoc,
  serverTimestamp, query, where, getDocs, deleteDoc, Timestamp
} from 'firebase/firestore';

export interface RoomData {
  id: string;
  roomName: string;
  createdAt: Timestamp;
}

export interface RoomAccessResult {
  authorized: boolean;
  room: RoomData | null;
  reason: 'ok' | 'no_auth' | 'room_not_found' | 'not_member';
}

export async function handleCreate(roomName: string, keyAccess: string, userId: string) {
  const roomData = {
    roomName,
    keyAccess,
    createdAt: serverTimestamp(),
  }
  try {
    const ref = collection(firedb, 'rooms')
    const roomRef = await addDoc(ref, roomData)
    await setDoc(doc(ref, roomRef.id, 'members', userId), {
      joinedAt: serverTimestamp(),
      role: 'owner',
    })
    return { status: true, roomId: roomRef.id };
  }
  catch (e) {
    console.log(e)
    return { status: false, roomId: null };
  }
}


export async function handleJoin(roomName: string, keyAccess: string, userId: string) {
  try {
    const ref = collection(firedb, 'rooms')
    const q = query(ref, where('roomName', '==', roomName))
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      return { status: false, message: 'room_not_found', roomId: null }
    }

    const roomDoc = snapshot.docs[0]
    const data = roomDoc.data()

    if (data.keyAccess !== keyAccess) {
      return { status: false, message: 'invalid_key', roomId: null }
    }

    const roomId = roomDoc.id
    const memberRef = doc(firedb, 'rooms', roomId, 'members', userId)
    const memberSnap = await getDoc(memberRef)

    if (memberSnap.exists()) {
      return { status: true, message: 'already_member', roomId }
    }

    await setDoc(memberRef, {
      joinedAt: serverTimestamp(),
      role: 'member',
    })
    return { status: true, message: 'joined', roomId }
  }
  catch (e) {
    console.log(e)
    return { status: false, message: 'error', roomId: null };
  }
}

/**
 * Verify if a user has access to a room.
 * @param roomId The ID of the room to verify access for.
 * @param userId The ID of the user to verify access for.
 * @returns A promise that resolves to a RoomAccessResult object.
 */
export async function verifyRoomAccess(roomId: string, userId: string | null): Promise<RoomAccessResult> {
  if (!userId) {
    return { authorized: false, room: null, reason: 'no_auth' }
  }

  try {
    const roomRef = doc(firedb, 'rooms', roomId)
    const roomSnap = await getDoc(roomRef)

    if (!roomSnap.exists()) {
      return { authorized: false, room: null, reason: 'room_not_found' }
    }

    const memberRef = doc(firedb, 'rooms', roomId, 'members', userId)
    const memberSnap = await getDoc(memberRef)

    if (!memberSnap.exists()) {
      return { authorized: false, room: null, reason: 'not_member' }
    }

    const data = roomSnap.data()
    return {
      authorized: true,
      room: {
        id: roomSnap.id,
        roomName: data.roomName,
        createdAt: data.createdAt,
      },
      reason: 'ok',
    }
  } catch (e) {
    console.log(e)
    return { authorized: false, room: null, reason: 'room_not_found' }
  }
}

export async function getUserRooms(userId: string): Promise<RoomData[]> {
  try {
    const roomsRef = collection(firedb, 'rooms')
    const roomsSnap = await getDocs(roomsRef)
    const rooms: RoomData[] = []

    for (const roomDoc of roomsSnap.docs) {
      const memberRef = doc(firedb, 'rooms', roomDoc.id, 'members', userId)
      const memberSnap = await getDoc(memberRef)
      if (memberSnap.exists()) {
        const data = roomDoc.data()
        rooms.push({
          id: roomDoc.id,
          roomName: data.roomName,
          createdAt: data.createdAt,
        })
      }
    }

    return rooms
  } catch (e) {
    console.log(e)
    return []
  }
}

export async function leaveRoom(roomId: string, userId: string) {
  try {
    const memberRef = doc(firedb, 'rooms', roomId, 'members', userId)
    await deleteDoc(memberRef)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

export async function getRoomMembers(roomId: string) {
  try {
    const membersRef = collection(firedb, 'rooms', roomId, 'members')
    const snap = await getDocs(membersRef)
    return snap.docs.map(d => ({
      uid: d.id,
      ...d.data(),
    }))
  } catch (e) {
    console.log(e)
    return []
  }
}