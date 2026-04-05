"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PhotoUploader } from "@/components/verification/PhotoUploader";
import { Loader2, ShieldCheck, Zap } from "lucide-react";

export default function LaporFaktaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    promiseId: "" // Opsional, dalam dunia nyata user memilih dari list dropdown
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      alert("Harap unggah bukti foto terlebih dahulu!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, imageUrl })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Sukses
      // Arahkan ke halaman My Reports/Dashboard dalam waktu nyata
      alert("Berhasil! Laporan sedang dianalisis oleh Mesin GPS dan AI.");
      router.push("/dashboard"); 

    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-primary" /> Lapor Fakta Lapangan
        </h1>
        <p className="text-muted-foreground mt-2">
          Gunakan fitur ini untuk mengirimkan jepretan realita dari program infrastruktur yang gagal, mangkrak, atau berhasil. Metadata GPS akan otomatis diverifikasi.
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">1. Unggah Bukti Foto</label>
            <PhotoUploader onUploadComplete={(data) => setImageUrl(data.url)} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">2. Judul Laporan</label>
            <input 
              required
              disabled={loading}
              type="text" 
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="Contoh: Jalan Gatot Subroto Berlubang Parah"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">3. Deskripsi & Detail</label>
            <textarea 
              required
              disabled={loading}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white h-32 resize-none focus:outline-none focus:border-primary transition-colors"
              placeholder="Ceritakan detail yang Anda saksikan di lapangan..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-sm text-primary flex items-start gap-3">
            <Zap className="w-5 h-5 shrink-0 mt-0.5" />
            <p>
              Dengan menekan "Kirim", foto Anda akan diproses oleh **Mesin Ekstraksi GPS** dan **AI Auditor** untuk membuktikan keasliannya sebelum masuk ke meja Moderator. Pastikan ini adalah jepretan Anda sendiri.
            </p>
          </div>

          <button 
            type="submit" 
            disabled={loading || !imageUrl}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
            Kirim Laporan Fakta (Verifikasi Engine 3)
          </button>
        </form>
      </div>

    </div>
  );
}
