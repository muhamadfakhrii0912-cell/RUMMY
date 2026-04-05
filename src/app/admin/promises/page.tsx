import { prisma } from "@/lib/prisma";
import { createPromise, deletePromise, changePromiseStatus } from "../actions";
import { Database, Trash2, Edit } from "lucide-react";

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
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <Database className="w-8 h-8 text-red-500" /> Database Janji (CRUD)
        </h1>
        <p className="text-muted-foreground mt-2">
          Kelola data janji politik. Perubahan status di sini otomatis kalkulasi ulang Truth Score politisi.
        </p>
      </div>

      {/* Create Form */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Tambah Janji Baru</h2>
        <form action={createPromise} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Pilih Politisi</label>
            <select name="politicianId" required className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-white">
              {politicians.map(p => (
                <option key={p.id} value={p.id}>{p.name} - {p.position}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Kategori</label>
            <select name="category" required className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-white">
              <option value="Infrastruktur">Infrastruktur</option>
              <option value="Ekonomi">Ekonomi</option>
              <option value="Kesehatan">Kesehatan</option>
              <option value="Pendidikan">Pendidikan</option>
              <option value="Hukum">Hukum</option>
            </select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-muted-foreground">Judul Janji / Tagline</label>
            <input type="text" name="title" required placeholder="Contoh: Pembangunan MRT..." className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-white" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-muted-foreground">Deskripsi Detail</label>
            <textarea name="description" required rows={3} className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-white resize-none" placeholder="Deskripsi..."></textarea>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Status Awal</label>
            <select name="status" className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-white">
              <option value="PENDING">PENDING</option>
              <option value="ON_TRACK">ON_TRACK</option>
              <option value="FULFILLED">FULFILLED</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div>
          <div className="md:col-span-2 mt-2">
            <button type="submit" className="bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 px-6 rounded-lg transition-colors">
              Simpan Janji
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-muted-foreground">
            <thead className="bg-white/5 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium text-white">Politisi</th>
                <th className="px-6 py-4 font-medium text-white">Judul Janji</th>
                <th className="px-6 py-4 font-medium text-white">Status</th>
                <th className="px-6 py-4 font-medium text-white text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {promises.map((promise) => (
                <tr key={promise.id} className="hover:bg-white/5">
                  <td className="px-6 py-4 font-medium text-white">{promise.politician.name}</td>
                  <td className="px-6 py-4">
                    <div className="line-clamp-1 font-medium">{promise.title}</div>
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
                        className="bg-background border border-white/10 rounded p-1 text-xs text-white"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="ON_TRACK">ON_TRACK</option>
                        <option value="FULFILLED">FULFILLED</option>
                        <option value="FAILED">FAILED</option>
                        <option value="CONTRADICTED">CONTRADICTED</option>
                      </select>
                      <button type="submit" className="text-[10px] font-bold bg-white/10 hover:bg-white/20 px-2 py-1 rounded">Simpan</button>
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
