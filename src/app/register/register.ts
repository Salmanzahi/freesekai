import { createUserWithEmailAndPassword as firebaseCreateUser } from "firebase/auth";
import { rtdb, auth } from "@/lib/firebase";
import { ref, set } from "firebase/database";


export async function registerUserWithEmailAndPassword(email: string, password: string, username: string) {
  try {
    const userCredential = await firebaseCreateUser(auth, email, password);
    const user = userCredential.user;
    await createuserproperties(username, user.email || "", user.uid, user.photoURL || "", Date.now());
    console.log("User registered:", user);
    window.location.href = "/login";
    return user;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}



export async function createuserproperties(username: string, email: string, uid: string, photoURL: string, create_at: number, isAdmin: boolean = false) {
  const userRef = ref(rtdb, `users/${uid}`);
  await set(userRef, {
    username,
    email,
    uid,
    photoURL,
    create_at,
    isAdmin
  });
}
//  export async function checkAuthUser() {
//   return new Promise((resolve, reject) => {
//     onAuthStateChanged(auth, (user) => {

//       if (user) {
//         resolve(user);
//       } else {
//         reject(new Error("User not authenticated"));
//       }
//     });
//   });
// }