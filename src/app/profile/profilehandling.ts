import { ref, get, set } from "firebase/database";
import type { User } from "firebase/auth";
import { rtdb } from "@/lib/firebase";
import { supabase } from "@/lib/supabase";

export type UsernameResult = {
  username: string | null;
  exists: boolean;
};

/**
 * Fetch username for a given uid from RTDB.
 * Returns an object with the username (or null) and whether the node existed.
 */
export async function fetchUsernameByUid(uid: string): Promise<UsernameResult> {
  const userRef = ref(rtdb, `users/${uid}/username`);
  const snapshot = await get(userRef);
  if (!snapshot.exists()) return { username: null, exists: false };
  return { username: snapshot.val() as string, exists: true };
}

/**
 * Update username for a given uid in RTDB.
 */
export async function updateUsername(uid: string, newUsername: string): Promise<void> {
  const userRef = ref(rtdb, `users/${uid}/username`);
  await set(userRef, newUsername);
}

/**
 * Validate a username according to project rules.
 * - only letters, numbers and underscore
 * - length between min and max inclusive
 */
export function validateUsername(value: string, min = 5, max = 20): { ok: boolean; reason?: string } {
  if (/[^A-Za-z0-9_]/.test(value)) return { ok: false, reason: "invalid_chars" };
  if (value.length < min || value.length > max) return { ok: false, reason: "length" };
  return { ok: true };
}

/**
 * Convenience: fetch username for a firebase User object (handles nulls).
 */
export async function fetchUsernameForUser(user: User | null | undefined): Promise<UsernameResult> {
  if (!user) return { username: null, exists: false };
  return fetchUsernameByUid(user.uid);
}



/**
 * Uploads a profile image file to the Supabase "media" bucket and updates the user's profileImage URL in RTDB.
 * @param uid - The user's unique id.
 * @param file - The image file to upload.
 * @returns The public URL of the uploaded image.
 */
export async function changeImageProfile(uid: string, file: File): Promise<string> {

    const filePath = `avatar/${uid}/${Date.now()}_${file.name}`;
    // Delete old profile image if it exists
    const userImageRefOld = ref(rtdb, `users/${uid}/profileImage`);
    const oldImageSnapshot = await get(userImageRefOld);
    if (oldImageSnapshot.exists()) {
        const oldUrl: string = oldImageSnapshot.val();
        // Extract the path after the bucket name (media/)
        const match = oldUrl.match(/media\/(.*)$/);
        if (match && match[1]) {
            await supabase.storage.from("media").remove([match[1]]);
        }
    }

    const { data, error } = await supabase.storage.from("media").upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
    });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage.from("media").getPublicUrl(filePath);
    const publicUrl = publicUrlData?.publicUrl;
    if (!publicUrl) throw new Error("Failed to get public URL for uploaded image.");

    const userImageRef = ref(rtdb, `users/${uid}/profileImage`);
    await set(userImageRef, publicUrl);

    return publicUrl;
}


export async function getProfileImageUrl(uid: string): Promise<string | null> {
    const userImageRef = ref(rtdb, `users/${uid}/profileImage`);
    const snapshot = await get(userImageRef);
    if (!snapshot.exists()) return null;
    return snapshot.val() as string;
}