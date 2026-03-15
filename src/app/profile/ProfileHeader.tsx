"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import {
    Card,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import type { ReactNode } from "react"

// ---------- Stats Bar ----------
export interface StatItem {
    label: string
    value: number
    onClick?: () => void
}

/**
 * Stats bar component
 * 
 * @param stats - Array of stat items to display
 * @returns Stats bar component
 * 
 */

export function ProfileStatsBar({ stats }: { stats: StatItem[] }) {
    return (
        <>
            <div className="flex items-center justify-around w-full mt-6 mb-2">
                {stats.map((stat, i) => (
                    <div key={stat.label} className="contents">
                        {i > 0 && (
                            <Separator orientation="vertical" className="h-8 bg-border/60" />
                        )}
                        <div
                            className={`flex flex-col items-center hover:bg-muted/50 p-2 rounded-lg transition-colors flex-1${stat.onClick ? " cursor-pointer" : ""}`}
                            onClick={stat.onClick}
                        >
                            <span className="font-bold text-xl">{stat.value}</span>
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">
                                {stat.label}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            <Separator className="mt-2" />
        </>
    )
}

// ---------- Profile Header ----------
export interface ProfileHeaderProps {
    /** Title shown at the top, e.g. "Your Profile" or "Profile" */
    title: string
    /** URL for the avatar image */
    avatarSrc?: string | null
    /** Fallback character(s) shown when avatarSrc is unavailable */
    avatarFallback?: string
    /** Whether the profile data is still loading */
    loading?: boolean
    /** Stats to render in the bar (following, followers, posts, etc.) */
    stats: StatItem[]

    /**
     * Rendered to the right of the avatar (username, email, follow button, etc.).
     * Pass `null` to skip the info area entirely.
     */
    infoContent?: ReactNode

    /**
     * Optional overlay rendered on top of the avatar (e.g. the edit-picture button).
     */
    avatarOverlay?: ReactNode

    /**
     * Optional content rendered between the info area and the stats bar
     * (e.g. alerts, edit forms, etc.)
     */
    extraContent?: ReactNode
}

export function ProfileHeader({
    title,
    avatarSrc,
    avatarFallback = "U",
    loading = false,
    stats,
    infoContent,
    avatarOverlay,
    extraContent,
}: ProfileHeaderProps) {
    return (
        <Card className="bg-transparent border-none shadow-none">
            <CardHeader>
                <CardTitle className="text-left text-xl px-4">{title}</CardTitle>

                <div className="my-4 w-full flex flex-row justify-between items-center px-4">
                    {/* Avatar */}
                    <div className="relative">
                        <Avatar className="h-24 w-24 items-center justify-center">
                            <AvatarImage src={avatarSrc ?? undefined} />
                            <AvatarFallback>{avatarFallback}</AvatarFallback>
                        </Avatar>
                        {avatarOverlay}
                    </div>

                    {/* Info area (username / follow button / email / skeleton) */}
                    <div className="text-right flex flex-col items-end gap-2">
                        {loading ? (
                            <div className="space-y-2 flex flex-col items-end">
                                <Skeleton className="h-6 w-48" />
                            </div>
                        ) : (
                            infoContent
                        )}
                    </div>
                </div>

                {extraContent}

                <ProfileStatsBar stats={stats} />
            </CardHeader>
        </Card>
    )
}
