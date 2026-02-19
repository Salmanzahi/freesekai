'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Image from 'next/image';
import { Heart, MessageCircle, Send, Trash2, Clock } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { deletePost } from './cardloadLogic';
import { likeHandling, checkUserLikeState } from './likeHandling';
import {
  type Post,
  usePosts,
  useReplies,
  useUserData,
  useAdminStatus,
  newReplies,
  type Reply
} from './cardloadLogic';
import { useEffect } from 'react';


export  function PostCard({ post }: { post: Post }) {
  const replies = useReplies(post.id);
  const [myPost, setMyPost] = useState(false);
  const userData = useUserData(post.userId);
  const isAdminUser = useAdminStatus(post.userId);
  const [replyText, setReplyText] = useState("");
  const [liked, setLiked] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

onAuthStateChanged(auth, (user) => {
    if (user) {
      setMyPost(user.uid === post.userId);
    }
  });

  const handleSendReply = async () => {
    const user = auth.currentUser;
    if (replyText.trim() && user) {
      await newReplies(post.id, replyText, user.uid);
      setReplyText("");
    } else if (!user) {
      alert("Please login to reply");
    }
  };

  const handleLikePost = async () => {
    const user = auth.currentUser;
    if (user) {
      await likeHandling(post.id, user.uid);
      return true;
    } else {
      alert("Please login to like a post");
      return false;
    }
  };

  useEffect(() => {
    const user = auth.currentUser?.uid
    if (user){
      checkUserLikeState(post.id, user).then((state) => {
        setLiked(state);
      });
    }

  }, [post]);


  const handleDeletePost = async () => {
    const user = auth.currentUser;
    if (user) {
      await deletePost(post.id, user.uid);
      setIsDeleteDialogOpen(false);
      return true;
    } else {
      alert("Please login to delete a post");
      return false;
    }
  };

  const formattedDate = post.createdAt
    ? post.createdAt.toDate().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Just now';

  const formattedTime = post.createdAt
    ? post.createdAt.toDate().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <Card className="group relative flex flex-col rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-lg hover:border-border/60 transition-all duration-300 ease-out overflow-hidden gap-0">
      {/* Subtle gradient accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500/60 via-pink-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* ── Header: avatar + name + date ── */}
      <CardHeader className="px-5 pt-5 pb-3 gap-0">
        <div className="flex items-center gap-3">
          {/* Avatar with gradient ring */}
          <div className="relative shrink-0">
            <div className="absolute -inset-[2px] rounded-full bg-gradient-to-br from-purple-500 to-pink-500 opacity-60" />
            <Avatar className="relative w-9 h-9 ring-2 ring-background">
              <AvatarImage src={userData?.photoURL || ''} alt={userData?.username || 'User'} />
              <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-500 text-white text-xs font-bold">
                {(userData?.username || 'U').substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Name + timestamp */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground truncate">
                {userData?.username || 'Unknown'}
              </span>
              {isAdminUser && (
                <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white leading-none">
                  Admin
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{formattedDate}</span>
              {formattedTime && (
                <>
                  <span className="text-muted-foreground/40">·</span>
                  <span>{formattedTime}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      {/* ── Content ── */}
      <CardContent className="px-5 pb-4 pt-0 flex-grow space-y-3">
        {/* Title */}
        <CardTitle className="text-lg text-left md:text-xl font-bold tracking-tight text-foreground leading-snug">
          {post.title}
        </CardTitle>

        {/* Body text */}
        <div
          className="text-[15px]   text-left font-normal leading-relaxed break-words [&_p]:mb-1.5 [&_p:last-child]:mb-0"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />

        {/* Image */}
        {post.image && (
          <div className="relative w-full rounded-xl overflow-hidden border border-border/20 bg-muted/20">
            <Image
              src={post.image}
              alt={post.title}
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto"
              style={{
                maxHeight: '70vh',
                objectFit: 'contain',
              }}
            />
          </div>
        )}
      </CardContent>

      {/* ── Action bar ── */}
      <Separator className="mx-5 w-auto opacity-40" />

      <CardFooter className="px-3 py-2 gap-0">
        <div className="flex items-center w-full">
          {/* Like */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLikePost}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-pink-500 hover:bg-pink-500/10 transition-colors rounded-lg px-3 h-9"
          >
            {liked ? (
              <Heart className="w-[18px] h-[18px] text-pink-500" />
            ) : (
              <Heart className="w-[18px] h-[18px]" />
            )}
            <span className="text-sm font-medium">{post.like ?? 0}</span>
          </Button>

          {/* Replies Drawer */}
          <Drawer>
            <DrawerTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1.5 text-muted-foreground hover:text-purple-500 hover:bg-purple-500/10 transition-colors rounded-lg px-3 h-9"
              >
                <MessageCircle className="w-[18px] h-[18px]" />
                <span className="text-sm font-medium">{replies.length}</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="border-b border-border/30 pb-4">
                <DrawerTitle className="text-lg">Replies</DrawerTitle>
                <DrawerDescription className="text-sm text-muted-foreground">
                  {replies.length} {replies.length === 1 ? 'reply' : 'replies'} to this post
                </DrawerDescription>
              </DrawerHeader>
              <div className="p-5 flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
                {/* Reply input */}
                <div className="flex flex-col gap-2.5">
                  <Textarea
                    placeholder="Write a reply..."
                    className="resize-none min-h-[80px] rounded-xl border-border/50 focus:border-purple-500/50 transition-colors"
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                  />
                  <Button
                    variant="default"
                    size="sm"
                    className="self-end rounded-lg px-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-sm"
                    onClick={handleSendReply}
                    disabled={!replyText.trim()}
                  >
                    <Send className="w-4 h-4 mr-1.5" />
                    Reply
                  </Button>
                </div>

                {replies.length > 0 && <Separator className="opacity-30" />}

                {/* Reply list */}
                <div className="flex flex-col gap-2.5">
                  {replies.map((reply) => (
                    <ReplyCard key={reply.id} reply={reply} />
                  ))}
                </div>

                {replies.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-6">
                    No replies yet. Be the first to reply!
                  </p>
                )}
              </div>
            </DrawerContent>
          </Drawer>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Delete (own post only) */}
          {myPost && (
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors rounded-lg px-3 h-9"
                >
                  <Trash2 className="w-[18px] h-[18px]" />
                  <span className="text-sm font-medium hidden sm:inline">Delete</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Post?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete your post.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-2">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button variant="destructive" onClick={handleDeletePost}>
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}


function ReplyCard({ reply }: { reply: Reply }) {
  const replyUserData = useUserData(reply.userId);

  const formattedReplyDate = reply.createdAt
    ? reply.createdAt.toDate().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : 'Just now';

  return (
    <div className="group/reply flex items-start gap-3 p-3.5 rounded-xl bg-muted/25 border border-border/15 hover:bg-muted/45 hover:border-border/30 transition-all duration-200">
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="absolute -inset-[1.5px] rounded-full bg-gradient-to-br from-purple-500/40 to-pink-500/40" />
        <Avatar className="relative w-8 h-8 ring-1 ring-background">
          <AvatarImage src={replyUserData?.photoURL || ''} alt={replyUserData?.username || 'User'} />
          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-[10px] font-bold">
            {(replyUserData?.username || 'U').substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground/90 truncate">
            {replyUserData?.username || 'Anonymous'}
          </span>
          <span className="text-[11px] text-muted-foreground/60">
            {formattedReplyDate}
          </span>
        </div>
        <p className="text-sm text-foreground/70 leading-relaxed break-words">
          {reply.text}
        </p>
      </div>
    </div>
  );
}


// ─── Loading Skeleton ────────────────────────────────────

function PostSkeleton() {
  return (
    <Card className="flex flex-col rounded-2xl border border-border/30 bg-card/60 backdrop-blur-sm shadow-sm overflow-hidden">
      <CardHeader className="px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <Skeleton className="w-9 h-9 rounded-full" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-4 pt-0 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
        <Skeleton className="w-full h-48 rounded-xl" />
      </CardContent>
      <Separator className="mx-5 w-auto opacity-30" />
      <CardFooter className="px-5 py-3">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-16 rounded-lg" />
          <Skeleton className="h-8 w-16 rounded-lg" />
        </div>
      </CardFooter>
    </Card>
  );
}


// ─── Main Export ─────────────────────────────────────────

export default function CardLoad() {
  const { posts, loading } = usePosts();

  if (loading) {
    return (
      <div className="px-4 max-w-2xl mx-auto">
        <h1 className="mt-20 text-center text-4xl md:text-5xl font-extrabold tracking-tight mb-10 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Latest Posts
        </h1>
        <div className="space-y-5">
          {[1, 2, 3].map((i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 max-w-2xl mx-auto">
      <h1 className="mt-20 text-center text-4xl md:text-5xl font-extrabold tracking-tight mb-10 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        Latest Posts
      </h1>
      <div className="space-y-5">
        {posts.length > 0 ? (
          posts.map(post => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="flex flex-col items-center gap-3 py-16">
            <MessageCircle className="w-12 h-12 text-muted-foreground/30" />
            <p className="text-center text-lg text-muted-foreground">
              No posts available yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
