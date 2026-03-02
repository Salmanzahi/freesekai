'use client';

import Image from 'next/image';
import { Clock, Heart, LucideShare2, Trash2, MessageCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Dialog, DialogClose, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { type Post, useUserData, useAdminStatus } from '@/app/home/cardloadLogic';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '../ui/drawer';


interface CardPostLayoutProps {
  post: Post;
  /** Is the current user's like active? */
  liked?: boolean;
  /** Displayed like count (pass your own optimistic state from the parent). */
  likeCount?: number;
  /** Number of replies to show on the reply button. */
  replyCount?: number;
  /** Whether to show the delete button (e.g. it's the user's own post). */
  showDeleteButton?: boolean;
  onLike?: () => void;
  dialogueState?: boolean;
  onShare?: () => void;
  onDelete?: () => void;
  onReplyOpen?: () => void;
}

// ─── Helper: convert Firestore Timestamp or millis number to a Date ───────────

function toJsDate(value: unknown): Date | null {
  if (!value) return null;
  if (typeof value === 'number') return new Date(value);
  if (value instanceof Date) return value;
  if (typeof (value as { toDate?: () => Date }).toDate === 'function')
    return (value as { toDate: () => Date }).toDate();
  return null;
}

// ─── Component ───────────────────────────────────────────────────────────────

/*


*/
/**
 * Shared post card layout component. All action props are **optional** —
 * buttons are only rendered when their corresponding handler is provided.
 *
 * @param post         - The post data object to display.
 * @param liked        - Whether the current user has already liked this post (controls heart fill). Default: `false`.
 * @param likeCount    - Optimistic like count managed by the parent. Falls back to `post.like` if omitted.
 * @param replyCount   - Number of replies to display on the reply button. Omit to hide the count label.
 * @param showDelete   - When `true` **and** `onDelete` is provided, renders the delete button. Default: `false`.
 * @param onLike       - Called when the user clicks the like button. Renders the button only if provided.
 * @param onShare      - Called when the user clicks the share button. Renders the button only if provided.
 * @param onDelete     - Called when the user confirms deletion. Requires `showDelete={true}` to render.
 * @param onReplyOpen  - Called when the user clicks the reply button. Renders the button only if provided.
 *
 * @example
 * // Read-only (no actions):
 * <CardPostLayout post={post} />
 *
 * @example
 * // With like + share (optimistic state from parent):
 * <CardPostLayout post={post} liked={liked} likeCount={likeCount} onLike={handleLike} onShare={handleShare} />
 *
 * @example
 * // Full featured (own post):
 * <CardPostLayout
 *   post={post} liked={liked} likeCount={likeCount}
 *   replyCount={replies.length} showDelete={isMyPost}
 *   onLike={handleLike} onShare={handleShare}
 *   onDelete={handleDelete} onReplyOpen={() => setDrawerOpen(true)}
 * />
 */
export function CardPostLayout({
  post,
  liked = false,
  likeCount,
  dialogueState,
//   replyCount,
  showDeleteButton,
  onLike,
  onShare,
  onDelete,
  onReplyOpen,
}: CardPostLayoutProps) {
  const userData     = useUserData(post.userId);
  const isAdminUser  = useAdminStatus(post.userId);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(dialogueState);  
  const [replyCount, setReplyCount] = useState(0);
  const [showDelete, setShowDelete] = useState(showDeleteButton);
//   const [liked, setLiked] = useState(false);


  const _date       = toJsDate(post.createdAt);
  const formattedDate = _date
    ? _date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Just now';
  const formattedTime = _date
    ? _date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    : '';

  const displayLikeCount = likeCount ?? post.like ?? 0;

  return (
    <Card className="group relative flex flex-col rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-lg hover:border-border/60 transition-all duration-300 ease-out overflow-hidden gap-0">
      {/* Accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500/60 via-pink-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* ── Header ── */}
      <CardHeader className="px-5 pt-5 pb-3 gap-0">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="absolute -inset-[2px] rounded-full bg-gradient-to-br from-purple-500 to-pink-500 opacity-60" />
            <Avatar className="relative w-9 h-9 ring-2 ring-background">
              <AvatarImage src={userData?.photoURL || ''} alt={userData?.username || 'User'} />
              <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-500 text-white text-xs font-bold">
                {(userData?.username || 'U').substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

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
        <CardTitle className="text-lg text-left md:text-xl font-bold tracking-tight text-foreground leading-snug">
          {post.title}
        </CardTitle>

        <div
          className="text-[15px] text-left font-normal leading-relaxed break-words [&_p]:mb-1.5 [&_p:last-child]:mb-0"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />

        {post.image && (
          <div className="relative w-full rounded-xl overflow-hidden border border-border/20 bg-muted/20">
            <Image
              src={post.image}
              alt={post.title}
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto"
              style={{ maxHeight: '70vh', objectFit: 'contain' }}
            />
          </div>
        )}
      </CardContent>

      <Separator className="mx-5 w-auto opacity-40" />

      {/* ── Footer / Actions ── */}
      <CardFooter className="px-3 py-2 gap-0">
        <div className="flex items-center w-full">


            <Button
              variant="ghost"
              size="sm"
              onClick={onLike}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-pink-500 hover:bg-pink-500/10 transition-colors rounded-lg px-3 h-9"
            >
              <Heart className={`w-[18px] h-[18px] ${liked ? 'text-pink-500 fill-pink-500' : ''}`} />
              <span className="text-sm font-medium">{displayLikeCount}</span>
            </Button>
      

          {/* Share */}
          {onShare && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onShare}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-pink-500 hover:bg-pink-500/10 transition-colors rounded-lg px-3 h-9"
            >
              <LucideShare2 className="w-[18px] h-[18px]" />
            </Button>
          )}

          {/* Replies */}
     
           
              <Drawer>
                <DrawerTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-purple-500 hover:bg-purple-500/10 transition-colors rounded-lg px-3 h-9"
                  >
                    <MessageCircle className="w-[18px] h-[18px]" />
                    {replyCount != null && (
                      <span className="text-sm font-medium">{replyCount}</span>
                    )}
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Replies</DrawerTitle>
                    <DrawerDescription>
                      Lagi mager ngoding
                      Plan:
                      - add reply handling (create)
                      - show reply list pke mapping array (read)
                      - ad reply delete (delete)
                    </DrawerDescription>
                  </DrawerHeader>
                  <DrawerFooter className="gap-2 sm:gap-2">
                    <DrawerClose asChild>
                      <Button variant="outline">Close</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
   

          <div className="flex-1" />

          {/* Delete */}
          {showDeleteButton  && (
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
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      setIsDeleteDialogOpen(false)
                      onDelete?.()
                    }}
                  >
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

export function ReplyLayout(){
  return (
    <>
    <div>
      </div>
      </>

  )
}