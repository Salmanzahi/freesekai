import { createUserWithEmailAndPassword as firebaseCreateUser } from "firebase/auth";
import { rtdb, auth } from "@/lib/firebase"; // adjust path to your firebase config

export async function registerUserWithEmailAndPassword(email: string, password: string) {
  try {
    const userCredential = await firebaseCreateUser(auth, email, password);
    const user = userCredential.user;
    console.log("User registered:", user);
    return user;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}
