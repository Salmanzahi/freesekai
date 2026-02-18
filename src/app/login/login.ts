import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, firedb } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { createuserproperties } from "../register/register";

export async function loginWithEmailAndPassword(email: string, password: string) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("User logged in:", user);
        window.location.href = "/";
        return user;
    } catch (error) {
        console.error("Error logging in user:", error);
        throw error;
    }
}

export async function loginWithGoogle() {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Check if user document already exists
        const userDocRef = doc(firedb, 'users', user.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (!userDocSnapshot.exists()) {
             // Create user properties if they don't exist (new user via Google Login)
             // Default username to displayName or part of email
            const username = user.displayName || user.email?.split('@')[0] || "User";
            await createuserproperties(username, user.email || "", user.uid, user.photoURL || "", Date.now());
        }

        console.log("User logged in with Google:", user);
        window.location.href = "/";
        return user;
    } catch (error) {
        console.error("Error logging in user with Google:", error);
        throw error;
    }
}