import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { FileText, Clock, ExternalLink, Shield, AlertTriangle, Zap } from "lucide-react";
import { ImpactSimulator } from "./ImpactSimulator";
import Link from "next/link";
import { BackButton } from "@/components/ui/back-button";

export default async function RuuDetailPage({ params }: { params: { id: string } }) {
  const ruu = await prisma.legislation.findUnique({
    where: { id: params.id },
    include: {
      simulations: { take: 5, orderBy: { createdAt: "desc" } },
      promises: {
        include: {
          promise: {
            include: {
              politician: true
            }
          }
        }
      }
    }
  });

  if (!ruu) return notFound();

  // Parse pasal-pasal kunci dari deskripsi
  const lines = ruu.description.split("\n").filter(Boolean);
  const summaryLines = lines.filter(l => !l.startsWith("- Pasal") && !l.startsWith("PASAL"));
  const pasalLines = lines.filter(l => l.startsWith("- Pasal"));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-5xl mx-auto px-6 pt-28 pb-12">
          <BackButton className="mb-6" title="Kembali ke RUU Watch" />
          
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20">
              {ruu.type}
            </span>
            <span className="px-3 py-1 bg-yellow-500/10 text-yellow-400 text-xs font-bold rounded-full">
              {ruu.status}
            </span>
            {ruu.number && <span className="text-xs text-muted-foreground font-mono">{ruu.number}</span>}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-4">
            {ruu.title}
          </h1>
          
          {ruu.url && (
            <a href={ruu.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
              <ExternalLink className="w-4 h-4" /> Lihat Dokumen Resmi
            </a>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Left Column */}
        <div className="lg:col-span-3 space-y-8">
          {/* Ringkasan */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> Ringkasan Bahasa Rakyat
            </h2>
            <div className="bg-card border border-border rounded-2xl p-6 space-y-3 shadow-sm">
              {summaryLines.map((line, i) => (
                <p key={i} className="text-muted-foreground leading-relaxed text-sm">
                  {line.trim()}
                </p>
              ))}
            </div>
          </section>

          {/* Pasal-Pasal Kunci */}
          {pasalLines.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" /> Pasal-Pasal Kunci
              </h2>
              <div className="space-y-3">
                {pasalLines.map((pasal, i) => {
                  const [title, ...rest] = pasal.replace("- ", "").split(": ");
                  return (
                    <div key={i} className="bg-card border border-border rounded-xl p-4 hover:border-yellow-500/30 transition-colors shadow-sm">
                      <h4 className="text-sm font-bold text-yellow-500 mb-1">{title}</h4>
                      <p className="text-sm text-muted-foreground">{rest.join(": ")}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Hubungan dengan Janji Politik (Contradiction/Support) */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-500" /> Deteksi Hubungan & Janji Politik
            </h2>
            
            {ruu.promises && ruu.promises.length > 0 ? (
              <div className="space-y-4">
                {ruu.promises.map((relation) => {
                  const isContradiction = relation.relationType.toUpperCase() === "CONTRADICTS" || relation.relationType.toUpperCase() === "KONTRADIKSI";
                  return (
                    <div key={relation.id} className={`bg-card border rounded-xl p-5 shadow-sm ${isContradiction ? "border-red-500/30" : "border-green-500/30"}`}>
                      <div className="flex justify-between items-start mb-3">
                        <div className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase flex items-center gap-1 ${isContradiction ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"}`}>
                          {isContradiction ? <AlertTriangle className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                          {isContradiction ? "Kontradiksi Janji" : "Mendukung Janji"}
                        </div>
                        <Link href={`/database/${relation.promiseId}`} className="text-xs text-primary hover:underline flex items-center gap-1">
                          Lihat Janji <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                      
                      <h4 className="text-sm font-semibold text-foreground mb-2 line-clamp-1">{relation.promise.title}</h4>
                      
                      {relation.notes && (
                        <div className="mt-3 p-3 bg-secondary rounded-lg border border-border">
                          <p className="text-xs text-muted-foreground"><strong className="text-foreground">Analisis AI:</strong> {relation.notes}</p>
                        </div>
                      )}
                      
                      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center font-bold text-foreground border border-border text-[10px] uppercase">
                          {relation.promise.politician.name.charAt(0)}
                        </div>
                        <span className="font-medium text-foreground">{relation.promise.politician.name}</span>
                        <span>•</span>
                        <span className="uppercase">{relation.promise.category}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-card border border-dashed border-border rounded-xl p-6 text-center shadow-sm">
                <FileText className="w-8 h-8 text-muted-foreground/50 mx-auto mb-4" />
                <h4 className="text-sm font-medium text-foreground mb-1">Belum Ada Deteksi Hubungan</h4>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Sistem AI kami belum menemukan kaitan langsung antara RUU ini dengan database janji kampanye politisi.
                </p>
              </div>
            )}
          </section>

          {/* Riwayat Simulasi Pengguna Lain */}
          {ruu.simulations.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" /> Simulasi Dampak dari Warga Lain
              </h2>
              <div className="space-y-3">
                {ruu.simulations.map((sim) => {
                  const profile = JSON.parse(sim.userProfile);
                  return (
                    <div key={sim.id} className="bg-card border border-border rounded-xl p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded-full uppercase">
                          {profile.profesi || "Warga"}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(sim.createdAt).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{sim.impactResult}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Impact Simulator */}
        <div className="lg:col-span-2">
          <div className="sticky top-28">
            <ImpactSimulator legislationId={ruu.id} ruuTitle={ruu.title} />
          </div>
        </div>
      </div>
    </div>
  );
}
