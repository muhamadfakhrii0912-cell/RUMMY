"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, Loader2, User, Briefcase, GraduationCap, ShoppingBag, Heart, Landmark } from "lucide-react";

const PROFESI_OPTIONS = [
  { value: "mahasiswa", label: "Mahasiswa", icon: GraduationCap },
  { value: "pekerja_kantoran", label: "Pekerja Kantoran", icon: Briefcase },
  { value: "buruh_pabrik", label: "Buruh Pabrik", icon: User },
  { value: "umkm", label: "Pemilik UMKM", icon: ShoppingBag },
  { value: "ibu_rumah_tangga", label: "Ibu Rumah Tangga", icon: Heart },
  { value: "petani", label: "Petani/Nelayan", icon: Landmark },
];

interface Props {
  legislationId: string;
  ruuTitle: string;
}

export function ImpactSimulator({ legislationId, ruuTitle }: Props) {
  const router = useRouter();
  const [selectedProfesi, setSelectedProfesi] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSimulate = async () => {
    if (!selectedProfesi) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/simulate-impact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          legislationId,
          profesi: selectedProfesi,
        })
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data.impactResult);
        router.refresh();
      } else {
        setResult("Error: " + (data.error || "Gagal mensimulasikan dampak."));
      }
    } catch {
      setResult("Gagal terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-primary/10 to-white/[0.03] border border-primary/20 rounded-2xl p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Zap className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-foreground text-lg">Simulasi Dampak</h3>
          <p className="text-xs text-muted-foreground">Bagaimana RUU ini mempengaruhi <strong className="text-foreground">HIDUP Anda</strong>?</p>
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-3">
          Pilih Profil Anda
        </label>
        <div className="grid grid-cols-2 gap-2">
          {PROFESI_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selectedProfesi === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setSelectedProfesi(opt.value)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all border ${
                  isSelected
                    ? "bg-primary/20 border-primary/50 text-primary"
                    : "bg-secondary border-border text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={handleSimulate}
        disabled={!selectedProfesi || loading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_25px_-5px_rgba(45,212,191,0.4)]"
      >
        {loading ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Menganalisis...</>
        ) : (
          <><Zap className="w-5 h-5" /> Simulasikan Dampak ke Hidup Saya</>
        )}
      </button>

      {/* Result */}
      {result && (
        <div className="bg-card border border-border rounded-xl p-5 animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-sm">
          <h4 className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4" /> Hasil Analisis Dampak
          </h4>
          <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {result}
          </div>
        </div>
      )}
    </div>
  );
}
