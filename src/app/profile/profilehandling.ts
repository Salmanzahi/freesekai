'use client'


import type { User } from "firebase/auth";
import { supabase } from "@/lib/supabase";
import { firedb } from "@/lib/firebase";
import { setDoc, getDoc, doc } from "firebase/firestore";

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


export async function updateUsername(uid: string, newUsername: string): Promise<void> {
  const userRef = doc(firedb, 'users', uid);
  await setDoc(userRef, { username: newUsername }, { merge: true });
}


export function validateUsername(value: string, min = 5, max = 20): { ok: boolean; reason?: string } {
  if (/[^A-Za-z0-9_]/.test(value)) return { ok: false, reason: "invalid_chars" };
  if (value.length < min || value.length > max) return { ok: false, reason: "length" };
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




