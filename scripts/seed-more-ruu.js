const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("📜 Menambahkan data RUU tambahan...\n");

  const ruuData = [
    {
      title: "RUU Kesehatan Omnibus",
      number: "RUU/2026/012",
      type: "RUU",
      status: "Pembahasan DPR",
      description: "Rancangan undang-undang yang mengintegrasikan regulasi kesehatan, farmasi, dan layanan rumah sakit menjadi satu payung hukum komprehensif untuk meningkatkan kualitas pelayanan kesehatan nasional.",
    },
    {
      title: "RUU Energi Terbarukan",
      number: "RUU/2026/008",
      type: "RUU",
      status: "Pembahasan DPR",
      description: "Undang-undang yang mendorong transisi energi nasional dari bahan bakar fosil ke sumber energi terbarukan seperti solar, angin, dan geotermal dengan target 40% bauran energi hijau di 2030.",
    },
    {
      title: "RUU Perlindungan Pekerja Digital",
      number: "RUU/2026/015",
      type: "RUU",
      status: "Inisiatif DPR",
      description: "Regulasi baru untuk melindungi hak-hak pekerja gig economy, freelancer, dan pekerja platform digital termasuk jaminan sosial, upah minimum, dan perlindungan kontrak.",
    },
    {
      title: "RUU Ibu Kota Nusantara (Revisi)",
      number: "RUU/2026/003",
      type: "RUU",
      status: "Disahkan",
      description: "Revisi undang-undang pemindahan ibu kota negara yang mencakup perubahan struktur otorita, alokasi anggaran tahap III, dan mekanisme partisipasi publik dalam pembangunan IKN.",
      passedAt: new Date("2026-03-01"),
    },
    {
      title: "RUU Perubahan Iklim dan Karbon",
      number: "RUU/2026/020",
      type: "RUU",
      status: "Pembahasan DPR",
      description: "Kerangka hukum untuk perdagangan karbon, penetapan batas emisi industri, dan kewajiban pelaporan jejak karbon bagi korporasi besar di Indonesia.",
    },
    {
      title: "RUU Reformasi Pendidikan Tinggi",
      number: "RUU/2026/018",
      type: "RUU",
      status: "Inisiatif DPR",
      description: "Perombakan sistem pendidikan tinggi nasional termasuk otonomi kampus, pendanaan riset, beasiswa wajib untuk mahasiswa berprestasi, dan standardisasi kurikulum berbasis industri.",
    },
  ];

  for (const ruu of ruuData) {
    await prisma.legislation.create({ data: ruu });
    console.log(`✅ ${ruu.title}`);
  }

  console.log("\n🎉 6 RUU tambahan berhasil ditambahkan! Total 8 RUU.");
}

main()
  .catch((e) => { console.error("Error:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
