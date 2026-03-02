'use client'
import type { Post } from "@/app/home/cardloadLogic"
import { useEffect, useState } from 'react'
import { useParams } from "next/navigation"
import { roomPosts } from "./postHandling"
import { CardPostLayout } from "@/components/myComponent/cardPostLayout"
import { likeHandlingRoom, checkUserLikeState, deletePost } from "./postHandling"
import { auth } from "@/lib/firebase"
import { PostSkeleton } from "@/app/home/cardload"
import { toast } from "sonner"

export function PostCard() {
    const param = useParams()
    const roomId = param.roomId as string
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const uid = auth.currentUser?.uid ?? ''

    useEffect(() => {
        roomPosts(roomId).then((data) => {
            console.log(data)
            setPosts(data)
            setLoading(false)
        })
    }, [roomId])

    const handleDelete = async (postId: string) => {
        // 1. Snapshot the current list in case we need to rollback
        const previousPosts = posts


        // 3. Call the API
        const res = await deletePost(postId, roomId, uid)
        setPosts(prev => prev.filter(p => p.id !== postId))

        if (res) {
            toast.success("Post deleted successfully")
        } else {
            // 4. Rollback on failure
            setPosts(previousPosts)
            toast.error("Failed to delete post")
        }
    }

    return (
        <>
            {loading ? (
                <PostSkeleton />
            ) : (
                <div>
                    {posts.map(post => (
                        <PostCardItem key={post.id} post={post} roomId={roomId} onDelete={handleDelete} />
                    ))}
                </div>
            )}
        </>
    )
}


/**
 * PostCard Wrapper
 */
function PostCardItem({ post, roomId, onDelete }: { post: Post; roomId: string; onDelete: (postId: string) => void }) {
    const uid = auth.currentUser?.uid ?? ''
    const [liked, setLiked] = useState(false)
    const [likeCount, setLikeCount] = useState(post.like ?? 0)
    const [dialogueState] = useState(false)
    const [showDeleteButton, setShowDeleteButton] = useState(false)

    useEffect(() => {
        if (!uid) return
        checkUserLikeState(post.id, uid, roomId).then(setLiked)
    }, [post.id, uid, roomId])

    useEffect(() => {
        if (post.userId === uid) {
            setShowDeleteButton(true)
        }
    }, [post.userId, uid])

    const handleLike = async () => {
        const optimistic = !liked
        setLiked(optimistic)
        setLikeCount(c => c + (optimistic ? 1 : -1))
        await likeHandlingRoom(post.id, uid, roomId)
        const confirmed = await checkUserLikeState(post.id, uid, roomId)
        setLiked(confirmed)
        setLikeCount(c => c + (confirmed !== optimistic ? (confirmed ? 1 : -1) : 0))
    }

    const replyHandling = async () => {
        console.log('pass')
    }

    return (
        <CardPostLayout
            post={post}
            liked={liked}
            likeCount={likeCount}
            onLike={handleLike}
            onDelete={() => onDelete(post.id)}
            onReplyOpen={replyHandling}
            showDeleteButton={showDeleteButton}
            dialogueState={dialogueState}
        />
    )
}