import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Activity, ShieldAlert, CheckCircle, Database, XCircle, AlertTriangle, ArrowLeft, Award, Flame, ExternalLink } from "lucide-react";
import { BookmarkButton } from "@/app/database/BookmarkButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BackButton } from "@/components/ui/back-button";

export default async function PoliticianDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  const politician = await prisma.politician.findUnique({
    where: { id: params.id },
    include: {
      promises: {
        include: {
          _count: { select: { bookmarks: true } }
        },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!politician) return notFound();

  const fulfilled = politician.promises.filter(p => p.status === 'FULFILLED').length;
  const failed = politician.promises.filter(p => p.status === 'FAILED' || p.status === 'CONTRADICTED').length;
  const pending = politician.promises.filter(p => p.status === 'PENDING' || p.status === 'ON_TRACK' || p.status === 'DELAYED').length;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-5xl mx-auto px-6 pt-28 pb-12">
          <BackButton className="mb-6" title="Kembali ke Daftar Politisi" />
          
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
             <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary/20 to-blue-500/20 border-2 border-border flex items-center justify-center text-5xl font-black text-foreground shadow-2xl shrink-0">
               {politician.name.charAt(0)}
             </div>
             <div className="flex-1">
               <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-2">
                 {politician.name}
               </h1>
               <p className="text-xl text-muted-foreground mb-4">
                 {politician.position} <span className="mx-2">•</span> <span className="text-primary">{politician.party}</span>
               </p>
               <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                 {politician.bio || "Belum ada biografi yang tercatat."}
               </p>
             </div>
             
             {/* Score Card */}
             <div className="shrink-0 bg-card border border-border rounded-2xl p-6 text-center w-full md:w-64 shadow-sm">
                <div className="text-sm text-muted-foreground mb-2 flex items-center justify-center gap-2">
                   <Award className="w-4 h-4" /> Kebenaran Index
                </div>
                <div className={`text-5xl font-black mb-2 ${politician.truthScore >= 70 ? 'text-green-400' : politician.truthScore >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                   {politician.truthScore.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">Dari 100 poin</div>
             </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-5xl mx-auto px-6 py-12">
         {/* Stats */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
           <div className="bg-card border border-border rounded-xl p-5 text-center shadow-sm">
             <Database className="w-6 h-6 text-blue-400 mx-auto mb-2" />
             <div className="text-2xl font-bold text-foreground">{politician.promises.length}</div>
             <div className="text-xs text-muted-foreground">Total Janji</div>
           </div>
           <div className="bg-card border border-border rounded-xl p-5 text-center shadow-sm">
             <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
             <div className="text-2xl font-bold text-foreground">{fulfilled}</div>
             <div className="text-xs text-muted-foreground">Ditepati</div>
           </div>
           <div className="bg-card border border-border rounded-xl p-5 text-center shadow-sm">
             <XCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
             <div className="text-2xl font-bold text-foreground">{failed}</div>
             <div className="text-xs text-muted-foreground">Diingkari / Gagal</div>
           </div>
           <div className="bg-card border border-border rounded-xl p-5 text-center shadow-sm">
             <Activity className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
             <div className="text-2xl font-bold text-foreground">{pending}</div>
             <div className="text-xs text-muted-foreground">Proses / Status Quo</div>
           </div>
         </div>
         
         <h2 className="text-2xl font-bold text-foreground mb-6">Track Record Janji Politik</h2>
         
         <div className="space-y-4">
           {politician.promises.length === 0 ? (
             <div className="text-center py-12 bg-card border border-border rounded-2xl shadow-sm">
                <AlertTriangle className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-foreground mb-2">Belum ada janji tercatat</h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">Kami belum mengindeks janji apapun dari politisi ini. Pantau terus update berikutnya.</p>
             </div>
           ) : (
             politician.promises.map((promise) => (
               <div key={promise.id} className="bg-card border border-border rounded-2xl p-6 transition-all hover:bg-secondary/50 hover:border-primary/40 flex flex-col md:flex-row gap-6 shadow-sm">
                 <div className="flex-1">
                   <div className="flex items-center gap-3 mb-3">
                     <span className={`px-2 py-1 text-[10px] font-bold rounded-md ${
                       promise.status === 'PENDING' || promise.status === 'ON_TRACK' || promise.status === 'DELAYED' ? 'bg-yellow-500/10 text-yellow-500' :
                       promise.status === 'FULFILLED' ? 'bg-green-500/10 text-green-500' :
                       'bg-red-500/10 text-red-500'
                     }`}>
                       {promise.status}
                     </span>
                     <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{promise.category}</span>
                   </div>
                   <h3 className="text-xl font-bold text-foreground mb-2">{promise.title}</h3>
                   <p className="text-sm text-muted-foreground leading-relaxed">{promise.description}</p>
                 </div>
                 <div className="shrink-0 flex items-center md:flex-col md:items-end justify-between md:justify-center pt-4 md:pt-0 pl-0 md:pl-6">
                    {session ? (
                       <BookmarkButton promiseId={promise.id} />
                    ) : (
                       <Link href="/login" className="text-xs text-primary hover:underline font-semibold tracking-wide border border-primary/30 px-3 py-1.5 rounded-md">
                          Pantau Janji
                       </Link>
                    )}
                 </div>
               </div>
             ))
           )}
         </div>
      </div>
    </div>
  );
}
