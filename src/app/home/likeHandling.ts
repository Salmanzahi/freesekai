import { firedb } from '@/lib/firebase';
import { deleteDoc, doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
// import { useState, useEffect } from 'react';
// import { isAuth } from '@/lib/isauth';
// import { isAdmin } from '@/lib/isAdmin';
// import { getUserByUid, type UserData } from '@/lib/userProperties';



export async function likeHandling(postId:string, userId: string){
    const checkUser = await checkUserLikeState(postId, userId);
    if(checkUser){
        // remove the collection ( {user_uid}/ )
        await deleteDoc(doc(firedb, 'users', userId, 'liked_post', postId));
        await updateDoc(doc(firedb, 'posts', postId), {
            like: increment(-1)
        });
    }else{
        // add at ref >> {user_uid}/
        await setDoc(doc(firedb, 'users', userId, 'liked_post', postId), {
        });
        await updateDoc(doc(firedb, 'posts', postId), {
            like: increment(1)
        });
    }
}

export async function checkUserLikeState(postId:string, userId: string){
    const ref =  doc(firedb, 'users', userId, 'liked_post', postId);
    const snap = await getDoc(ref);
    if(snap.exists()){
        return true;
    }else{
        return false;
    }
}