'use client';

import React, { useEffect, useState } from 'react';
import { rtdb } from '@/lib/firebase';
import { ref, onValue, off, push } from 'firebase/database';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import Image from 'next/image';
import { isAdmin } from '@/lib/isAdmin';
import { MessageCircleReply, Send} from 'lucide-react';
// import { }
import { Textarea } from '@/components/ui/textarea';
import {Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger} from "@/components/ui/drawer"
import { set } from 'firebase/database';
import { isAuth } from '@/lib/isauth';
// import { Image } from 'lucide-react';
// import { Separator } from '@radix-ui/react-select';
interface Post {
  id: string;
  imageURL: string;
  userPhotoURL: string;
  title: string;
  text: string;
  userDisplayName: string;
  timestamp: number;
}

interface Reply {
  id: string;         
  text: string;
}
  const authStatus = await isAuth();    

function useReplies(postId: string) {
  const [replies, setReplies] = useState<Reply[]>([]);

  useEffect(() => {
    const replyRef = ref(rtdb, `messages/${postId}/replies`);

    const unsubscribe = onValue(replyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const repliesArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
        }));

        // sort by latest first
        // repliesArray.sort((a, b) => b.id.localeCompare(a.id));
        setReplies(repliesArray);
      } else {
        setReplies([]);
      }
    });

    return () => {
      off(replyRef, 'value', unsubscribe);
    };
  }, [postId]);

  return replies;
}


// isAdmin == false

function PostCard({ post }: { post: Post }) {
  const replies = useReplies(post.id);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [replyText, setReplyText] = useState("");

  // check admin status
  useEffect(() => {
    const checkAdminStatus = async () => {
      const admin = await isAdmin(post.id);
      setIsAdminUser(admin);
    };
    checkAdminStatus();
  }, [post.id]);

  // Handler for sending a reply
  const handleSendReply = async () => {
    if (replyText.trim()) {
      await newReplies(post.id, replyText);
      setReplyText("");
    }
  };



  return (
    <Card className="flex flex-col w-full max-w-3xl mx-auto rounded-2xl border border-border/30 bg-white/5 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
          <div className='flex flex-row items-center gap-2'>
            <Avatar className="w-8 h-8">
              <AvatarImage src={post.userPhotoURL || ''} alt={post.userDisplayName || 'User'} />
              {isAdminUser ? (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full border-2 border-background" title="Admin"></div>
              ) : (
                <AvatarFallback>{(post.userDisplayName || 'User').substring(0, 2).toUpperCase()}</AvatarFallback>
              )}
            </Avatar>

            <div className='flex items-center gap-2'>
              <p className='text-sm font-medium'>{post.userDisplayName}</p>
              
            </div>
          </div>
       
        <Separator className='w-[2%]'/>
        <CardTitle className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          {post.title}
        </CardTitle>
        
        <CardDescription className="text-xs md:text-sm text-muted-foreground">
          {new Date(post.timestamp).toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pt-1">
     
  {post.imageURL ? (
          <div className="relative w-full">
            <Image
              src={post.imageURL}
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
          dangerouslySetInnerHTML={{ __html: post.text }}
        ></p>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 pt-4 mt-3 border-t border-border/40">
        {replies.length > 0 ? (
          <div className="space-y-2 w-full">
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="ghost" className='text-left text-[16px] leading-relaxed font-normal hover:text-primary transition-colors p-0'>
                  <MessageCircleReply className='inline-block w-8 h-8 ' />
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
                  {replies.map(reply => (
                  <div key={reply.id} className="p-3 rounded-lg bg-muted/50">
                    <p className="text-sm">{reply.text}</p>
                  </div>
                  ))}
                </div>
                {/* <DrawerFooter>
                  <DrawerClose asChild>
                  <Button variant="outline">Close</Button>
                  </DrawerClose>
                </DrawerFooter> */}
                </DrawerContent>
            </Drawer>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No replies yet.</p>
        )}
      </CardFooter>
    </Card>
  );
}



//load card post
export default function CardLoad() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const postsRef = ref(rtdb, "messages");

    const unsubscribe = onValue(postsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const fetchedPosts = Object.keys(data)
          .map(key => ({ id: key, ...data[key] }))
          .sort((a, b) => b.timestamp - a.timestamp);
        setPosts(fetchedPosts);
      } else {
        setPosts([]);
      }
      setLoading(false);
    });

    return () => {
      off(postsRef, "value", unsubscribe);
    };
  }, []);

  if (loading) {
    return (
      <div className="px-4">
        <h1 className="mt-20 text-center text-4xl md:text-5xl font-extrabold tracking-tight mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Latest Posts
        </h1>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="flex flex-col w-full max-w-3xl mx-auto rounded-2xl border border-border/30 bg-white/5 shadow-sm">
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




export async function newReplies(postId: string, text: string) {
 

  if (!authStatus) {
    // throw new Error("User is not authenticated");
    alert("You must be logged in to reply."  + authStatus);
  } else {
    const repliesRef = ref(rtdb, `messages/${postId}/replies`);
    push(repliesRef, { text });
  }

}
