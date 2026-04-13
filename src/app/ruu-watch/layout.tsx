import { PublicNavbar } from "@/components/ui/public-navbar";

export default function RuuWatchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/30 selection:text-white">
      <PublicNavbar />
      <div className="flex-1 w-full relative">
        {children}
      </div>
    </div>
  );
}
