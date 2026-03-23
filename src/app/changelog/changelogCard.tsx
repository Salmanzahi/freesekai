import { Changelog } from "./changelogHandling";
import { Card, CardContent } from "@/components/ui/card";

export function ChangelogCard({changelog}: {changelog: Changelog}){
    return (
        <div>
        <Card>
            <CardContent>
                {changelog.title}
                {changelog.content}
                {changelog.version}
                {changelog.createdAt?.toDate().toDateString()}
            </CardContent>
        </Card>
        </div>
    )
}