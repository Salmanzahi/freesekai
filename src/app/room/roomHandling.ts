import { firedb } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, doc, setDoc, query, where, getDocs} from 'firebase/firestore';


export async function handleCreate(roomName: string, keyAccess: string) {
    const roomData = {
        roomName,
        keyAccess,
        createdAt: serverTimestamp()
    }
    try {
        const ref = collection(firedb, 'rooms')
        await addDoc(ref, roomData)
        console.log('Room created successfully')
        return true;
    } 
    catch (e) {
        console.log(e)
        return false;
    }
}

export async function handleJoin(roomName: string, keyAccess: string) {
    try {
        const ref = collection(firedb, 'rooms')
        const q = query(ref, where('roomName', '==', roomName), where('keyAccess', '==', keyAccess))
        const snapshot = await getDocs(q)
        if (snapshot.empty) {
            console.log('Room not found')
            return false;
        }
        const room = snapshot.docs[0]
        if (room.data().keyAccess !== keyAccess) {
            console.log('Invalid key access')
            return false;
        }
        console.log('Room joined successfully')
        return true;
    } 
    catch (e) {
        console.log(e)
        return false;
    }
    
}