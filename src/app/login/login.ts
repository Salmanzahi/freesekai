import { createUserWithEmailAndPassword as firebaseCreateUser } from "firebase/auth";
import { auth } from "@/lib/firebase";



export async function loginWithGoogle(email: string, password: string){
    try {
        const userCredential = await firebaseCreateUser(auth, email, password);
        const user = userCredential.user;
        console.log("User logged in:", user);
        // direct user to home page
        window.location.href = "/";
        return user;
      } catch (error) {
        console.error("Error logging in user:", error);
        throw error;
      }
}