"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackButton({ title = "Kembali", className = "" }: { title?: string, className?: string }) {
  const router = useRouter();
  
  return (
    <button 
      onClick={() => router.back()} 
      className={`text-sm text-primary hover:underline inline-flex items-center gap-2 ${className}`}
    >
      <ArrowLeft className="w-4 h-4" /> {title}
    </button>
  );
}
