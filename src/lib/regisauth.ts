 import { onAuthStateChanged
  } from "firebase/auth";
import { auth } from  '@/lib/firebase'
 
export const checkAuthUser = async () => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(user);
      } else {
        reject(new Error("User not authenticated"));
      }
    });
  });
}