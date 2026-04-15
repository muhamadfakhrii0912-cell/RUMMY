import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Bookmark, Flame, Activity, Clock, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function DashboardOverview() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) return null;

  // Fetch real data from DB
  const userStats = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    include: {
      _count: {
        select: { bookmarks: true, comments: true, verifications: true }
      }
    }
  });

  const recentBookmarks = await prisma.bookmark.findMany({
    where: { userId: (session.user as any).id },
    take: 3,
    orderBy: { createdAt: 'desc' },
    include: { promise: { include: { politician: true } } }
  });

  const recentRuu = await prisma.legislation.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { simulations: true } }
    }
  });

  return (
    <>
      {/* Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-border bg-gradient-to-br from-primary/20 via-card to-card p-10 shadow-xl shadow-primary/5">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <ShieldIcon className="w-48 h-48 text-primary" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-4xl font-extrabold text-foreground mb-4 tracking-tight">
            Selamat datang kembali, <span className="text-primary">{session.user.name}</span>
          </h2>
          <p className="text-muted-foreground text-xl mb-8 leading-relaxed">
            Terima kasih telah berkontribusi menjaga transparansi. Saat ini Anda adalah <span className="text-foreground font-semibold underline decoration-primary/30 decoration-4 underline-offset-4">Pemantau Aktif</span>.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/dashboard/bookmarks" className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 hover:scale-105 transition-all active:scale-95">
              Lihat Pantauan Saya
            </Link>
            <Link href="/database" className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-secondary/50 backdrop-blur-sm px-8 text-sm font-bold text-foreground shadow-sm hover:bg-secondary transition-all active:scale-95">
              Pantau Janji Baru
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card-hover border-border bg-card shadow-lg shadow-black/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                <Bookmark className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Disimpan</span>
            </div>
            <div>
              <div className="text-4xl font-black text-foreground mb-1">{userStats?._count.bookmarks || 0}</div>
              <div className="text-sm font-medium text-muted-foreground">Janji yang dipantau</div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card-hover border-border bg-card shadow-lg shadow-black/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tervalidasi</span>
            </div>
            <div>
              <div className="text-4xl font-black text-foreground mb-1">{userStats?._count.verifications || 0}</div>
              <div className="text-sm font-medium text-muted-foreground">Laporan fakta lapangan</div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card-hover border-border bg-card shadow-lg shadow-black/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Activity className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Diskusi</span>
            </div>
            <div>
              <div className="text-4xl font-black text-foreground mb-1">{userStats?._count.comments || 0}</div>
              <div className="text-sm font-medium text-muted-foreground">Komentar & opini aktif</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-extrabold text-foreground flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" /> Pantauan Janji Terbaru Anda
          </h3>
          <div className="space-y-4">
            {recentBookmarks.length > 0 ? (
              recentBookmarks.map((bookmark) => (
                <Link key={bookmark.id} href={`/database/${bookmark.promise.id}`} className="block">
                  <Card className="border-border bg-card hover:bg-secondary/30 transition-all group cursor-pointer overflow-hidden p-0 shadow-md">
                  <div className="flex border-l-4 border-yellow-500">
                    <div className="p-5 flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-secondary text-muted-foreground rounded uppercase tracking-widest">
                          {bookmark.promise.category}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ${
                          bookmark.promise.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' :
                          bookmark.promise.status === 'FULFILLED' ? 'bg-green-500/10 text-green-500' :
                          'bg-red-500/10 text-red-500'
                        }`}>
                          {bookmark.promise.status}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {bookmark.promise.title}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {bookmark.promise.description}
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center capitalize font-bold text-primary border border-primary/20">
                          {bookmark.promise.politician.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-foreground/80">{bookmark.promise.politician.name}</span>
                        <span>•</span>
                        <Clock className="w-3 h-3" />
                        <span>Disimpan {new Date(bookmark.createdAt).toLocaleDateString('id-ID')}</span>
                      </div>
                    </div>
                  </div>
                </Card>
               </Link>
              ))
            ) : (
                <div className="border border-dashed border-border p-10 rounded-2xl flex flex-col items-center justify-center text-center bg-card/50">
                  <Bookmark className="w-12 h-12 text-muted-foreground/30 mb-4" />
                  <h4 className="text-lg font-bold text-foreground mb-1">Belum ada janji yang dipantau</h4>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
                    Mulai perhatikan janji-janji kampanye atau RUU yang sedang berjalan untuk memastikannya ditepati.
                  </p>
                  <Link href="/database" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:gap-3 transition-all">
                    Jelajahi Database <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
            )}
          </div>

          <h3 className="text-xl font-extrabold text-foreground flex items-center gap-2 mt-8">
            <FileText className="w-5 h-5 text-blue-500" /> RUU Watch (Terbaru)
          </h3>
          <div className="space-y-4">
            {recentRuu.length > 0 ? (
              recentRuu.map((ruu, i) => (
                <Link key={ruu.id} href={`/ruu-watch/${ruu.id}`} className="block">
                  <Card className="border-border bg-card hover:bg-secondary/30 transition-all group cursor-pointer overflow-hidden p-0 relative shadow-md">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                      <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-primary/5 rounded-full blur-[60px]" />
                    </div>
                    <div className="flex border-l-4 border-blue-500 p-5 items-center gap-4 relative z-10">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-widest ${
                            ruu.status === 'DISAHKAN' ? 'bg-green-500/10 text-green-500' :
                            ruu.status === 'PEMBAHASAN' ? 'bg-yellow-500/10 text-yellow-500' :
                            'bg-blue-500/10 text-blue-500'
                          }`}>
                            {ruu.status}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono bg-secondary px-2 py-0.5 rounded">{ruu.number || ruu.type}</span>
                        </div>
                        <h4 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
                          {ruu.title}
                        </h4>
                        <div className="mt-2 flex items-center gap-4 text-[11px] text-muted-foreground font-medium">
                          <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5" /> {ruu._count.simulations} simulasi dampak</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {ruu.createdAt.toLocaleDateString("id-ID")}</span>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/10 transition-all shrink-0">
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </Card>
                </Link>
              ))
            ) : (
                <div className="border border-dashed border-border p-10 rounded-2xl flex flex-col items-center justify-center text-center bg-card/50">
                  <FileText className="w-12 h-12 text-muted-foreground/30 mb-4" />
                  <h4 className="text-lg font-bold text-foreground mb-1">Belum ada RUU</h4>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Belum ada data legislasi terbaru untuk dipantau.
                  </p>
                </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-extrabold text-foreground flex items-center gap-2">
            Aktivitas Platform
          </h3>
          <Card className="border-border bg-card shadow-lg">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="text-base font-bold text-foreground">Panduan Pemantau</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-border">
                {[
                  { title: "Verifikasi Data", desc: "Cara mengajukan laporan", time: "2 min baca" },
                  { title: "Indeks Kebenaran", desc: "Mekanisme skoring politisi", time: "5 min baca" },
                  { title: "RUU Kontroversial", desc: "Panduan analisis pasal", time: "10 min baca" },
                ].map((item, i) => (
                  <li key={i} className="p-4 hover:bg-secondary/30 transition-colors cursor-pointer block group">
                    <div className="flex justify-between items-start mb-1">
                      <h5 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{item.title}</h5>
                      <span className="text-[10px] font-medium text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">{item.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

// Icon Component Helper
function ShieldIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  )
}
