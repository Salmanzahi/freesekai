import { firedb } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export interface UserData {
  username: string;
  photoURL: string | null;
}

export async function getUserByUid(uid: string): Promise<UserData | null> {
  const userRef = doc(firedb, 'users', uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  return {
    username: data.username ?? 'Unknown',
    photoURL: data.photoURL ?? null,
  };
}
