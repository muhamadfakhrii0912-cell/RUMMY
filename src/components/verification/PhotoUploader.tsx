"use client";

import { UploadButton } from "@/lib/uploadthing";
import { useState } from "react";
import { ImagePlus, CheckCircle } from "lucide-react";
import Image from "next/image";

interface PhotoUploaderProps {
  onUploadComplete: (data: { url: string; key: string }) => void;
}

export function PhotoUploader({ onUploadComplete }: PhotoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {!preview ? (
        <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center bg-background/50 hover:bg-background transition-colors">
          <ImagePlus className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-4">
            Foto bukti lapangan (maks. 8MB). Harus foto langsung (tidak boleh screenshot).
          </p>
          <UploadButton
            endpoint="verificationPhoto"
            onUploadBegin={() => setUploading(true)}
            onClientUploadComplete={(res) => {
              setUploading(false);
              const data = res[0];
              setPreview(data.url);
              onUploadComplete({ url: data.url, key: data.key });
            }}
            onUploadError={(error: Error) => {
              setUploading(false);
              console.error("Upload failed:", error);
              alert("Gagal mengupload gambar: " + error.message);
            }}
          />
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-white/10 w-full h-[300px]">
          <Image 
            src={preview} 
            alt="Preview" 
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute top-3 right-3 bg-green-500/90 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Terupload
          </div>
        </div>
      )}
    </div>
  );
}
