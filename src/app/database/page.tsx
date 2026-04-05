import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Search, Flame, Calendar, Clock, Bookmark } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SearchBar } from "@/components/ui/search-bar";

export const dynamic = 'force-dynamic';

export default async function DatabasePage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);
  
  const query = typeof searchParams?.q === 'string' ? searchParams.q : undefined;

  // Ambil semua janji yang dimuat simulator-scraper atau admin
  const promises = await prisma.promise.findMany({
    where: query ? {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { politician: { name: { contains: query, mode: 'insensitive' } } },
      ]
    } : undefined,
    include: {
      politician: {
        select: { name: true, photo: true, position: true }
      },
      _count: {
        select: { bookmarks: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="space-y-4 max-w-2xl">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20">
               <Flame className="w-4 h-4" /> Database Publik
             </div>
             <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Katalog Janji Politik</h1>
             <p className="text-muted-foreground text-lg mb-4">Telusuri, pantau, dan verifikasi setiap janji atau Rancangan Undang-Undang yang tercatat di sistem kami.</p>
             <SearchBar placeholder="Cari janji, nama politisi, atau deskripsi..." />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promises.length === 0 ? (
            <div className="col-span-full py-20 text-center text-muted-foreground">Belum ada data janji di dalam database.</div>
          ) : (
            promises.map((promise) => (
              <div key={promise.id} className="group relative bg-white/5 border border-white/10 rounded-3xl p-6 transition-all hover:bg-white/[0.08] hover:border-primary/50 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                   <div className="px-3 py-1 bg-white/10 text-muted-foreground text-[10px] font-bold rounded-full uppercase tracking-wider">
                      {promise.category}
                   </div>
                   <span className={`px-2 py-1 text-[10px] font-bold rounded-md ${
                     promise.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' :
                     promise.status === 'FULFILLED' ? 'bg-green-500/10 text-green-500' :
                     'bg-red-500/10 text-red-500'
                   }`}>
                     {promise.status}
                   </span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">{promise.title}</h3>
                <p className="text-sm text-muted-foreground mb-6 flex-1 line-clamp-3">{promise.description}</p>
                
                <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-auto">
                   <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                        {promise.politician.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{promise.politician.name}</div>
                        <div className="text-[10px] text-muted-foreground">{promise.politician.position}</div>
                      </div>
                   </div>
                </div>

                {/* Footer Action */}
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-muted-foreground">
                  <div className="flex items-center gap-4 text-xs font-medium">
                    <span className="flex items-center gap-1.5"><Bookmark className="w-4 h-4" /> {promise._count.bookmarks} Disimpan</span>
                  </div>
                  {session ? (
                     <BookmarkButton promiseId={promise.id} />
                  ) : (
                     <Link href="/login" className="text-xs text-primary hover:underline font-semibold tracking-wide">
                        Login untuk Memantau
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

// Client Component Wrapper
import { BookmarkButton } from "./BookmarkButton";
