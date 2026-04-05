"use client";

import { useState } from "react";
import { Bookmark, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function BookmarkButton({ promiseId }: { promiseId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleBookmark = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promiseId })
      });
      if (res.ok) {
        alert("Berhasil memantau janji! Silakan cek di Dashboard Warga.");
        router.push("/dashboard");
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Gagal mem-bookmark");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleBookmark}
      disabled={loading}
      className="text-xs px-4 py-1.5 bg-primary/10 text-primary font-bold rounded-lg hover:bg-primary/20 transition-all flex items-center gap-2"
    >
      {loading ? <Loader2 className="w-3 h-3 animate-spin"/> : <Bookmark className="w-3 h-3" />}
      Pantau Janji
    </button>
  );
}
