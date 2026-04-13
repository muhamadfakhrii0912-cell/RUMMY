"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Users,
  Database,
  FileText,
  LogOut,
  ShieldAlert,
  Scale,
  MessageSquareWarning
} from "lucide-react";

interface NavLink {
  name: string;
  href: string;
  icon: any;
}

const navLinks: NavLink[] = [
  { name: "Admin Panel", href: "/admin", icon: ShieldAlert },
  { name: "Politicians", href: "/admin/politicians", icon: Users },
  { name: "Database Janji", href: "/admin/promises", icon: Database },
  { name: "RUU / Legislation", href: "/admin/legislations", icon: Scale },
  { name: "Verifications", href: "/admin/verifications", icon: MessageSquareWarning },
];

export function AdminMobileNav({ session, userRole }: { session: any, userRole: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  const handleToggle = () => setIsOpen(!isOpen);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleToggle}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[9998] md:hidden"
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="fixed inset-y-0 left-0 w-[280px] bg-[#0a0a0b] border-r border-red-500/10 shadow-[5px_0_30px_-5px_rgba(239,68,68,0.2)] z-[9999] flex flex-col md:hidden"
          >
            <div className="h-20 flex items-center justify-between px-6 border-b border-red-500/10 shrink-0">
              <Link href="/" className="flex items-center gap-2 group" onClick={handleToggle}>
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-[0_0_15px_-3px_rgba(239,68,68,0.3)]">
                  <ShieldAlert className="w-4 h-4 text-red-500" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">
                  RUUMY<span className="text-red-500">.</span>
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
              <div className="text-xs font-semibold text-red-500/80 uppercase tracking-wider mb-4 px-2">Control Center</div>
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link key={link.name} href={link.href} onClick={handleToggle}>
                    <div
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                        isActive
                          ? "bg-red-500/20 text-red-400 border-transparent"
                          : "text-muted-foreground hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium text-sm">{link.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="p-4 border-t border-red-500/10 shrink-0">
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-red-500/20 shrink-0">
                  {(session?.user?.name || "A").charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm font-medium text-white truncate">{session?.user?.name}</div>
                  <div className="text-[10px] font-bold text-red-400 uppercase tracking-wider">{userRole}</div>
                </div>
              </div>
              <Link href="/dashboard" className="mt-4 flex items-center justify-center gap-2 p-2 rounded border border-white/10 text-muted-foreground hover:text-white hover:bg-white/5 transition-all w-full text-sm" onClick={handleToggle}>
                Kembali ke Citizen view
              </Link>
              <Link href="/api/auth/signout" className="mt-2 flex items-center justify-center gap-2 p-2 rounded bg-destructive/10 text-destructive hover:bg-destructive text-sm font-medium transition-all w-full hover:text-white" onClick={handleToggle}>
                <LogOut className="w-4 h-4" /> Keluar
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
        aria-label="Toggle Admin Navigation"
      >
        <Menu className="w-5 h-5" />
      </button>

      {mounted && typeof document !== "undefined" ? createPortal(navContent, document.body) : null}
    </>
  );
}
