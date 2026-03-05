'use client'

import { useParams } from "next/navigation";
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

// // ─── Main Post Page ────────────────────────────────────────
// export default function PostPage() {
//   const params = useParams();
//   const postId = params.postId as string;
//   const [post, setPost] = useState<Post | null>(null);
//   const [replies, setReplies] = useState<Reply[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [replyText, setReplyText] = useState("");
//   const [liked, setLiked] = useState(false);
//   const [photoURL, setPhotoURL] = useState<string | null>(null);

//   useEffect(() => {
//     setLoading(true);
//     getPost(postId)
//       .then((data) => {
//         setPost(data.returnItem);
//         setReplies(data.repliesArray);
//         setPhotoURL(data.photoURL);
//       })
//       .finally(() => setLoading(false));
//   }, [postId]);

//   useEffect(() => {
//     const user = auth.currentUser?.uid;
//     if (user && postId) {
//       checkUserLikeState(postId, user).then((state) => {
//         setLiked(state);
//       });
//     }
//   }, [postId]);

//   const handleSendReply = async () => {
//     const user = auth.currentUser;
//     if (replyText.trim() && user) {
//       await newReplies(postId, replyText, user.uid);
//       setReplyText("");
//       // Refresh replies
//       const data = await getPost(postId);
//       setReplies(data.repliesArray);
//     } else if (!user) {
//       alert("Please login to reply");
//     }
//   };

//   const handleLikePost = async () => {
//     const user = auth.currentUser;
//     if (user) {
//       await likeHandling(postId, user.uid);
//       const newState = await checkUserLikeState(postId, user.uid);
//       setLiked(newState);
//     } else {
//       alert("Please login to like a post");
//     }
//   };

//   if (loading) {
//     return <PostDetailSkeleton />;
//   }

//   if (!post) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
//         <div className="text-6xl">😕</div>
//         <h1 className="text-2xl font-bold text-foreground">Post not found</h1>
//         <p className="text-muted-foreground text-center">
//           The post you&apos;re looking for doesn&apos;t exist or has been
//           deleted.
//         </p>
//         <Button asChild variant="outline" className="rounded-lg mt-2">
//           <Link href="/">
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back to Home
//           </Link>
//         </Button>
//       </div>
//     );
//   }

//   // Format dates — createdAt comes as millis from postFetch
//   const formattedDate = post.createdAt
//     ? new Date(post.createdAt as unknown as number).toLocaleDateString(
//         "en-US",
//         {
//           month: "long",
//           day: "numeric",
//           year: "numeric",
//         }
//       )
//     : "Just now";

//   const formattedTime = post.createdAt
//     ? new Date(post.createdAt as unknown as number).toLocaleTimeString(
//         "en-US",
//         {
//           hour: "2-digit",
//           minute: "2-digit",
//         }
//       )
//     : "";

//   // post.userId is actually the username from postFetch (mapped via getUserByUid)
//   // post.image is actually the user's photoURL from postFetch
//   const username = post.userId || "Unknown";
//   const userAvatar = photoURL || "";

//   return (
//     <div className="min-h-screen px-4 py-8 max-w-2xl mx-auto">
//       {/* ── Back Navigation ── */}
//       <div className="mt-16 mb-6">
//         <Button
//           asChild
//           variant="ghost"
//           size="sm"
//           className="rounded-lg text-muted-foreground hover:text-foreground transition-colors px-3 h-9"
//         >
//           <Link href="/">
//             <ArrowLeft className="w-4 h-4 mr-1.5" />
//             Back to posts
//           </Link>
//         </Button>
//       </div>

//       {/* ── Main Post Card ── */}
//       <Card className="group relative rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-lg hover:border-border/60 transition-all duration-300 ease-out overflow-hidden gap-0">
//         {/* Gradient accent line */}
//         <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500/60 via-pink-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

//         {/* ── Header: Avatar + User Info + Date ── */}
//         <CardHeader className="px-6 pt-6 pb-3 gap-0">
//           <div className="flex items-center gap-3">
//             {/* Avatar with gradient ring */}
//             <div className="relative shrink-0">
//               <div className="absolute -inset-[2px] rounded-full bg-gradient-to-br from-purple-500 to-pink-500 opacity-60" />
//               <Avatar className="relative w-11 h-11 ring-2 ring-background">
//                 <AvatarImage src={userAvatar} alt={username} />
//                 <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-500 text-white text-sm font-bold">
//                   {username.substring(0, 2).toUpperCase()}
//                 </AvatarFallback>
//               </Avatar>
//             </div>

//             {/* Name + timestamp */}
//             <div className="flex flex-col min-w-0">
//               <div className="flex items-center gap-2">
//                 <span className="text-sm font-semibold text-foreground truncate">
//                   {username}
//                 </span>
//                 {post.showProfile && (
//                   <Badge
//                     variant="secondary"
//                     className="text-[10px] px-1.5 py-0"
//                   >
//                     <User className="w-2.5 h-2.5 mr-0.5" />
//                     Public
//                   </Badge>
//                 )}
//               </div>
//               <div className="flex items-center gap-1 text-xs text-muted-foreground">
//                 <Clock className="w-3 h-3" />
//                 <span>{formattedDate}</span>
//                 {formattedTime && (
//                   <>
//                     <span className="text-muted-foreground/40">·</span>
//                     <span>{formattedTime}</span>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         </CardHeader>

//         {/* ── Content ── */}
//         <CardContent className="px-6 pb-5 pt-1 space-y-4">
//           {/* Title */}
//           <CardTitle className="text-xl md:text-2xl font-bold tracking-tight text-foreground leading-snug">
//             {post.title}
//           </CardTitle>

//           {/* Body */}
//           {post.body && (
//             <div
//               className="text-[15px] text-foreground/80 font-normal leading-relaxed break-words [&_p]:mb-2 [&_p:last-child]:mb-0"
//               dangerouslySetInnerHTML={{ __html: post.body }}
//             />
//           )}

//           {/* Post Image (the actual post image, not the user's avatar) */}
//           {post.image && (
//             <div className="relative w-full rounded-xl overflow-hidden border border-border/20 bg-muted/20">
//               <Image
//                 src={post.image}
//                 alt={post.title || "Post image"}
//                 width={0}
//                 height={0}
//                 sizes="100vw"
//                 className="w-full h-auto"
//                 style={{
//                   maxHeight: "70vh",
//                   objectFit: "contain",
//                 }}
//               />
//             </div>
//           )}

//           {/* Spotify Track */}
//           {post.spotifyTrack && (
//             <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/20">
//               <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 shrink-0">
//                 <Music className="w-5 h-5 text-white" />
//               </div>
//               <div className="min-w-0 flex-1">
//                 <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
//                   Spotify Track
//                 </p>
//                 <p className="text-sm font-medium text-foreground truncate">
//                   {post.spotifyTrack}
//                 </p>
//               </div>
//             </div>
//           )}
//         </CardContent>

//         {/* ── Action Bar ── */}
//         <Separator className="mx-6 w-auto opacity-40" />

//         <CardFooter className="px-4 py-2.5 gap-0">
//           <div className="flex items-center w-full">
//             {/* Like */}
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={handleLikePost}
//               className="flex items-center gap-1.5 text-muted-foreground hover:text-pink-500 hover:bg-pink-500/10 transition-colors rounded-lg px-3 h-9"
//             >
//               {liked ? (
//                 <Heart className="w-[18px] h-[18px] text-pink-500 fill-pink-500" />
//               ) : (
//                 <Heart className="w-[18px] h-[18px]" />
//               )}
//               <span className="text-sm font-medium">{post.like ?? 0}</span>
//             </Button>

//             {/* Replies count */}
//             <div className="flex items-center gap-1.5 text-muted-foreground px-3 h-9">
//               <MessageCircle className="w-[18px] h-[18px]" />
//               <span className="text-sm font-medium">{replies.length}</span>
//             </div>
//           </div>
//         </CardFooter>
//       </Card>

//       {/* ── Replies Section ── */}
//       <div className="mt-8 space-y-5">
//         <div className="flex items-center gap-2">
//           <h2 className="text-lg font-bold text-foreground">Replies</h2>
//           <Badge variant="outline" className="text-xs font-medium">
//             {replies.length}
//           </Badge>
//         </div>

//         {/* Reply input */}
//         <Card className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm shadow-sm overflow-hidden">
//           <CardContent className="p-4 space-y-3">
//             <Textarea
//               placeholder="Write a reply..."
//               className="resize-none min-h-[100px] rounded-xl border-border/50 focus:border-purple-500/50 transition-colors"
//               value={replyText}
//               onChange={(e) => setReplyText(e.target.value)}
//             />
//             <div className="flex justify-end">
//               <Button
//                 variant="default"
//                 size="sm"
//                 className="rounded-lg px-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-sm"
//                 onClick={handleSendReply}
//                 disabled={!replyText.trim()}
//               >
//                 <Send className="w-4 h-4 mr-1.5" />
//                 Reply
//               </Button>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Reply list */}
//         {replies.length > 0 ? (
//           <div className="space-y-3">
//             {replies.map((reply) => (
//               <ReplyCard key={reply.id} reply={reply} />
//             ))}
//           </div>
//         ) : (
//           <div className="flex flex-col items-center gap-3 py-12">
//             <MessageCircle className="w-10 h-10 text-muted-foreground/30" />
//             <p className="text-sm text-muted-foreground">
//               No replies yet. Be the first to reply!
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

export default function PostPage(){
  const params = useParams()
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
      <div className="flex max-w-3xl mx-auto mt-24 items-center justify-center">
          {!loading && post && <PostCard key={post.id} post={post} />}
      </div>
     
    </div>
  )
}