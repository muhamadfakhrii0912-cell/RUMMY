import { Loader2 } from "lucide-react";

export default function LoadingDatabase() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-white/10 bg-background/50 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 pt-28 pb-12">
          <div className="w-24 h-6 bg-white/10 rounded-full mb-4 animate-pulse" />
          <div className="w-64 h-12 bg-white/10 rounded-xl mb-4 animate-pulse" />
          <div className="w-full max-w-2xl h-16 bg-white/5 rounded-xl mb-6 animate-pulse" />
          <div className="flex gap-4">
             <div className="w-full h-12 bg-white/10 rounded-xl animate-pulse" />
             <div className="w-32 h-12 bg-white/10 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-center py-20 text-muted-foreground flex-col gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary opacity-50" />
          <p className="animate-pulse">Mengambil data janji politik...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-30 mt-8">
          {[...Array(4)].map((_, i) => (
             <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 h-64 animate-pulse flex flex-col">
                <div className="flex justify-between w-full mb-4">
                   <div className="w-24 h-6 bg-white/10 rounded-full" />
                   <div className="w-20 h-6 bg-white/10 rounded-full" />
                </div>
                <div className="w-full h-8 bg-white/10 rounded-xl mb-3" />
                <div className="w-3/4 h-16 bg-white/5 rounded-xl mb-auto" />
                <div className="w-full h-10 bg-white/10 rounded-xl mt-4" />
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}
