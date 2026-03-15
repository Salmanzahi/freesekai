import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BackComponent } from "@/components/myComponent/backComponent"

const changelog = [
    {
        version: "0.9.2",
        date: "March 14, 2026",
        tag: "Latest",
        changes: [
            { type: "feature", text: "Social profile features — view other profiles, follow/unfollow" },
            { type: "feature", text: "Room member management with kick confirmation" },
            { type: "improvement", text: "Reusable ProfileHeader component (DRY refactor)" },
            { type: "improvement", text: "Navigation menu with 'Other' dropdown & mobile accordion" },
            { type: "fix", text: "Fixed Next.js 15 async params build error" },
        ],
    },
    {
        version: "0.9.1",
        date: "March 12, 2026",
        tag: null,
        changes: [
            { type: "feature", text: "Room system — create, join, and leave rooms" },
            { type: "feature", text: "Post creation with image upload & Spotify embed" },
            { type: "improvement", text: "Like system with optimistic UI updates" },
            { type: "fix", text: "Drawer not closing after navigation" },
        ],
    },
    {
        version: "0.9.0",
        date: "March 10, 2026",
        tag: null,
        changes: [
            { type: "feature", text: "Initial release — anonymous forum with post feed" },
            { type: "feature", text: "User authentication (register, login, sign out)" },
            { type: "feature", text: "Profile page with username & avatar editing" },
            { type: "feature", text: "Reply system on posts" },
            { type: "improvement", text: "Dark mode support" },
        ],
    },
]

const typeConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
    feature: { label: "Feature", variant: "default" },
    improvement: { label: "Improvement", variant: "secondary" },
    fix: { label: "Fix", variant: "outline" },
}

export default function ChangelogPage() {
    return (
        <div className="min-h-screen pt-20 pb-16 px-4">
            <div className="max-w-2xl mx-auto">
                <BackComponent className="mb-6"  />

                {/* Page header */}
                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Changelog</h1>
                    <p className="text-muted-foreground mt-2 text-sm md:text-base">
                        All notable changes and updates to FREESEKAI.
                    </p>
                </div>

                {/* Timeline */}
                <div className="relative">
                    {/* Vertical timeline line */}
                    <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />

                    <div className="space-y-10">
                        {changelog.map((release, idx) => (
                            <div key={release.version} className="relative pl-8">
                                {/* Timeline dot */}
                                <div className={`absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-2 border-background ${
                                    idx === 0
                                        ? "bg-gradient-to-br from-purple-500 to-pink-500"
                                        : "bg-muted-foreground/30"
                                }`} />

                                {/* Version header */}
                                <div className="flex items-center gap-3 mb-4 flex-wrap">
                                    <h2 className="text-xl font-bold">v{release.version}</h2>
                                    {release.tag && (
                                        <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none text-[10px] uppercase tracking-wider">
                                            {release.tag}
                                        </Badge>
                                    )}
                                    <span className="text-sm text-muted-foreground">{release.date}</span>
                                </div>

                                {/* Changes card */}
                                <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
                                    <CardContent className="p-4 md:p-5">
                                        <ul className="space-y-3">
                                            {release.changes.map((change, i) => {
                                                const config = typeConfig[change.type] ?? typeConfig.feature
                                                return (
                                                    <li key={i} className="flex items-start gap-3">
                                                        <Badge
                                                            variant={config.variant}
                                                            className="mt-0.5 shrink-0 text-[10px] uppercase tracking-wider min-w-[80px] justify-center"
                                                        >
                                                            {config.label}
                                                        </Badge>
                                                        <span className="text-sm text-foreground/80 leading-relaxed">
                                                            {change.text}
                                                        </span>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </CardContent>
                                </Card>

                                {idx < changelog.length - 1 && (
                                    <Separator className="mt-10 opacity-0" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}