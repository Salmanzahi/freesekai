import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, firedb } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { createuserproperties } from "../register/register";

export async function loginWithEmailAndPassword(emailOrUsername: string, password: string) {
    try {
        let emailToUse = emailOrUsername;

        // If missing '@', assume it's a username and query Firestore for the user's email
        if (!emailOrUsername.includes('@')) {
            const usersRef = collection(firedb, 'users');
            const q = query(usersRef, where('username', '==', emailOrUsername));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                throw new Error("No user found with that username.");
            }

            // Username should be unique, so just get the email of the first match
            emailToUse = querySnapshot.docs[0].data().email;
        }

        const userCredential = await signInWithEmailAndPassword(auth, emailToUse, password);
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