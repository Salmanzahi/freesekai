import { firedb } from "@/lib/firebase";
import { collection, addDoc, setDoc, doc, getDoc, serverTimestamp, query, where, getDocs} from 'firebase/firestore';


export async function handleCreate(roomName: string, keyAccess: string, userId: string) {
    const roomData = {
        roomName,
        keyAccess,
        createdAt: serverTimestamp(),

    }
    try {
        const ref = collection(firedb, 'rooms')
        const roomRef = await addDoc(ref, roomData)
        console.log('Room created successfully')
       await setDoc(doc(ref, roomRef.id, 'members', userId), {
        joinedAt: serverTimestamp(),
       })
       console.log('Member added successfully')
       await setDoc(doc(ref, roomRef.id, 'owner', userId), {
        joinedAt: serverTimestamp(),
       })
       console.log('Owner added successfully')
        return true;
    } 
    catch (e) {
        console.log(e)
        return false;
    }
}

export async function handleJoin(roomName: string, keyAccess: string, userId: string) {
    try {
     const ref = collection(firedb, 'rooms')
     const q = query(ref, where('roomName', '==', roomName))
     const snapshot = await getDocs(q)
     const getSnapshotData = snapshot.docs[0].data()
   

     if (snapshot.empty) {
        console.log('Room not found')
        return {status: false, message: 'room_not_found'} 
     }
       if(getSnapshotData.roomName == roomName && getSnapshotData.keyAccess !== keyAccess) {
        console.log('Invalid Key Access')
        return {status: false, message: 'Invalid Key Access :('} 
     }
     const room = snapshot.docs[0]
     const roomId = room.id
     // check if user is already a member
     const memberRef = doc(firedb, 'rooms', roomId, 'members', userId)
     const memberSnap = await getDoc(memberRef)
     if (memberSnap.exists()) {
        console.log('Valid member')
        return { status: true, message: 'val_member', roomId }
     } else {
        console.log('Member Not Found !')
        return { status: false, message: 'invalid_member', roomId }
     }

    } 
    catch (e) {
        console.log(e)
        return {status: false, message: 'error'};
    }
}