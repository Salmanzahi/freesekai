'use server'


import type { User } from "firebase/auth";
import { supabase } from "@/lib/supabase";
import { firedb } from "@/lib/firebase";
import { setDoc, getDoc, doc, query, collection, where, getDocs } from "firebase/firestore";

export type UsernameResult = {
  username: string | null;
  exists: boolean;
};

export async function fetchUsernameByUid(uid: string): Promise<UsernameResult> {
  const docRef = doc(firedb, 'users', uid);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) return { username: null, exists: false };

  const userData = snapshot.data();
  return { username: (userData.username as string) ?? null, exists: true };
}


export async function updateUsername(uid: string, newUsername: string): Promise<{ok: boolean, reason?: string}> {
  const val = await valdateUsername(newUsername);
  if (!val.ok) return {ok: false, reason: val.reason};
  const userRef = doc(firedb, 'users', uid);
  await setDoc(userRef, { username: newUsername }, { merge: true });
  return {ok: true};
}


export async function validateUsername(value: string, min = 5, max = 20): Promise<{ ok: boolean; reason?: string }> {
  if (/[^a-z0-9_]/.test(value)) return { ok: false, reason: "invalid character allowed character: a-z, 0-9, _" };
  if (value.length < min || value.length > max) return { ok: false, reason: "length must be between 5 and 20" };

  const docRef = query(collection(firedb, 'users'), where('username', '==', value));
  const snapshot = await getDocs(docRef);
  if (snapshot.size > 0) return { ok: false, reason: "username already taken" };
  return { ok: true };
}


export async function fetchUsernameForUser(user: User | null | undefined): Promise<UsernameResult> {
  if (!user) return { username: null, exists: false };
  return fetchUsernameByUid(user.uid);
}



export async function changeImageProfile(uid: string, file: File): Promise<string> {

    const filePath = `avatar/${uid}/${Date.now()}_${file.name}`;
    const userRef = doc(firedb, 'users', uid);
    const userSnapshot = await getDoc(userRef);

    // Delete old profile image if it exists
    if (userSnapshot.exists()) {
        const oldUrl: string = userSnapshot.data().photoURL;
        if (oldUrl) {
            const match = oldUrl.match(/media\/(.*)$/);
            if (match && match[1]) {
                await supabase.storage.from("media").remove([match[1]]);
            }
        }
    }

    const { error } = await supabase.storage.from("media").upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
    });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage.from("media").getPublicUrl(filePath);
    const publicUrl = publicUrlData?.publicUrl;
    if (!publicUrl) throw new Error("Failed to get public URL for uploaded image.");

    await setDoc(userRef, { photoURL: publicUrl }, { merge: true });

    return publicUrl;
}


export async function getProfileImageUrl(uid: string): Promise<string | null> {
    const docRef = doc(firedb, 'users', uid);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) return null;

    return (snapshot.data().photoURL as string) ?? null;
}


export async function valdateUsername(username: string): Promise<{ok: boolean, reason?: string}> {
  
  if (/[^A-Za-z0-9_]/.test(username)) return {ok: false, reason: "invalid_chars"};
  if (username.length < 5 || username.length > 20) return {ok: false, reason: "length"};
  const docRef = doc(firedb, 'users', username);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) return {ok: false, reason: "already_taken"};
  return {ok: true};

}


