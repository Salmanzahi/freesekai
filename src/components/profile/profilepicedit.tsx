"use client"

import { useState, useRef, useEffect } from "react"
import { RotateCw, Upload, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { changeImageProfile } from "@/app/profile/profilehandling"
import { onAuthStateChanged, User } from "firebase/auth"
import { auth } from "@/lib/firebase"

export function ProfilePicEditModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [authUser, setAuthUser] = useState<User | null | undefined>(undefined);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Cleanup preview URL on unmount or change
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setRotation(0);
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const processImage = async (): Promise<File | null> => {
    if (!previewUrl || !selectedFile) return null;
    
    return new Promise((resolve) => {
      const img = new Image();
      img.src = previewUrl;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(null);
          return;
        }

        const rads = (rotation * Math.PI) / 180;
        const sin = Math.abs(Math.sin(rads));
        const cos = Math.abs(Math.cos(rads));
        const width = img.naturalWidth;
        const height = img.naturalHeight;

        canvas.width = width * cos + height * sin;
        canvas.height = width * sin + height * cos;

        // Fill with white/transparent background if needed, but for profile pics transparency is usually fine.
        // If we want a white background for consistent JPGs:
        // ctx.fillStyle = "white";
        // ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(rads);
        ctx.drawImage(img, -width / 2, -height / 2);

        canvas.toBlob((blob) => {
          if (!blob) {
            resolve(null);
            return;
          }
          // Preserve original file type or force standard (e.g. image/jpeg)
          const newFile = new File([blob], selectedFile.name, { type: selectedFile.type });
          resolve(newFile);
        }, selectedFile.type);
      };
      img.onerror = () => resolve(null);
    });
  };

  const handleSave = async () => {
    if (!authUser || !selectedFile) return;
    setSaving(true);
    try {
      const fileToUpload = rotation !== 0 ? await processImage() : selectedFile;
      if (fileToUpload) {
        await changeImageProfile(authUser.uid, fileToUpload);
        onClose();
        // Force refresh or update context if needed (handled by listener in parent theoretically, or reload)
        window.location.reload(); 
      }
    } catch (error) {
      console.error("Failed to save image", error);
    } finally {
      setSaving(false);
    }
  };

  const resetSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setRotation(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!val) resetSelection();
      onClose();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile Picture</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-6 py-4">
          {!previewUrl ? (
            <div 
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <div className="p-3 bg-muted rounded-full">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="font-medium">Click to upload image</span>
                <span className="text-xs">SVG, PNG, JPG or GIF</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="relative w-64 h-64 overflow-hidden rounded-lg border bg-black/5 flex items-center justify-center">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="max-w-full max-h-full transition-transform duration-300 ease-in-out"
                  style={{ transform: `rotate(${rotation}deg)` }}
                />
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleRotate}>
                  <RotateCw className="w-4 h-4 mr-2" />
                  Rotate
                </Button>
                <Button variant="ghost" size="sm" onClick={resetSelection}>
                  Change Image
                </Button>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <DialogFooter className="sm:justify-between">
          <DialogClose asChild>
            <Button variant="ghost" onClick={resetSelection}>Cancel</Button>
          </DialogClose>
          <Button 
            onClick={handleSave} 
            disabled={!selectedFile || saving}
          >
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
