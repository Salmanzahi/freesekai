// check if curr user is admin


'use client'
import { onAuthStateChanged } from "firebase/auth";
import { auth, firedb } from "@/lib/firebase";
import { getDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
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
        
        return () => unsubscribe();
    }, [router]);
    return <>{loading ?  <LoadingSkeleton/> : children}</>
}


function LoadingSkeleton(){
    return (
        <div className="mt-4 md:mt-24 mx-4">
            <Card className="md:w-3/4 mx-auto">
                <CardHeader>
                    {/* Skeleton for CardTitle */}
                    <Skeleton className="h-6 w-[200px]" />
                </CardHeader>
                <CardContent>
                    {/* Skeleton for CardDescription */}
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-[80%]" />
                </CardContent>
                {/* Skeleton for CardAction/Buttons */}
                <div className="flex items-center justify-center gap-4 p-2 w-full">
                    <Skeleton className="h-10 w-24 rounded-md" />
                    <Skeleton className="h-10 w-24 rounded-md" />
                    <Skeleton className="h-10 w-24 rounded-md" />
                </div>
                <CardFooter>
                    {/* Skeleton for CardFooter text */}
                    <Skeleton className="h-4 w-[120px]" />
                </CardFooter>
            </Card>
        </div>
    )
}