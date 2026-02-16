import { auth } from "@/lib/firebase";




export async function isAuth(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
 
        const unsubscribe = auth.onAuthStateChanged((user) => {
        
            unsubscribe();

            resolve(user !== null);
        });
    });
}