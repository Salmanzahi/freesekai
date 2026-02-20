'use server'


import { isAuth } from "@/lib/isauth";
import { firedb} from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, doc, setDoc} from 'firebase/firestore';
import { supabase } from "@/lib/supabase";
 export async function isAuthUser(){
    return await isAuth();
 }

interface PostData {
    title: string;
    content: string;
    image: File | null;
    showProfile: boolean;
    spotifyTrack: string;
    userId: string;
}

interface RoomParams {
    roomId: string;
}

interface handlePostParams {
    postData: PostData;
    roomParam: RoomParams;
}

export async function handlePost({postData, roomParam}: handlePostParams){
    const {title, content, image, showProfile, spotifyTrack, userId} = postData;
    const {roomId} = roomParam;
    

    try {
    //add to main posts collection
    const docRef = await addDoc(collection(firedb,'rooms', roomId, 'posts'), postData);
    if (image){
        const imageUrl = await handleImage(image, userId, roomId);
        await setDoc(doc(firedb, 'rooms', roomId, 'posts', docRef.id), {
            ...postData,
            image: imageUrl,

        }, {merge: true});
    } else {
        await setDoc(doc(firedb, 'rooms', roomId, 'posts', docRef.id), {
            ...postData,
        }, {merge: true});
    }
    //add to user prop >> Optimizing fethcing
    await setDoc(doc(firedb, 'users', userId, 'rooms', roomId, 'posts',docRef.id), {created: true, createdAt: serverTimestamp()});
    console.log("Post created successfully with ID:", docRef.id);
    return true;
    } catch (error) {
        console.log(error);
        return false;
    }
 }

  async function handleImage(image: File | null, userId: string, roomId: string){
    if(!image) return;
    const filePath = `posts/room/${roomId}/${userId}/${Date.now()}_${image.name}`;
    const { error } = await supabase.storage.from("media").upload(filePath, image, {
        cacheControl: "3600",
        upsert: true,
    });
    if (error) throw error;
    const { data: publicUrlData } = supabase.storage.from("media").getPublicUrl(filePath);
    const publicUrl = publicUrlData?.publicUrl;
    if (!publicUrl) throw new Error("Failed to get public URL for uploaded image.");
    return publicUrl;
 }


