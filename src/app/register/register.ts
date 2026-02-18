import { createUserWithEmailAndPassword as firebaseCreateUser, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, firedb } from "@/lib/firebase";
import { setDoc, doc, getDoc } from "firebase/firestore";

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



export async function registerWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Check if user document already exists
    const userDocRef = doc(firedb, 'users', user.uid);
    const userDocSnapshot = await getDoc(userDocRef);

    if (!userDocSnapshot.exists()) {
      // Create user properties if they don't exist (new user via Google)
      // Default username to displayName or part of email
      const username = user.displayName || user.email?.split('@')[0] || "User"; 
      await createuserproperties(username, user.email || "", user.uid, user.photoURL || "", Date.now());
    }

    console.log("User registered/logged in with Google:", user);
    window.location.href = "/"; // Redirect to home on success
    return user;
  } catch (error) {
    console.error("Error with Google registration:", error);
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
  }, { merge: true }); // Use merge to be safe, though setDoc overwrites by default without it
  console.log("User properties successfully created/updated");

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