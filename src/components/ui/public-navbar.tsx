import Link from "next/link";
import { ShieldAlert, BookOpen, FileText, LayoutDashboard, Target } from "lucide-react";
import { PublicMobileMenu } from "@/components/ui/public-mobile-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function PublicNavbar() {
  const session = await getServerSession(authOptions);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/40 transition-colors" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-muted border border-border flex items-center justify-center transform group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-5 h-5 text-primary group-hover:animate-pulse" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground hidden sm:block">
              RUUMY<span className="text-primary">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/database" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Database Janji
            </Link>
            <Link href="/ruu-watch" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
              <FileText className="w-4 h-4" /> RUU Watch
            </Link>
            <Link href="/promise-radar" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
              <Target className="w-4 h-4" /> Radar
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            {session ? (
              <Link href="/dashboard" className="h-10 inline-flex items-center justify-center rounded-full bg-primary/10 border border-primary/20 px-6 text-sm font-medium text-primary hover:bg-primary/20 transition-all">
                <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
              </Link>
            ) : (
              <Link href="/login" className="h-10 inline-flex items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow-[0_0_20px_-5px_rgba(45,212,191,0.4)] hover:bg-primary/90 transition-all">
                Masuk / Daftar
              </Link>
            )}
          </div>
          
          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <PublicMobileMenu session={session} />
          </div>
        </div>
      </div>
    </nav>
  );
}
