'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Send } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import QuillEditor from '@/components/qleditor';
import { useState, useEffect } from 'react';
import { isAuth } from '@/lib/isauth';
import { auth } from '@/lib/firebase';
import { handlePost } from './createhandling';
import { toast } from "sonner";

export function CreateCard() {
    const [authCheck, setAuthCheck] = useState<boolean>();

    useEffect(() => {
        const checkAuth = async () => {
            const checkauthuser = await isAuth();
            setAuthCheck(checkauthuser);
        };
        checkAuth();
    }, []);

    return (
        <Card className='bg-transparent border-none w-full max-w-full shadow-none'>
            <CardHeader>
                <CardTitle>Create New Post {authCheck ? " (Authenticated)" : "[Not Logged In]"}</CardTitle>
                <CardDescription>Share your thoughts with the community</CardDescription>
            </CardHeader>
            <CardContent>
                <CreatePostForm />
            </CardContent>
        </Card>
    )
}

function CreatePostForm() {
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [image, setImage] = useState<File | null>(null);
    const [showProfile, setShowProfile] = useState<boolean>(false);
    const [spotifyTrack, setSpotifyTrack] = useState<string>("");
    const [userId, setUserId] = useState<string>("");
    const [btnDisabled, setBtnDisabled] = useState<boolean>(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUserId(user.uid);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async () => {
        setBtnDisabled(true);
        const pushPost = await handlePost(title, content, image, showProfile, spotifyTrack, userId);
        console.log("handlePost result:", pushPost);

        if (pushPost) {
            toast.success("Post created successfully!", {
                description: "Your post has been shared with the community."
            });

            setBtnDisabled(false);
            setTitle("");
            setContent("");
            setImage(null);
            setShowProfile(false);
            setSpotifyTrack("");
        } else {
            toast.error("Failed to create post!", {
                description: "Please try again later."
            });

            setBtnDisabled(false);
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <Label htmlFor="post-title">Title</Label>
                <Input
                    id="post-title"
                    placeholder="What do you want to ask or share?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full rounded-md border p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>

            <div>
                <div className="mt-1 min-h-[140px]">
                    <QuillEditor
                        value={content}
                        onChange={(e) => setContent(e)}
                        placeholder="Include all the information someone would need to answer your question or understand your post" />
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <Label htmlFor="post-image">Add an image</Label>
                    <Input type="file"
                        id="post-image"
                        accept="image/*"
                        className="mt-1"
                        aria-label="Upload image"
                        title="Upload image"
                        onChange={(e) => setImage(e.target.files?.[0] || null)} />
                </div>
                <div className="flex items-center justify-between m-0">
                    <Label htmlFor="show-profile">Show profile in post </Label>
                    <Switch disabled={true} id="show-profile" checked={true} onCheckedChange={(checked) => setShowProfile(checked)} />
                </div>
                <p className="text-xs text-muted-foreground">Toggle whether your profile appears with the post</p>
            </div>

            <Separator />

            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <div className="text-sm font-medium">Add Spotify Track</div>
                </div>
                <div className="flex gap-2">
                    <Input placeholder="Coming Soon..." className="flex-1 rounded-md border p-2" disabled={true} value={spotifyTrack} onChange={(e) => setSpotifyTrack(e.target.value)} />
                    <Button type="button" disabled={true} >Search</Button>
                </div>
                <Button variant="ghost" type="button" disabled={true} >Connect to Spotify</Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 w-full">
                    <Button type='submit' className="flex items-center gap-2 w-full" onClick={handleSubmit} disabled={btnDisabled} >
                        <Send size={16} />
                        Post
                    </Button>
                </div>
            </div>
        </div>
    );
}
