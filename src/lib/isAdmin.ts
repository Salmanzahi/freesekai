import { rtdb } from "@/lib/firebase";
import { ref, get } from "firebase/database";


export async function isAdmin(postId: string): Promise<boolean> {
    const postref = await get(ref(rtdb, `messages/${postId}/userId`));
    const checkuser = await get(ref(rtdb, `users/${postref.val()}/isAdmin`));
    const checkuseradmin = checkuser.val();
   if (checkuseradmin === true) {
    return true;
   } else {
    return false;
   }
}
