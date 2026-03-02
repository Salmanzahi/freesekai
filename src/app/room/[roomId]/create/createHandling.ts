'use server'

import { isAuth } from "@/lib/isauth";
import { firedb } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { supabase } from "@/lib/supabase";

export async function isAuthUser() {
    return await isAuth();
}

interface RoomParams {
    roomId: string;
}

interface handlePostParams {
    postData: {
        title: string;
        body: string;
        showProfile: boolean;
        spotifyTrack: string;
        userId: string;
    };
    roomParam: RoomParams;
    imageFile: File | null;
}

export async function handlePost({ postData, roomParam, imageFile }: handlePostParams) {
    const { title, body, showProfile, spotifyTrack, userId } = postData;
    const { roomId } = roomParam;

    const baseDoc = {
        title,
        body,
        showProfile,
        spotifyTrack,
        userId,
        image: null as string | null,
        createdAt: serverTimestamp(),
    };

    try {
            
        const docRef = await addDoc(collection(firedb, 'rooms', roomId, 'posts'), baseDoc);

       
        if (imageFile) {
            const imageUrl = await handleImage(imageFile, userId, roomId);
            await setDoc(doc(firedb, 'rooms', roomId, 'posts', docRef.id), {
                ...baseDoc,
                id: docRef.id,
                image: imageUrl ?? null,
            }, { merge: true });
        } else {
            await setDoc(doc(firedb, 'rooms', roomId, 'posts', docRef.id), {
                ...baseDoc,
                id: docRef.id,
            }, { merge: true });
        }

       try {
        await setDoc(
            doc(firedb, 'users', userId, 'rooms', roomId, 'posts', docRef.id),
            { created: true, createdAt: serverTimestamp() }
        );
        console.log('saved on user Properties successfully');
       } catch (error) {
        console.error("setDoc error:", error);
       }

        // console.log("Post created successfully with ID:", docRef.id);
        return true;
    } catch (error) {
        console.error("handlePost error:", error);
        return false;
    }
}

async function handleImage(image: File, userId: string, roomId: string) {
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

export async function deletePost(postId: string, roomParam: RoomParams) {
    // TODO
}

export async function likePost() {
    // TODO
}