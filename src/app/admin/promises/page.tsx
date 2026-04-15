import { prisma } from "@/lib/prisma";
import { createPromise, deletePromise, changePromiseStatus } from "../actions";
import { Database, Trash2 } from "lucide-react";

// Shared semantic input class
const inputCls = "w-full bg-background border border-border rounded-lg p-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all";

export default async function AdminPromisesPage() {
  const promises = await prisma.promise.findMany({
    include: { politician: true },
    orderBy: { createdAt: "desc" }
  });

  const politicians = await prisma.politician.findMany({
    orderBy: { name: "asc" }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Database className="w-8 h-8 text-primary" /> Database Janji (CRUD)
        </h1>
        <p className="text-muted-foreground mt-2">
          Kelola data janji politik. Perubahan status di sini otomatis kalkulasi ulang Truth Score politisi.
        </p>
      </div>

      {/* Create Form */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-foreground mb-4">Tambah Janji Baru</h2>
        <form action={createPromise} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Pilih Politisi</label>
            <select name="politicianId" required className={inputCls}>
              {politicians.map(p => (
                <option key={p.id} value={p.id}>{p.name} - {p.position}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Kategori</label>
            <select name="category" required className={inputCls}>
              <option value="Infrastruktur">Infrastruktur</option>
              <option value="Ekonomi">Ekonomi</option>
              <option value="Kesehatan">Kesehatan</option>
              <option value="Pendidikan">Pendidikan</option>
              <option value="Hukum">Hukum</option>
            </select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-muted-foreground">Judul Janji / Tagline</label>
            <input type="text" name="title" required placeholder="Contoh: Pembangunan MRT..." className={inputCls} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-muted-foreground">Deskripsi Detail</label>
            <textarea name="description" required rows={3} className={`${inputCls} resize-none`} placeholder="Deskripsi..."></textarea>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Status Awal</label>
            <select name="status" className={inputCls}>
              <option value="PENDING">PENDING</option>
              <option value="ON_TRACK">ON_TRACK</option>
              <option value="FULFILLED">FULFILLED</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div>
          <div className="md:col-span-2 mt-2">
            <button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2.5 px-6 rounded-lg transition-colors">
              Simpan Janji
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-muted-foreground">
            <thead className="bg-secondary text-xs uppercase text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold text-foreground">Politisi</th>
                <th className="px-6 py-4 font-semibold text-foreground">Judul Janji</th>
                <th className="px-6 py-4 font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 font-semibold text-foreground text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {promises.map((promise) => (
                <tr key={promise.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{promise.politician.name}</td>
                  <td className="px-6 py-4">
                    <div className="line-clamp-1 font-medium text-foreground">{promise.title}</div>
                    <div className="text-[10px] uppercase text-red-400 mt-1">{promise.category}</div>
                  </td>
                  <td className="px-6 py-4">
                    <form action={async (formData) => {
                      "use server";
                      await changePromiseStatus(promise.id, promise.politicianId, formData.get("status") as any);
                    }} className="flex items-center gap-2">
                      <select 
                        name="status" 
                        defaultValue={promise.status} 
                        className="bg-background border border-border rounded p-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="ON_TRACK">ON_TRACK</option>
                        <option value="FULFILLED">FULFILLED</option>
                        <option value="FAILED">FAILED</option>
                        <option value="CONTRADICTED">CONTRADICTED</option>
                      </select>
                      <button type="submit" className="text-[10px] font-bold bg-primary/10 hover:bg-primary/20 text-primary px-2 py-1 rounded border border-primary/20 transition-colors">Simpan</button>
                    </form>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <form action={async () => {
                      "use server";
                      await deletePromise(promise.id, promise.politicianId);
                    }}>
                      <button type="submit" className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
