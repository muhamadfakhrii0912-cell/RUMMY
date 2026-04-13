"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  LayoutDashboard,
  Bookmark,
  MessageSquare,
  Settings,
  ShieldAlert,
  Database,
  Users,
  Target,
  FileText,
  LogOut,
} from "lucide-react";

interface NavLink {
  name: string;
  href: string;
  icon: any;
}

const navLinks: NavLink[] = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Lapor Fakta", href: "/dashboard/report", icon: ShieldAlert },
  { name: "Bookmarks Server", href: "/dashboard/bookmarks", icon: Bookmark },
  { name: "Diskusi & Opini", href: "/dashboard/discussions", icon: MessageSquare },
  { name: "Pengaturan Akun", href: "/dashboard/settings", icon: Settings },
];

const publicLinks: NavLink[] = [
  { name: "Database Janji", href: "/database", icon: Database },
  { name: "Profil Politisi", href: "/politicians", icon: Users },
  { name: "Promise Radar", href: "/promise-radar", icon: Target },
  { name: "RUU Watch", href: "/ruu-watch", icon: FileText },
];

export function MobileNav({ session }: { session: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const handleToggle = () => setIsOpen(!isOpen);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleToggle}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[9998] md:hidden"
          />
          {/* Sidebar off-canvas */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="fixed inset-y-0 left-0 w-[280px] bg-[#0a0a0b] border-r border-white/10 shadow-2xl z-[9999] flex flex-col md:hidden"
          >
            <div className="h-20 flex items-center justify-between px-6 border-b border-white/10 shrink-0">
              <Link href="/" className="flex items-center gap-2 group" onClick={handleToggle}>
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                  <ShieldAlert className="w-4 h-4 text-primary" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">
                  RUUMY<span className="text-primary">.</span>
                </span>
              </Link>
              <button
                onClick={handleToggle}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">
                Menu Warga
              </div>
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link key={link.name} href={link.href} onClick={handleToggle}>
                    <div
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                        isActive
                          ? "bg-primary/20 text-primary border-transparent"
                          : "text-muted-foreground hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium text-sm">{link.name}</span>
                    </div>
                  </Link>
                );
              })}

              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-6 mb-4 px-2">
                Data Publik
              </div>
              {publicLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link key={link.name} href={link.href} onClick={handleToggle}>
                    <div
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                        isActive
                          ? "bg-blue-400/20 text-blue-400"
                          : "text-muted-foreground hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium text-sm">{link.name}</span>
                    </div>
                  </Link>
                );
              })}

              {(session?.user?.role === "ADMIN" || session?.user?.role === "MODERATOR") && (
                <div className="mt-8">
                  <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-4 px-2">
                    Staff Only
                  </div>
                  <Link href="/admin" onClick={handleToggle}>
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-primary hover:bg-primary/10 transition-all border border-primary/20">
                      <Settings className="w-5 h-5" />
                      <span className="font-medium text-sm">Masuk Admin Panel</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/10 shrink-0">
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20 shrink-0">
                  {(session?.user?.name || "U").charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm font-medium text-white truncate">
                    {session?.user?.name || "User"}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {session?.user?.email || "Email"}
                  </div>
                </div>
              </div>
              <Link
                href="/api/auth/signout"
                className="mt-4 flex items-center gap-3 px-3 py-2.5 rounded-lg text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-all group"
                onClick={handleToggle}
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium text-sm">Keluar</span>
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        onClick={handleToggle}
        className="md:hidden w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white transition-all mr-3"
        aria-label="Toggle Navigation"
      >
        <Menu className="w-5 h-5" />
      </button>

      {mounted && typeof document !== "undefined" ? createPortal(navContent, document.body) : null}
    </>
  );
}
