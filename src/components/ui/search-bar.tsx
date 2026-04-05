"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState } from "react";

export function SearchBar({ placeholder = "Cari data..." }: { placeholder?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams?.get("q") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      const params = new URLSearchParams(searchParams?.toString());
      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md">
      <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isPending ? "text-primary animate-pulse" : "text-muted-foreground"}`} />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-colors hover:bg-white/10"
      />
      <button type="submit" className="hidden">Cari</button>
    </form>
  );
}
