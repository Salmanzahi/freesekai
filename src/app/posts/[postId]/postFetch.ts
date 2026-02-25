'use server'

import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { firedb } from "@/lib/firebase";
import { type Post, type Reply} from "@/app/home/cardloadLogic";
import {getUserByUid} from "@/lib/userProperties";


export async function getPost(postId: string) {
    const postRef = await getDoc(doc(firedb, "posts", postId));
    const replyRef = await getDocs(collection(firedb, "posts", postId, "replies"));
    const getUserProps = await getUserByUid(postRef.data()?.userId);
    // console.log(getUserProps)
    const repliesArray =  replyRef.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toMillis(),
    })) as Reply[];
    console.log('fetched post data', postRef.data())
    const returnItem = {
        ...postRef.data(),
        image: getUserProps?.photoURL ?? null,
        userId: getUserProps?.username ?? 'Unknown',
        createdAt: postRef.data()?.createdAt.toMillis(),
    } as Post;
    return  {returnItem, repliesArray };
}