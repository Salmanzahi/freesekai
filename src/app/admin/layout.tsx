// check if curr user is admin

import { onAuthStateChanged } from "firebase/auth";
import { auth, firedb } from "@/lib/firebase";
import { getDoc, doc } from "firebase/firestore";



export default function AdminLayout({ children }: { children: React.ReactNode }) {
    onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "";
        return;
    }

    const isAdmin = await getDoc(doc(firedb, 'users', user.uid, 'isAdmin'))
    if (!isAdmin.data()?.isAdmin) {
        window.location.href = "";
        return;
    }

});
    return <>{children}</>
}

