import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Bookmark, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function BookmarksPage() {
  const session = await getServerSession(authOptions);
  
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: (session?.user as any)?.id },
    include: {
      promise: {
        include: { politician: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Bookmark className="w-8 h-8 text-primary" /> Janji yang Dipantau
        </h1>
        <p className="text-muted-foreground mt-2">
          Daftar janji politik dan legislasi yang sedang Anda ikuti perkembangannya.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bookmarks.length === 0 ? (
          <div className="col-span-full bg-card border border-border rounded-2xl p-12 text-center shadow-md">
             <Bookmark className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
             <h3 className="text-lg font-bold text-foreground mb-2">Belum ada pantauan</h3>
             <p className="text-muted-foreground mb-6">Anda belum mem-bookmark janji politik satupun.</p>
             <Link href="/database" className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-bold hover:bg-primary/90 transition-colors shadow-md hover:scale-105 active:scale-95 inline-block">
               Jelajah Database
             </Link>
          </div>
        ) : (
          bookmarks.map((b) => (
            <Link key={b.id} href={`/database/${b.promise.id}`} className="block">
              <div className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 hover:bg-secondary/50 transition-all flex flex-col h-full group shadow-sm">
              <div className="flex justify-between items-start mb-4">
                 <div className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase tracking-widest">
                    {b.promise.category}
                 </div>
                 <span className={`px-2 py-1 text-[10px] font-bold rounded-md ${
                   b.promise.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' :
                   b.promise.status === 'FULFILLED' ? 'bg-green-500/10 text-green-500' :
                   'bg-red-500/10 text-red-500'
                 }`}>
                   {b.promise.status}
                 </span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">{b.promise.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-3 leading-relaxed">{b.promise.description}</p>
              
              <div className="pt-4 border-t border-border flex items-center justify-between mt-auto">
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground border border-border">
                      {b.promise.politician.name.charAt(0)}
                    </div>
                    <span className="text-sm font-bold text-foreground">{b.promise.politician.name}</span>
                 </div>
                 {b.promise.deadline && (
                   <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                     <Calendar className="w-3.5 h-3.5" />
                     {b.promise.deadline.toLocaleDateString("id-ID")}
                   </div>
                 )}
              </div>
            </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
