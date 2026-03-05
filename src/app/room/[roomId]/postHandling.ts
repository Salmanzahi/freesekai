'use server'
import { firedb } from '@/lib/firebase';
import { collection, getDocs, onSnapshot, deleteDoc, doc, updateDoc, increment, setDoc, getDoc, addDoc } from 'firebase/firestore';
// import { isAuth } from '@/lib/isauth';
// import { isAdmin } from '@/lib/isAdmin';
// import { getUserByUid, type UserData } from '@/lib/userProperties';
import type { Post } from '@/global_interface/interface';
import type { Reply } from '@/global_interface/interface';


/**
 * Fetch all post from a specified room 
 * @param roomId 
 * @returns 
 */
export async function roomPosts(roomId: string){
    const postRef = collection(firedb, 'rooms', roomId, 'posts')
    const snapshot = await getDocs(postRef)
    const postArray = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate()
    })) as Post[];
    return postArray
}

export async function replyPosts(roomId: string, postId: string){
    const repliesRef = collection(firedb, 'rooms', roomId, 'posts', postId, 'replies')
    const snapshot = await getDocs(repliesRef)
    const replyArray = snapshot.docs.map(doc => ({
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate()
    })) as Reply[];
    return replyArray
}


export async function submitReply(roomId: string, postId: string, content: string, userId: string){
    try {
        const repliesRef = collection(firedb, 'rooms', roomId, 'posts', postId, 'replies')
        await addDoc(repliesRef, {
            createdAt: new Date(),
            content,
            userId,
        })
        console.log('Reply added successfully')
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export async function deleteReply(roomId: string, postId: string, replyId: string){
    try {
        const repliesRef = collection(firedb, 'rooms', roomId, 'posts', postId, 'replies')
        await deleteDoc(doc(repliesRef, replyId))
        console.log('Reply deleted successfully ')
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}


export async function likeHandlingRoom(postId:string, userId: string, roomId: string){
    console.log(postId, userId)
    const checkUser = await checkUserLikeState(postId, userId, roomId);

    if(checkUser){
        // remove the collection ( {user_uid}/ )
        await deleteDoc(doc(firedb, 'users', userId, 'rooms', roomId, 'liked_post', postId));
        await updateDoc(doc(firedb, 'rooms', roomId, 'posts', postId), {
            like: increment(-1)
        });
      return false

    }else{
        // add at ref >> {user_uid}/
        await setDoc(doc(firedb, 'users', userId, 'rooms', roomId, 'liked_post', postId), {
        });
        await updateDoc(doc(firedb, 'rooms', roomId, 'posts', postId), {
            like: increment(1)
        });
    
     return true 

 
    }
}

export async function checkUserLikeState(postId:string, userId: string, roomId: string){
    const ref =  doc(firedb, 'users', userId, 'rooms', roomId, 'liked_post', postId);
    const snap = await getDoc(ref);
    if(snap.exists()){
        return true;
    }else{
        return false;
    }
}


export async function deletePost(postId:string, roomId: string, userId: string){
    try {
        await deleteDoc(doc(firedb, 'users', userId, 'rooms', roomId, 'posts', postId));
        await deleteDoc(doc(firedb, 'rooms', roomId, 'posts', postId));
        return true;
    } catch (e){
        console.log(e);
        return false;
    }
}

