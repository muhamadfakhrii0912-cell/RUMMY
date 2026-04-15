import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Bookmark, Activity, FileText, CheckCircle, ExternalLink, Calendar, Database, Eye } from "lucide-react";
import { BookmarkButton } from "../BookmarkButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CommentSection } from "@/components/comments/CommentSection";
import { BackButton } from "@/components/ui/back-button";

export default async function PromiseDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  const promise = await prisma.promise.findUnique({
    where: { id: params.id },
    include: {
      politician: true,
      comments: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" }
      },
      legislations: {
        include: { legislation: true }
      },
      _count: { select: { bookmarks: true } }
    }
  });

  if (!promise) return notFound();

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-4xl mx-auto px-6 pt-28 pb-12">
          <BackButton className="mb-6" title="Kembali ke Katalog Janji" />
          
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <span className="px-3 py-1 bg-secondary text-muted-foreground text-[10px] font-bold rounded-full uppercase tracking-wider border border-border">
               {promise.category}
            </span>
            <span className={`px-3 py-1 text-xs font-bold rounded-full ${
               promise.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
               promise.status === 'FULFILLED' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
               'bg-red-500/10 text-red-500 border border-red-500/20'
             }`}>
               {promise.status}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-6">
            {promise.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-muted-foreground border-t border-border pt-6">
             <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4" /> {promise._count.bookmarks} Disimpan
             </div>
             <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Dibuat: {new Date(promise.createdAt).toLocaleDateString('id-ID')}
             </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-6 py-12">
         {/* Politician Info */}
         <Link href={`/politicians/${promise.politician.id}`} className="flex items-center gap-4 bg-card border border-border rounded-2xl p-6 mb-8 hover:bg-secondary/50 transition-colors group cursor-pointer shadow-sm">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 border border-border flex items-center justify-center text-xl font-bold text-foreground shrink-0">
               {promise.politician.name.charAt(0)}
            </div>
            <div className="flex-1">
               <h3 className="text-sm text-muted-foreground mb-1">Janji dari:</h3>
               <div className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{promise.politician.name}</div>
               <div className="text-xs text-muted-foreground">{promise.politician.position}</div>
            </div>
            <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
         </Link>

         {/* Description */}
         <div className="prose prose-invert max-w-none mb-12">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2 mb-4">
               <FileText className="w-5 h-5 text-primary" /> Detail Janji
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-wrap">
               {promise.description}
            </p>
            {promise.sourceUrl && (
               <a href={promise.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex mt-4 items-center gap-2 text-sm text-primary hover:underline">
                  <ExternalLink className="w-4 h-4" /> Lihat Sumber Bukti (Archive)
               </a>
            )}
         </div>

         {/* RUU Terkait */}
         {promise.legislations.length > 0 && (
            <div className="mb-12">
               <h2 className="text-xl font-bold text-foreground flex items-center gap-2 mb-4">
                  <Database className="w-5 h-5 text-blue-500" /> Deteksi Hubungan dengan RUU
               </h2>
               <div className="space-y-4">
                  {promise.legislations.map(relation => (
                     <Link key={relation.id} href={`/ruu-watch/${relation.legislation.id}`}>
                        <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors shadow-sm">
                           <div className="flex justify-between items-start mb-2">
                              <span className="text-xs font-mono text-muted-foreground">{relation.legislation.number}</span>
                              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                                 relation.relationType === 'CONTRADICTS' ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'
                              }`}>
                                 {relation.relationType}
                              </span>
                           </div>
                           <h4 className="font-bold text-foreground mb-2">{relation.legislation.title}</h4>
                           {relation.notes && <p className="text-sm text-muted-foreground">Analisis AI: {relation.notes}</p>}
                        </div>
                     </Link>
                  ))}
               </div>
            </div>
         )}
         
         <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
               <h3 className="font-bold text-foreground mb-1">Ikut Kawal Janji Ini</h3>
               <p className="text-sm text-muted-foreground">Simpan janji ini ke dashboard Anda untuk mendapatkan notifikasi jika status atau realisasi berubah.</p>
            </div>
            {session ? (
               <BookmarkButton promiseId={promise.id} />
            ) : (
               <Link href="/login" className="bg-foreground text-background hover:bg-foreground/90 px-6 py-2.5 rounded-lg text-sm font-bold shadow-md hover:scale-105 active:scale-95 transition-all">
                  Login & Pantau
               </Link>
            )}
         </div>

         <CommentSection promiseId={promise.id} existingComments={promise.comments} session={session} />
      </div>
    </div>
  );
}
