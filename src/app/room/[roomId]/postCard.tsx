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

    useEffect(() => {
        roomPosts(roomId).then((data) => {
            console.log(data)
            setPosts(data)
            setLoading(false)
        })
    }, [roomId])

    return (
        <>
            {loading ? (
                <PostSkeleton />
            ) : (
                <div>
                    {posts.map(post => (
                        <PostCardItem key={post.id} post={post} roomId={roomId}  />
                    ))}
                </div>
            )}
        </>
    )
}


/**
 * PostCard Wrapper
 */
function PostCardItem({ post, roomId }: { post: Post; roomId: string }) {
    const uid = auth.currentUser?.uid ?? ''
    const [liked, setLiked] = useState(false)
    const [likeCount, setLikeCount] = useState(post.like ?? 0)
    const [dialogueState, setDialogueState] = useState(false)
    const [showDeleteButton, setShowDeleteButton] = useState(false)

    useEffect(() => {
        if (!uid) return
        checkUserLikeState(post.id, uid, roomId).then(setLiked)
    }, [post.id, uid, roomId])

    useEffect(() => {
        if (post.userId === uid) {
            console.log("post.userId", post.userId)
            console.log("uid", uid)
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

    const handleDelete = async () => {
        console.log("delete")
        const res = await deletePost(post.id, roomId, uid)
        if (res) {
            toast.success("Post deleted successfully")
            setDialogueState(false)
        } else {
            toast.error("Failed to delete post")
        }
    }



    return (
        <CardPostLayout
            post={post}
            liked={liked}
            likeCount={likeCount}
            onLike={handleLike}
            onDelete={handleDelete}
            showDeleteButton={showDeleteButton}
            dialogueState={dialogueState}
        />
    )
}