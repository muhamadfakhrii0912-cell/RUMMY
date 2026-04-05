import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { FileText, Trash2, Plus } from "lucide-react";

async function createLegislation(data: FormData) {
  "use server";
  await prisma.legislation.create({
    data: {
      title: data.get("title") as string,
      number: data.get("number") as string,
      type: data.get("type") as string,
      status: data.get("status") as string,
      description: data.get("description") as string,
    },
  });
  revalidatePath("/admin/legislations");
  revalidatePath("/ruu-watch");
}

async function deleteLegislation(id: string) {
  "use server";
  await prisma.legislation.delete({ where: { id } });
  revalidatePath("/admin/legislations");
  revalidatePath("/ruu-watch");
}

export default async function AdminLegislationsPage() {
  const legislations = await prisma.legislation.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { promises: true, simulations: true } },
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <FileText className="w-8 h-8 text-red-500" /> Kelola RUU / Legislation
        </h1>
        <p className="text-muted-foreground mt-2">
          Tambah, lihat, dan hapus data Rancangan Undang-Undang yang dipantau platform.
        </p>
      </div>

      {/* Create Form */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" /> Tambah RUU Baru
        </h2>
        <form action={createLegislation} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-muted-foreground">Judul RUU</label>
            <input
              type="text"
              name="title"
              required
              placeholder="Contoh: RUU Perlindungan Data Pribadi"
              className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Nomor RUU</label>
            <input
              type="text"
              name="number"
              placeholder="Contoh: RUU/2026/001"
              className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Tipe</label>
            <select name="type" required className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-white">
              <option value="RUU">RUU</option>
              <option value="UU">UU (Sudah Disahkan)</option>
              <option value="Perppu">Perppu</option>
              <option value="PP">Peraturan Pemerintah</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Status</label>
            <select name="status" required className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-white">
              <option value="Inisiatif DPR">Inisiatif DPR</option>
              <option value="Pembahasan DPR">Pembahasan DPR</option>
              <option value="Menunggu Pengesahan">Menunggu Pengesahan</option>
              <option value="Disahkan">Disahkan</option>
              <option value="Ditolak">Ditolak</option>
            </select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-muted-foreground">Deskripsi / Ringkasan Isi RUU</label>
            <textarea
              name="description"
              required
              rows={4}
              placeholder="Jelaskan inti dari RUU ini, pasal-pasal penting, dan dampak yang diharapkan..."
              className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-white resize-none"
            ></textarea>
          </div>
          <div className="md:col-span-2 mt-2">
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 px-6 rounded-lg transition-colors"
            >
              Simpan RUU
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="space-y-4">
        {legislations.map((ruu) => (
          <div key={ruu.id} className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                  ruu.status === "Disahkan" ? "bg-green-500/20 text-green-400" :
                  ruu.status === "Ditolak" ? "bg-red-500/20 text-red-400" :
                  "bg-yellow-500/20 text-yellow-400"
                }`}>
                  {ruu.status}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">{ruu.number}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{ruu.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{ruu.description}</p>
              <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                <span>🔗 {ruu._count.promises} relasi janji</span>
                <span>📊 {ruu._count.simulations} simulasi</span>
                <span>📅 {ruu.createdAt.toLocaleDateString("id-ID")}</span>
              </div>
            </div>
            <form action={async () => {
              "use server";
              await deleteLegislation(ruu.id);
            }}>
              <button type="submit" className="text-red-400 hover:text-red-300 bg-red-500/10 p-2 rounded-lg shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </form>
          </div>
        ))}

        {legislations.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Belum ada data RUU. Tambahkan melalui form di atas.
          </div>
        )}
      </div>
    </div>
  );
}
