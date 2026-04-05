import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Users, Search, Activity, ShieldAlert, Award } from "lucide-react";
import { SearchBar } from "@/components/ui/search-bar";

export const dynamic = 'force-dynamic';

export default async function PoliticiansPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const query = typeof searchParams?.q === 'string' ? searchParams.q : undefined;

  const politicians = await prisma.politician.findMany({
    where: query ? {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { party: { contains: query, mode: 'insensitive' } },
        { position: { contains: query, mode: 'insensitive' } },
      ]
    } : undefined,
    include: {
      _count: { select: { promises: true } }
    },
    orderBy: { truthScore: "desc" }
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-white/10 bg-background/50 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 pt-28 pb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-primary">Kebenaran Index</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Profil & <span className="text-gradient">Track Record</span> Politisi
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-6">
            Pantau Kebenaran Index (Skor Kejujuran) dari setiap politisi berdasarkan rasio janji yang ditepati vs diingkari.
          </p>
          <SearchBar placeholder="Cari nama politisi, partai, atau jabatan..." />
        </div>
      </div>
      
      {/* List */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {politicians.map((politician) => (
            <Link key={politician.id} href={`/politicians/${politician.id}`}>
              <div className="group relative bg-white/[0.03] border border-white/10 rounded-2xl p-6 transition-all hover:bg-white/[0.06] hover:border-primary/40 cursor-pointer overflow-hidden flex flex-col h-full">
                <div className="flex items-start gap-4 mb-4">
                   <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 border border-white/10 flex items-center justify-center text-2xl font-bold text-white shrink-0 group-hover:border-primary/50 transition-colors">
                     {politician.name.charAt(0)}
                   </div>
                   <div>
                     <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors line-clamp-1">{politician.name}</h3>
                     <p className="text-sm text-muted-foreground line-clamp-1">{politician.position}</p>
                     <p className="text-xs text-primary/70">{politician.party}</p>
                   </div>
                </div>
                
                <div className="mt-auto pt-4 border-t border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-white">Truth Score</span>
                    <span className={`text-sm font-bold ${politician.truthScore >= 70 ? 'text-green-400' : politician.truthScore >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {politician.truthScore.toFixed(1)} / 100
                    </span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${politician.truthScore >= 70 ? 'bg-green-500' : politician.truthScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${politician.truthScore}%` }}
                    />
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <Activity className="w-4 h-4" /> {politician._count.promises} Janji Tercatat
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {politicians.length === 0 && (
             <div className="col-span-full text-center py-20 text-muted-foreground">
                 Tidak ada politisi yang cocok dengan pencarian Anda.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
