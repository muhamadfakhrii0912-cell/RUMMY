import { Loader2 } from "lucide-react";

export default function LoadingPoliticians() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-white/10 bg-background/50 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 pt-28 pb-12">
          <div className="w-24 h-6 bg-white/10 rounded-full mb-4 animate-pulse" />
          <div className="w-64 h-12 bg-white/10 rounded-xl mb-4 animate-pulse" />
          <div className="w-full max-w-2xl h-16 bg-white/5 rounded-xl mb-6 animate-pulse" />
          <div className="w-full h-12 bg-white/10 rounded-xl animate-pulse" />
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-center py-20 text-muted-foreground flex-col gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary opacity-50" />
          <p className="animate-pulse">Menyiapkan profil politisi...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-30 mt-8">
          {[...Array(6)].map((_, i) => (
             <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 h-72 animate-pulse flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-full bg-white/10 mb-4" />
                <div className="w-40 h-8 bg-white/10 rounded-xl mb-2" />
                <div className="w-24 h-5 bg-white/5 rounded-xl mb-6" />
                <div className="w-full h-12 bg-white/10 rounded-xl mt-auto" />
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}
