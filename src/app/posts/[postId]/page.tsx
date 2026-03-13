'use client'

import { useParams, useRouter } from "next/navigation";
import { getPost } from "./postFetch";
import { useEffect, useState } from "react";
import { type Post } from '@/global_interface/interface';
import { type Reply } from '@/global_interface/interface';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   ArrowLeft,
//   Clock,
//   MessageCircle,
//   Music,
//   Send,
//   User,
//   Heart,
// } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { newReplies, useUserData } from "@/app/home/cardloadLogic";
// import { auth } from "@/lib/firebase";
// import { likeHandling, checkUserLikeState } from "@/app/home/likeHandling";
import { PostCard } from "@/app/home/cardload"
// ─── Reply Card ────────────────────────────────────────────
function ReplyCard({ reply }: { reply: Reply }) {
  const replyUserData = useUserData(reply.userId);

  const formattedReplyDate = reply.createdAt
    ? new Date(reply.createdAt as unknown as number).toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "numeric",
          year: "numeric",
        }
      )
    : "Just now";

  const formattedReplyTime = reply.createdAt
    ? new Date(reply.createdAt as unknown as number).toLocaleTimeString(
        "en-US",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      )
    : "";

  return (
    <div className="group/reply flex items-start gap-3 p-4 rounded-xl bg-muted/25 border border-border/15 hover:bg-muted/45 hover:border-border/30 transition-all duration-200">
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="absolute -inset-[1.5px] rounded-full bg-gradient-to-br from-purple-500/40 to-pink-500/40" />
        <Avatar className="relative w-8 h-8 ring-1 ring-background">
          <AvatarImage
            src={replyUserData?.photoURL || ""}
            alt={replyUserData?.username || "User"}
          />
          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-[10px] font-bold">
            {(replyUserData?.username || "U").substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground/90 truncate">
            {replyUserData?.username || "Anonymous"}
          </span>
          <span className="text-[11px] text-muted-foreground/60">
            {formattedReplyDate}
            {formattedReplyTime && (
              <>
                <span className="mx-1 text-muted-foreground/30">·</span>
                {formattedReplyTime}
              </>
            )}
          </span>
        </div>
        <p className="text-sm text-foreground/70 leading-relaxed break-words">
          {reply.text}
        </p>
      </div>
    </div>
  );
}

// ─── Loading Skeleton ──────────────────────────────────────
function PostDetailSkeleton() {
  return (
    <div className="min-h-screen px-4 py-8 max-w-2xl mx-auto">
      {/* Back button skeleton */}
      <Skeleton className="h-9 w-24 rounded-lg mb-6 mt-16" />

      {/* Main card skeleton */}
      <Card className="rounded-2xl border border-border/30 bg-card/60 backdrop-blur-sm shadow-sm overflow-hidden">
        <CardHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-11 h-11 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-5 space-y-4">
          <Skeleton className="h-7 w-3/4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
          <Skeleton className="w-full h-56 rounded-xl" />
        </CardContent>
        <Separator className="mx-6 w-auto opacity-30" />
        <CardFooter className="px-6 py-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-20 rounded-lg" />
            <Skeleton className="h-9 w-20 rounded-lg" />
          </div>
        </CardFooter>
      </Card>

      {/* Replies skeleton */}
      <div className="mt-8 space-y-4">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-24 w-full rounded-xl" />
        {[1, 2].map((i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-4 rounded-xl border border-border/15"
          >
            <Skeleton className="w-8 h-8 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PostPage(){
  const params = useParams()
  const router = useRouter()
  const postId = params.postId as string
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchPost = async () => {
      const post = await getPost(postId)
      setPost(post.returnItem)
      setLoading(false)
    }
    fetchPost()
  }, [postId])
  return(
    <div>

      {loading &&  <PostDetailSkeleton/>}
      
      <div className="p-4 mt-16">
           
        <Button className="mb-4" variant='ghost' onClick={() => router.push("/")}>
          <Home /> Back to Home
        </Button>
          {!loading && post && <PostCard key={post.id} post={post} />}
      </div>
     
    </div>
  )
}