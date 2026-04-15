"use client";

import { ThemeToggle } from "@/components/ui/theme-toggle";

export function DashboardNavbarActions() {
  return (
    <div className="flex items-center gap-4">
      <div className="relative hidden md:block">
        <input 
          type="text" 
          placeholder="Cari janji atau RUU..." 
          className="w-64 bg-secondary/50 border border-border rounded-full py-2 pl-9 pr-4 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
        />
      </div>
      <button className="w-10 h-10 rounded-full bg-secondary/50 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all relative shrink-0">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary animate-pulse"></span>
      </button>
      <ThemeToggle />
    </div>
  );
}