import { prisma } from "@/lib/prisma";
import { createPolitician, deletePolitician } from "../actions";
import { Users, Trash2 } from "lucide-react";

export default async function AdminPoliticiansPage() {
  const politicians = await prisma.politician.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { promises: true } }
    }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <Users className="w-8 h-8 text-primary" /> Database Politisi
        </h1>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Tambah Politisi Baru</h2>
        <form action={createPolitician} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Nama Lengkap</label>
            <input type="text" name="name" required className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-white" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Partai Politik</label>
            <input type="text" name="party" className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-white" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Jabatan Terakhir / Posisi Target</label>
            <input type="text" name="position" className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-white" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-muted-foreground">Biografi / Track Record Singkat</label>
            <textarea name="bio" rows={3} className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-white resize-none"></textarea>
          </div>
          <div className="md:col-span-2 mt-2">
            <button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2.5 px-6 rounded-lg transition-colors">
              Simpan Politisi
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {politicians.map((pol) => (
          <div key={pol.id} className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary/30 to-slate-400/30 flex items-center justify-center text-white text-xl font-bold">
                {pol.name.charAt(0)}
              </div>
              <form action={async () => {
                "use server";
                await deletePolitician(pol.id);
              }}>
                <button type="submit" className="text-red-400 hover:text-red-300 bg-red-500/10 p-2 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </form>
            </div>
            <h3 className="font-bold text-lg text-white">{pol.name}</h3>
            <p className="text-sm text-muted-foreground">{pol.position} • {pol.party}</p>
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Truth Score:</span>
              <span className={`font-bold ${pol.truthScore >= 70 ? 'text-green-500' : pol.truthScore >= 40 ? 'text-yellow-500' : 'text-red-500'}`}>
                {pol.truthScore.toFixed(1)}
              </span>
            </div>
            <div className="mt-1 flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Total Janji:</span>
              <span className="font-bold text-white">{pol._count.promises}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
