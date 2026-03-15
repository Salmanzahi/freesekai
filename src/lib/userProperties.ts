import { UserData } from "@/global_interface/interface";
import { firedb } from "@/lib/firebase";
import { doc, getDoc, Timestamp } from "firebase/firestore";




export async function getUserByUid(uid: string): Promise<UserData | null> {
  const userRef = doc(firedb, 'users', uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  return {
    username: data.username ?? 'Unknown',
    photoURL: data.photoURL ?? null,
    createdAt: data.createdAt ?? Timestamp.now(),
  };
}
