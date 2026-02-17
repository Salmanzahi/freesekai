'use server'


import { isAuth } from "@/lib/isauth";
import { firedb } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

 export async function isAuthUser(){
    return await isAuth();
 }


 export async function handlePost(title: string, body: string, image: File | null, showProfile: boolean, spotifyTrack: string, userId: string){
    const postData = {
        title,
        body,
        image: image ? image.name : null,
        showProfile,
        spotifyTrack,
        createdAt: serverTimestamp(),
        userId: userId
    }

    try {
    const docRef = await addDoc(collection(firedb, 'posts'), postData);
    console.log("Post created successfully with ID:", docRef.id);
    return true;
    } catch (error) {
        console.log(error);
        return false;
    }
 }
