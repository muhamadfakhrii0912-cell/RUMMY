"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LayoutDashboard, Target, BookOpen, FileText } from "lucide-react";

export function PublicMobileMenu({ session }: { session: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = () => setIsOpen(!isOpen);

  const navContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-x-0 top-20 bg-[#0a0a0b]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl z-[9999] md:hidden"
        >
          <div className="px-6 py-8 flex flex-col gap-6">
            <Link href="/database" onClick={handleToggle} className="flex items-center gap-4 text-lg font-medium text-muted-foreground hover:text-white transition-colors">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              Database Janji
            </Link>
            <Link href="/ruu-watch" onClick={handleToggle} className="flex items-center gap-4 text-lg font-medium text-muted-foreground hover:text-white transition-colors">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              RUU Watch
            </Link>
            <Link href="/promise-radar" onClick={handleToggle} className="flex items-center gap-4 text-lg font-medium text-muted-foreground hover:text-white transition-colors">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              Promise Radar
            </Link>

            <div className="h-px bg-white/10 w-full my-2"></div>
            
            {session ? (
              <Link href="/dashboard" onClick={handleToggle} className="h-12 flex items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary font-medium hover:bg-primary/20 transition-all w-full">
                <LayoutDashboard className="w-5 h-5 mr-2" />
                Dashboard
              </Link>
            ) : (
              <Link href="/login" onClick={handleToggle} className="h-12 flex items-center justify-center rounded-full bg-primary text-primary-foreground font-medium shadow-[0_0_20px_-5px_rgba(45,212,191,0.4)] hover:bg-primary/90 transition-all w-full">
                Masuk / Daftar
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        onClick={handleToggle}
        className="md:hidden w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white transition-all"
        aria-label="Toggle Menu"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
      {mounted && typeof document !== "undefined" ? createPortal(navContent, document.body) : null}
    </>
  );
}
