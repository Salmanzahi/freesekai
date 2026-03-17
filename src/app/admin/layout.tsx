// check if curr user is admin


'use client'
import { onAuthStateChanged } from "firebase/auth";
import { auth, firedb } from "@/lib/firebase";
import { getDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    onAuthStateChanged(auth, async (user) => {
    if (!user) {
        router.push('/')
        return;
    }

    const isAdmin = await getDoc(doc(firedb, 'users', user.uid ))
    if (!isAdmin.data()?.isAdmin) {
        router.push('/')
        return;
    }
    setLoading(false);

});
    return <>{loading ? <div>loading...</div> : children}</>
}

