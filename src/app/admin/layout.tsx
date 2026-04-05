import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  Users, 
  Database, 
  FileText, 
  Settings, 
  LogOut, 
  ShieldAlert,
  Search,
  Bell,
  Scale,
  MessageSquareWarning
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  // Check Authorization
  const userRole = (session.user as any).role;
  if (userRole !== "ADMIN" && userRole !== "MODERATOR") {
    redirect("/dashboard");
  }

  const navLinks = [
    { name: "Admin Panel", href: "/admin", icon: ShieldAlert },
    { name: "Politicians", href: "/admin/politicians", icon: Users },
    { name: "Database Janji", href: "/admin/promises", icon: Database },
    { name: "Verifications", href: "/admin/verifications", icon: MessageSquareWarning },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden text-foreground">
      {/* Background Ambient for Admin - More severe colors like Red/Purple */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 rounded-full mix-blend-screen filter blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full mix-blend-screen filter blur-[100px]" />
      </div>

      {/* Sidebar */}
      <aside className="w-64 border-r border-red-500/10 bg-background/50 backdrop-blur-xl hidden md:flex flex-col relative z-20">
        <div className="h-20 flex items-center px-6 border-b border-red-500/10">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-[0_0_15px_-3px_rgba(239,68,68,0.3)]">
              <ShieldAlert className="w-4 h-4 text-red-500" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              RUUMY<span className="text-red-500">.</span>
            </span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <div className="text-xs font-semibold text-red-500/80 uppercase tracking-wider mb-4 px-2">Control Center</div>
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.name} href={link.href}>
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 transition-all group">
                  <Icon className="w-5 h-5 group-hover:text-red-400 transition-colors" />
                  <span className="font-medium text-sm">{link.name}</span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-red-500/10">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-red-500/20">
              {(session.user.name || "A").charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-sm font-medium text-white truncate">{session.user.name}</div>
              <div className="text-[10px] font-bold text-red-400 uppercase tracking-wider">{userRole}</div>
            </div>
          </div>
          <Link href="/dashboard" className="mt-4 flex items-center justify-center gap-2 p-2 rounded border border-white/10 text-muted-foreground hover:text-white hover:bg-white/5 transition-all w-full text-sm">
            Kembali ke Citizen view
          </Link>
          <Link href="/api/auth/signout" className="mt-2 flex items-center justify-center gap-2 p-2 rounded bg-destructive/10 text-destructive hover:bg-destructive text-sm font-medium transition-all w-full hover:text-white">
            <LogOut className="w-4 h-4" /> Keluar
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-20 border-b border-red-500/10 bg-background/50 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4 text-muted-foreground">
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              System Administrator <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-red-500/20 text-red-400 border border-red-500/30">Secure</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Global ID Search..." 
                className="w-64 bg-white/5 border border-white/10 rounded-full py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all placeholder:text-muted-foreground/50"
              />
            </div>
            <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white hover:bg-white/10 transition-all relative">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
