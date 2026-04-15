import { prisma } from "@/lib/prisma";
import { PromiseRadarChart } from "@/components/charts/PromiseRadarChart";
import { Activity, ShieldAlert, Target } from "lucide-react";
import { BackButton } from "@/components/ui/back-button";

export default async function PromiseRadarPage() {
  const promises = await prisma.promise.findMany({
    include: {
      politician: { select: { name: true } },
      _count: { select: { bookmarks: true } }
    },
    orderBy: { createdAt: "asc" }
  });

  const stats = {
    total: promises.length,
    fulfilled: promises.filter(p => p.status === 'FULFILLED').length,
    failed: promises.filter(p => p.status === 'FAILED' || p.status === 'CONTRADICTED').length,
    pending: promises.filter(p => p.status === 'PENDING' || p.status === 'ON_TRACK' || p.status === 'DELAYED').length,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 pt-28 pb-12">
          <BackButton className="mb-6" />
          <div className="flex items-center gap-3 mb-4">
            <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-xs font-semibold text-primary">Live Radar</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            Promise <span className="text-gradient">Radar</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-8">
            Peta sebaran janji politik berdasarkan kategori, timeline, dan tingkat pencapaian. Besar gelembung menunjukkan popularitas atau jumlah pengawasan.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
             <div className="p-4 rounded-xl border border-border bg-card shadow-sm">
                <div className="text-sm font-bold text-muted-foreground mb-1">Total Janji</div>
                <div className="text-2xl font-black text-foreground">{stats.total}</div>
             </div>
             <div className="p-4 rounded-xl border border-green-500/20 bg-green-500/5">
                <div className="text-sm text-green-400 mb-1">Ditepati</div>
                <div className="text-2xl font-bold text-green-400">{stats.fulfilled}</div>
             </div>
             <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                <div className="text-sm text-red-400 mb-1">Gagal</div>
                <div className="text-2xl font-bold text-red-400">{stats.failed}</div>
             </div>
             <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5">
                <div className="text-sm text-yellow-500 mb-1">On Progress</div>
                <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
             </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-6 py-12">
        <PromiseRadarChart promises={promises} />
        
        <div className="mt-8 flex flex-wrap gap-6 justify-center text-sm text-muted-foreground">
           <div className="flex items-center gap-2">
             <span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span> Janji Ditepati
           </div>
           <div className="flex items-center gap-2">
             <span className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></span> PENDING/Proses
           </div>
           <div className="flex items-center gap-2">
             <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></span> Janji Berbohong / Gagal
           </div>
        </div>
      </div>
    </div>
  );
}
