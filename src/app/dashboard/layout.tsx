import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Bookmark, 
  MessageSquare, 
  Settings, 
  LogOut, 
  ShieldAlert,
  FileText,
  Database,
  Users,
  Target
} from "lucide-react";
import { MobileNav } from "./mobile-nav";
import { DashboardNavbarActions } from "./dashboard-navbar-actions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const navLinks = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Lapor Fakta", href: "/dashboard/report", icon: ShieldAlert },
    { name: "Bookmarks Server", href: "/dashboard/bookmarks", icon: Bookmark },
    { name: "Diskusi & Opini", href: "/dashboard/discussions", icon: MessageSquare },
    { name: "Pengaturan Akun", href: "/dashboard/settings", icon: Settings },
  ];

  const publicLinks = [
    { name: "Database Janji", href: "/database", icon: Database },
    { name: "Profil Politisi", href: "/politicians", icon: Users },
    { name: "Promise Radar", href: "/promise-radar", icon: Target },
    { name: "RUU Watch", href: "/ruu-watch", icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden text-foreground">
      {/* Background Ambient */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full mix-blend-screen filter blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full mix-blend-screen filter blur-[100px]" />
      </div>

      {/* Sidebar Desktop */}
      <aside className="w-64 border-r border-border bg-card/30 backdrop-blur-xl hidden md:flex flex-col relative z-20">
        <div className="h-20 flex items-center px-6 border-b border-border shrink-0">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:border-primary/50 transition-colors">
              <ShieldAlert className="w-4 h-4 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              RUUMY<span className="text-primary">.</span>
            </span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">Menu Warga</div>
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.name} href={link.href}>
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all group">
                  <Icon className="w-5 h-5 group-hover:text-primary transition-colors" />
                  <span className="font-medium text-sm">{link.name}</span>
                </div>
              </Link>
            );
          })}

          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-6 mb-4 px-2">Data Publik</div>
          {publicLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.name} href={link.href}>
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all group">
                  <Icon className="w-5 h-5 group-hover:text-primary transition-colors" />
                  <span className="font-medium text-sm">{link.name}</span>
                </div>
              </Link>
            );
          })}

          {/* Admin Panel Link for Admins */}
          {(session.user as any).role === "ADMIN" || (session.user as any).role === "MODERATOR" ? (
            <div className="mt-8">
              <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-4 px-2">Staff Only</div>
              <Link href="/admin">
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-primary hover:bg-primary/10 transition-all group border border-primary/20">
                  <Settings className="w-5 h-5" />
                  <span className="font-medium text-sm">Masuk Admin Panel</span>
                </div>
              </Link>
            </div>
          ) : null}
        </div>

        <div className="p-4 border-t border-border shrink-0">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-slate-400 flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20 shrink-0">
              {(session.user.name || "U").charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-sm font-medium text-foreground truncate">{session.user.name}</div>
              <div className="text-xs text-muted-foreground truncate">{session.user.email}</div>
            </div>
          </div>
          <Link href="/api/auth/signout" className="mt-4 flex items-center gap-3 px-3 py-2.5 rounded-lg text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-all group">
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Keluar</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-20 border-b border-border bg-background/50 backdrop-blur-xl flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 shrink-0">
          <div className="flex items-center text-muted-foreground">
            <MobileNav session={session} />
            <h1 className="text-lg font-bold text-foreground ml-2 md:ml-0">Dashboard Citizen</h1>
          </div>
          <DashboardNavbarActions />
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
