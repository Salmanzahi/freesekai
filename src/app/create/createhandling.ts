'use server'


import { isAuth } from "@/lib/isauth";
import { firedb} from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, doc, setDoc} from 'firebase/firestore';
import { supabase } from "@/lib/supabase";
import { trackData } from "@/global_interface/interface";

 export async function isAuthUser(){
    return await isAuth();
 }


 export async function handlePost(title: string, body: string, image: File | null, showProfile: boolean, songTrack: trackData | null, userId: string){
    const postData = {
        title,
        body,
        showProfile,
        songTrack : songTrack as trackData,
        createdAt: serverTimestamp(),
        userId: userId
    }

    try {
    //add to main posts collection
    const docRef = await addDoc(collection(firedb, 'posts'), postData);
    if (image){
        const imageUrl = await handleImage(image, userId);
        await setDoc(doc(firedb, 'posts', docRef.id), {
            ...postData,
            image: imageUrl,

        }, {merge: true});
    } else {
        await setDoc(doc(firedb, 'posts', docRef.id), {
            ...postData,
        }, {merge: true});
    }
    //add to user prop >> Optimizing fethcing
    await setDoc(doc(firedb, 'users', userId, 'posts',docRef.id), {created: true, createdAt: serverTimestamp()});
    console.log("Post created successfully with ID:", docRef.id);
    return true;
    } catch (error) {
        console.log(error);
        return false;
    }
 }

  async function handleImage(image: File | null, userId: string){
    if(!image) return;
    const filePath = `posts/${userId}/${Date.now()}_${image.name}`;
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



//  async function deleteImage()

 export async function handleMusic(query: string){
    try {
    const formattedquery = query.replace(/\s+/g, "+");
    console.log(formattedquery)
    const api =  await fetch(`https://itunes.apple.com/search?term=${formattedquery}&entity=song&limit=1`)
    const data = await api.json()
    console.log(data)
    const trackData = data.results[0];
    return {status:true, content: trackData as trackData};

    } catch(e){
        return {status:false, content: e}
    }
   

 }

 


