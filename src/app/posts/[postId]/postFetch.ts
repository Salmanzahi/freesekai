

import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { firedb } from "@/lib/firebase";
import { type Post } from '@/global_interface/interface';
import { type Reply } from '@/global_interface/interface';
import {getUserByUid} from "@/lib/userProperties";
import { useDebugValue } from "react";


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
        id: postRef.id,
    } as Post;
    const photoURL = getUserProps?.photoURL ?? null;
    return  {returnItem, repliesArray, photoURL };
}
