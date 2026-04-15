import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Database, ShieldAlert, BrainCircuit, Activity, BarChart3, AlertTriangle } from "lucide-react";

export default async function AdminDashboard() {
  // Fetch real global stats from DB
  const [
    userCount,
    promiseCount,
    legislationCount,
    pendingVerifications
  ] = await Promise.all([
    prisma.user.count(),
    prisma.promise.count(),
    prisma.legislation.count(),
    prisma.verification.count({ where: { status: 'PENDING' } })
  ]);

  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, email: true, role: true, createdAt: true }
  });

  const recentPromises = await prisma.promise.findMany({
    take: 4,
    orderBy: { createdAt: 'desc' },
    include: { politician: true }
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-1">Command Center</h2>
          <p className="text-muted-foreground">Sistem pengawasan terpusat platform RUUMY.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-primary font-medium text-sm">
          <Activity className="w-4 h-4 animate-pulse" /> Live System Monitor
        </div>
      </div>

      {/* Global Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card-hover border-border bg-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">+12%</span>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">{userCount}</div>
            <div className="text-sm font-medium text-muted-foreground">Total Pengguna Terdaftar</div>
          </CardContent>
        </Card>

        <Card className="glass-card-hover border-border bg-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500">
                <Database className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">+5%</span>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">{promiseCount}</div>
            <div className="text-sm font-medium text-muted-foreground">Janji Terindeks (Database)</div>
          </CardContent>
        </Card>

        <Card className="glass-card-hover border-border bg-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <FileText className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-muted-foreground bg-secondary px-2 py-1 rounded-full">Tetap</span>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">{legislationCount}</div>
            <div className="text-sm font-medium text-muted-foreground">RUU Dalam Pemantauan</div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-primary/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              {pendingVerifications > 0 && <span className="text-xs font-bold text-primary bg-primary/20 px-2 py-1 rounded-full shadow-[0_0_10px_rgba(100,116,139,0.5)]">URGENT</span>}
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">{pendingVerifications}</div>
            <div className="text-sm font-medium text-primary">Verifikasi Menunggu Review</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Data Entry */}
        <Card className="border-border bg-card">
          <CardHeader className="border-b border-border bg-card">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-primary" /> Log Indexing AI Terbaru
              </CardTitle>
              <button className="text-xs text-primary hover:underline font-medium">Buka Log</button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {recentPromises.length > 0 ? (
              <div className="divide-y divide-border">
                {recentPromises.map((promise) => (
                  <div key={promise.id} className="p-4 hover:bg-secondary/50 transition-colors flex gap-4 items-start">
                    <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${promise.status === 'PENDING' ? 'bg-yellow-500' : 'bg-primary'}`}></div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-1">{promise.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{promise.description}</p>
                      <div className="flex gap-2">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-secondary text-foreground border border-border">
                          By: {promise.politician.name}
                        </span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-secondary text-foreground border border-border">
                          Engine: NLP-Extractor v1.2
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">Belum ada data terekam oleh sistem.</div>
            )}
          </CardContent>
        </Card>

        {/* User Registration Stream */}
        <Card className="border-border bg-card">
          <CardHeader className="border-b border-border bg-card">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" /> Pengguna Baru
              </CardTitle>
              <button className="text-xs text-blue-400 hover:underline font-medium">Semua User</button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {recentUsers.length > 0 ? (
              <div className="divide-y divide-border">
                {recentUsers.map((user) => (
                  <div key={user.id} className="p-4 hover:bg-secondary/50 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-xs font-bold">
                        {(user.name || "U").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        user.role === 'ADMIN' ? 'bg-primary/20 text-primary border border-primary/30' : 
                        user.role === 'JOURNALIST' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' : 
                        'bg-secondary text-muted-foreground border border-border'
                      }`}>
                        {user.role}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">Belum ada pengguna.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
