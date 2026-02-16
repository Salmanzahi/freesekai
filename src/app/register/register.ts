import { createUserWithEmailAndPassword as firebaseCreateUser } from "firebase/auth";
import { auth, firedb } from "@/lib/firebase";
import { setDoc, doc} from "firebase/firestore";

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
  try {
     await setDoc(doc(firedb, 'users', uid), {
    username,
    email,
    uid,
    photoURL,
    create_at,
    isAdmin
  });
  console.log("User properties succefully created");

  } catch (error) {
    console.error("Error creating user properties:", error);
    throw error;
  }
 
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