"use client"

import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackComponent({ className, route }: { className?: string; route?: string }) {
    const router = useRouter()
    return (
        <Button className={className} variant="ghost" onClick={() => route ? router.push(route) : router.back()}>
            <ArrowLeft />
            Back
        </Button>
    )
}