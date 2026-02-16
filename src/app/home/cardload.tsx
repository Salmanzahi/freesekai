'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Image from 'next/image';
import { MessageCircleReply, Send } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

import {
  type Post,
  usePosts,
  useReplies,
  useUserData,
  useAdminStatus,
  newReplies,
  type Reply
} from './cardloadLogic';


function PostCard({ post }: { post: Post }) {
  const replies = useReplies(post.id);
  const userData = useUserData(post.userId);
  const isAdminUser = useAdminStatus(post.userId);
  const [replyText, setReplyText] = useState("");
  // const replyUserData = useUserData

  const handleSendReply = async () => {
    if (replyText.trim()) {
      await newReplies(post.id, replyText, post.userId);
      setReplyText("");
    }
  };

  return (
    <Card className="flex flex-col w-full max-w-3xl mx-auto rounded-2xl border border-border/30 bg-white/5 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
          <div className='flex flex-row items-center gap-2'>
            <Avatar className="w-8 h-8">
              <AvatarImage src={userData?.photoURL || ''} alt={userData?.username || 'User'} />
              {isAdminUser ? (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full border-2 border-background" title="Admin"></div>
              ) : (
                <AvatarFallback>{(userData?.username || 'U').substring(0, 2).toUpperCase()}</AvatarFallback>
              )}
            </Avatar>

            <div className='flex items-center gap-2'>
              <p className='text-sm font-medium'>{userData?.username || 'Unknown'}</p>
            </div>
          </div>
       
        <Separator className='w-[2%]'/>
        <CardTitle className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          {post.title}
        </CardTitle>
        
        <CardDescription className="text-xs md:text-sm text-muted-foreground">
          {post.createdAt ? post.createdAt.toDate().toLocaleString() : 'Just now'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pt-1">
        {post.image ? (
          <div className="relative w-full">
            <Image
              src={post.image}
              alt={post.title}
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto rounded-md"
              style={{
                maxHeight: '80vh',
                objectFit: 'contain'
              }}
            />
          </div>
        ) : (
          <p className='text-sm text-muted-foreground'>No image provided.</p>
        )}
        <p
          className="text-left break-words text-[18px] leading-relaxed font-normal mt-2"
          dangerouslySetInnerHTML={{ __html: post.body }}
        ></p>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 pt-4 mt-3 border-t border-border/40">
        <div className="space-y-2 w-full">
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="ghost" className='text-left text-[16px] leading-relaxed font-normal hover:text-primary transition-colors p-0'>
                <MessageCircleReply className='inline-block w-8 h-8' />
                View Replies
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Replies</DrawerTitle>
                <DrawerDescription>View all replies for this post</DrawerDescription>
              </DrawerHeader>
              <div className="p-4 flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
                <Textarea
                  placeholder="Write a reply..."
                  className="resize-none"
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                />
                <Button
                  variant='default'
                  className='md:mx-auto block w-1/4'
                  onClick={handleSendReply}
                  disabled={!replyText.trim()}
                >
                  <Send className='inline-block w-5 h-5 mr-2' />
                  Send
                </Button>
                {/* {replies.map(reply => (
                  <div key={reply.id} className="p-3 rounded-lg bg-muted/50">
                    <p className="text-sm">{reply.text}</p>
                  </div>
                ))} */}
                {replies.map((reply) => (
                  <ReplyCard key={reply.id} reply={reply} />
                ))}
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </CardFooter>
    </Card>
  );
}


function ReplyCard({ reply }: { reply: Reply }) {
  const replyUserData = useUserData(reply.userId);
  return (
    <div className="group flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/20 hover:bg-muted/50 hover:border-border/40 transition-all duration-200">
   
 
           <Avatar className="w-9 h-9 ring-2 ring-purple-500/20 shrink-0">
        <AvatarImage src={replyUserData?.photoURL || ''} alt={replyUserData?.username || 'User'} />
    
        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs font-semibold">
          {(replyUserData?.username || 'U').substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
 
     
      
      
       
     
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground/90 truncate">
            {replyUserData?.username || 'Anonymous'}
          </span>
          <span className="text-xs text-muted-foreground whitespace-nowrap">{reply.createdAt.toDate().toLocaleString()}</span>
        </div>
        
        <p className="text-sm text-foreground/75 leading-relaxed break-words">
          {reply.text}
        </p>
      </div>
    </div>
  );
}


// ─── Loading Skeleton ────────────────────────────────────

function PostSkeleton() {
  return (
    <Card className="flex flex-col w-full max-w-3xl mx-auto rounded-2xl border border-border/30 bg-white/5 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex flex-row items-center gap-2">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Separator className="w-[2%]" />
        <Skeleton className="h-8 w-3/4 mt-2" />
        <Skeleton className="h-4 w-32 mt-2" />
      </CardHeader>
      <CardContent className="flex-grow pt-1">
        <Skeleton className="w-full h-48 mb-4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 pt-4 mt-3 border-t border-border/40">
        <Skeleton className="h-4 w-32" />
      </CardFooter>
    </Card>
  );
}


// ─── Main Export ─────────────────────────────────────────

export default function CardLoad() {
  const { posts, loading } = usePosts();

  if (loading) {
    return (
      <div className="px-4">
        <h1 className="mt-20 text-center text-4xl md:text-5xl font-extrabold tracking-tight mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Latest Posts
        </h1>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4">
      <h1 className="mt-20 text-center text-4xl md:text-5xl font-extrabold tracking-tight mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        Latest Posts
      </h1>
      <div className="space-y-6">
        {posts.length > 0 ? (
          posts.map(post => <PostCard key={post.id} post={post} />)
        ) : (
          <p className="text-center text-lg text-muted-foreground">
            No posts available yet.
          </p>
        )}
      </div>
    </div>
  );
}
