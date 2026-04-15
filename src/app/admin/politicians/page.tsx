import { prisma } from "@/lib/prisma";
import { createPolitician, deletePolitician } from "../actions";
import { Users, Trash2 } from "lucide-react";

const inputCls = "w-full bg-background border border-border rounded-lg p-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all";

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
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Users className="w-8 h-8 text-primary" /> Database Politisi
        </h1>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-foreground mb-4">Tambah Politisi Baru</h2>
        <form action={createPolitician} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Nama Lengkap</label>
            <input type="text" name="name" required className={inputCls} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Partai Politik</label>
            <input type="text" name="party" className={inputCls} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Jabatan Terakhir / Posisi Target</label>
            <input type="text" name="position" className={inputCls} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-muted-foreground">Biografi / Track Record Singkat</label>
            <textarea name="bio" rows={3} className={`${inputCls} resize-none`}></textarea>
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
          <div key={pol.id} className="bg-card border border-border rounded-xl p-5 flex flex-col shadow-sm hover:border-primary/30 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-xl font-bold">
                {pol.name.charAt(0)}
              </div>
              <form action={async () => {
                "use server";
                await deletePolitician(pol.id);
              }}>
                <button type="submit" className="text-red-400 hover:text-red-300 bg-red-500/10 p-2 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </form>
            </div>
            <h3 className="font-bold text-lg text-foreground">{pol.name}</h3>
            <p className="text-sm text-muted-foreground">{pol.position} • {pol.party}</p>
            <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Truth Score:</span>
              <span className={`font-bold ${pol.truthScore >= 70 ? 'text-green-500' : pol.truthScore >= 40 ? 'text-yellow-500' : 'text-red-500'}`}>
                {pol.truthScore.toFixed(1)}
              </span>
            </div>
            <div className="mt-1 flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Total Janji:</span>
              <span className="font-bold text-foreground">{pol._count.promises}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
