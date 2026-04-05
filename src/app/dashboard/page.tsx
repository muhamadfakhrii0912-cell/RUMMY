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
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 bg-gradient-to-r from-primary/10 via-background to-background p-8">
        <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
          <ShieldIcon className="w-32 h-32 text-primary mix-blend-screen" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-bold text-white mb-2">
            Selamat datang kembali, <span className="text-primary">{session.user.name}</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-6">
            Terima kasih telah berkontribusi menjaga transparansi. Saat ini Anda adalah <span className="text-white font-medium">Pemantau Aktif</span>.
          </p>
          <div className="flex gap-4">
            <Link href="/dashboard/bookmarks" className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground shadow-[0_0_20px_-5px_rgba(45,212,191,0.4)] hover:bg-primary/90 transition-colors">
              Lihat Pantauan Saya
            </Link>
            <Link href="/database" className="inline-flex h-11 items-center justify-center rounded-lg border border-white/10 bg-white/5 px-6 text-sm font-medium text-white shadow-sm hover:bg-white/10 hover:text-white transition-colors">
              Pantau Janji Baru
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card-hover border-white/5 bg-white/[0.02]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                <Bookmark className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Disimpan</span>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">{userStats?._count.bookmarks || 0}</div>
              <div className="text-sm text-muted-foreground">Janji yang dipantau</div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card-hover border-white/5 bg-white/[0.02]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Tervalidasi</span>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">{userStats?._count.verifications || 0}</div>
              <div className="text-sm text-muted-foreground">Laporan fakta lapangan</div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card-hover border-white/5 bg-white/[0.02]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Activity className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Diskusi</span>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">{userStats?._count.comments || 0}</div>
              <div className="text-sm text-muted-foreground">Komentar & opini aktif</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" /> Pantauan Janji Terbaru Anda
          </h3>
          <div className="space-y-4">
            {recentBookmarks.length > 0 ? (
              recentBookmarks.map((bookmark) => (
                <Link key={bookmark.id} href={`/database/${bookmark.promise.id}`} className="block">
                  <Card className="border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group cursor-pointer overflow-hidden p-0">
                  <div className="flex border-l-4 border-yellow-500">
                    <div className="p-5 flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-semibold px-2 py-1 bg-white/5 text-muted-foreground rounded-md uppercase">
                          {bookmark.promise.category}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          bookmark.promise.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' :
                          bookmark.promise.status === 'FULFILLED' ? 'bg-green-500/10 text-green-500' :
                          'bg-red-500/10 text-red-500'
                        }`}>
                          {bookmark.promise.status}
                        </span>
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-1 group-hover:text-primary transition-colors">
                        {bookmark.promise.title}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {bookmark.promise.description}
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center capitalize font-bold text-white border border-white/20">
                          {bookmark.promise.politician.name.charAt(0)}
                        </div>
                        <span className="font-medium text-white">{bookmark.promise.politician.name}</span>
                        <span>•</span>
                        <Clock className="w-3 h-3" />
                        <span>Disimpan tanggal {new Date(bookmark.createdAt).toLocaleDateString('id-ID')}</span>
                      </div>
                    </div>
                  </div>
                </Card>
               </Link>
              ))
            ) : (
                <div className="glass-panel p-8 rounded-2xl flex flex-col items-center justify-center text-center border-dashed border-white/10">
                  <Bookmark className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                  <h4 className="text-lg font-medium text-white mb-1">Belum ada janji yang dipantau</h4>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
                    Mulai perhatikan janji-janji kampanye atau RUU yang sedang berjalan untuk memastikannya ditepati.
                  </p>
                  <Link href="/database" className="text-sm font-medium text-primary hover:underline">
                    Jelajahi Database →
                  </Link>
                </div>
            )}
          </div>

          <h3 className="text-xl font-bold text-white flex items-center gap-2 mt-8">
            <FileText className="w-5 h-5 text-blue-500" /> RUU Watch (Terbaru)
          </h3>
          <div className="space-y-4">
            {recentRuu.length > 0 ? (
              recentRuu.map((ruu, i) => (
                <Link key={ruu.id} href={`/ruu-watch/${ruu.id}`} className="block">
                  <Card className="border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group cursor-pointer overflow-hidden p-0 relative">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                      <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-primary/5 rounded-full blur-[60px]" />
                    </div>
                    <div className="flex border-l-4 border-blue-500 p-5 items-center gap-4 relative z-10">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                            ruu.status === 'DISAHKAN' ? 'bg-green-500/10 text-green-400' :
                            ruu.status === 'PEMBAHASAN' ? 'bg-yellow-500/10 text-yellow-400' :
                            'bg-blue-500/10 text-blue-400'
                          }`}>
                            {ruu.status}
                          </span>
                          <span className="text-xs text-muted-foreground font-mono">{ruu.number || ruu.type}</span>
                        </div>
                        <h4 className="text-lg font-semibold text-white mb-1 group-hover:text-primary transition-colors line-clamp-1">
                          {ruu.title}
                        </h4>
                        <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5" /> {ruu._count.simulations} simulasi dampak</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {ruu.createdAt.toLocaleDateString("id-ID")}</span>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/10 transition-all shrink-0">
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </Card>
                </Link>
              ))
            ) : (
                <div className="glass-panel p-8 rounded-2xl flex flex-col items-center justify-center text-center border-dashed border-white/10">
                  <FileText className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                  <h4 className="text-lg font-medium text-white mb-1">Belum ada RUU</h4>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
                    Belum ada data legislasi terbaru untuk dipantau.
                  </p>
                </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            Aktivitas Platform
          </h3>
          <Card className="border-white/5 bg-white/[0.02]">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-base text-white">Panduan Pemantau</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-white/5">
                {[
                  { title: "Verifikasi Data", desc: "Cara mengajukan laporan", time: "2 min baca" },
                  { title: "Indeks Kebenaran", desc: "Mekanisme skoring politisi", time: "5 min baca" },
                  { title: "RUU Kontroversial", desc: "Panduan analisis pasal", time: "10 min baca" },
                ].map((item, i) => (
                  <li key={i} className="p-4 hover:bg-white/[0.02] transition-colors cursor-pointer block group">
                    <div className="flex justify-between items-start mb-1">
                      <h5 className="text-sm font-medium text-white group-hover:text-primary transition-colors">{item.title}</h5>
                      <span className="text-xs text-muted-foreground">{item.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
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
