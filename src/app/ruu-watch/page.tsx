import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FileText, Search, Flame, Clock, ArrowRight, Shield, AlertTriangle, CheckCircle } from "lucide-react";

function getStatusStyle(status: string) {
  switch (status) {
    case "DISAHKAN": return { bg: "bg-green-500/10", text: "text-green-400", icon: CheckCircle };
    case "PEMBAHASAN": return { bg: "bg-yellow-500/10", text: "text-yellow-400", icon: Clock };
    case "INISIATIF_DPR": return { bg: "bg-blue-500/10", text: "text-blue-400", icon: FileText };
    default: return { bg: "bg-white/10", text: "text-white", icon: FileText };
  }
}

import { SearchBar } from "@/components/ui/search-bar";

export default async function RuuWatchPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const query = typeof searchParams?.q === 'string' ? searchParams.q : undefined;

  const legislations = await prisma.legislation.findMany({
    where: query ? {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { number: { contains: query, mode: 'insensitive' } },
      ]
    } : undefined,
    include: {
      _count: { select: { simulations: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-white/10 bg-background/50 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 pt-28 pb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-xs font-semibold text-red-400">Live Monitoring</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            RUU <span className="text-gradient">Watch</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-6">
            Pantau dan pahami Rancangan Undang-Undang yang sedang dibahas di DPR. 
            Klik salah satu untuk melihat <strong className="text-white">dampaknya terhadap kehidupan Anda</strong>.
          </p>
          <SearchBar placeholder="Cari RUU, nomor, atau topik pembahasan..." />
        </div>
      </div>
      
      {/* RUU List */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 gap-6">
          {legislations.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Belum ada data RUU. Jalankan script seed terlebih dahulu.</p>
              <code className="text-sm text-primary mt-2 block">node scripts/seed-legislations.js</code>
            </div>
          ) : (
            legislations.map((ruu, i) => {
              const style = getStatusStyle(ruu.status);
              const StatusIcon = style.icon;
              return (
                <Link key={ruu.id} href={`/ruu-watch/${ruu.id}`}>
                  <div className="group relative bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8 transition-all hover:bg-white/[0.06] hover:border-primary/40 hover:shadow-[0_0_40px_-15px_rgba(45,212,191,0.15)] cursor-pointer overflow-hidden">
                    {/* Glow */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px]" />
                    </div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row gap-6">
                      {/* Left: Number */}
                      <div className="shrink-0 w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl font-black text-muted-foreground group-hover:text-primary group-hover:border-primary/30 transition-all">
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      
                      {/* Center: Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                          <div className={`${style.bg} ${style.text} px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5`}>
                            <StatusIcon className="w-3 h-3" /> {ruu.status}
                          </div>
                          <span className="text-xs text-muted-foreground font-mono">{ruu.number || ruu.type}</span>
                        </div>
                        
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                          {ruu.title}
                        </h2>
                        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                          {ruu.description.split("\n")[0]}
                        </p>
                        
                        <div className="mt-4 flex items-center gap-6 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5"><Search className="w-3.5 h-3.5" /> {ruu._count.simulations} simulasi dampak</span>
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {ruu.createdAt.toLocaleDateString("id-ID")}</span>
                        </div>
                      </div>
                      
                      {/* Right: Arrow */}
                      <div className="hidden md:flex items-center">
                        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/10 transition-all">
                          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
