const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🔗 Menambahkan relasi RUU ↔ Janji untuk semua RUU...\n");

  const allRuu = await prisma.legislation.findMany();
  const allPromises = await prisma.promise.findMany({ include: { politician: true } });

  console.log(`📜 Total RUU: ${allRuu.length}`);
  console.log(`📋 Total Janji: ${allPromises.length}\n`);

  const relations = [
    // RUU Kesehatan Omnibus ↔ Puskesmas 24 Jam
    { ruuTitle: "RUU Kesehatan Omnibus", promiseTitle: "Puskesmas 24 Jam", type: "SUPPORTS", notes: "Pasal 15 RUU ini mendukung perluasan layanan kesehatan primer 24 jam di seluruh kecamatan. Selaras dengan janji Puskesmas 24 jam." },
    
    // RUU Energi Terbarukan ↔ MRT (kontradiksi karena anggaran)
    { ruuTitle: "RUU Energi Terbarukan", promiseTitle: "Pembangunan Jalur MRT", type: "CONTRADICTS", notes: "Alokasi anggaran besar untuk transisi energi berpotensi mengurangi dana pembangunan infrastruktur transportasi seperti MRT." },
    
    // RUU Pekerja Digital ↔ Lapangan Kerja
    { ruuTitle: "RUU Perlindungan Pekerja Digital", promiseTitle: "500.000 Lapangan Kerja", type: "SUPPORTS", notes: "Perlindungan pekerja digital akan menstabilkan ekosistem gig economy dan mendukung penciptaan lapangan kerja baru di sektor digital." },
    
    // RUU IKN Revisi ↔ MRT (mendukung)
    { ruuTitle: "RUU Ibu Kota Nusantara", promiseTitle: "Pembangunan Jalur MRT", type: "SUPPORTS", notes: "Revisi UU IKN mencakup pembangunan transportasi massal termasuk MRT di koridor baru ibu kota, mendukung janji infrastruktur transportasi." },
    
    // RUU IKN Revisi ↔ Internet Gratis (kontradiksi)
    { ruuTitle: "RUU Ibu Kota Nusantara", promiseTitle: "Internet Gratis", type: "CONTRADICTS", notes: "Prioritas anggaran IKN tahap III berpotensi mengalihkan dana dari program digitalisasi pendidikan di daerah lain." },
    
    // RUU Perubahan Iklim ↔ Taman Kota
    { ruuTitle: "RUU Perubahan Iklim", promiseTitle: "Revitalisasi 50 Taman", type: "SUPPORTS", notes: "Kewajiban ruang terbuka hijau dalam RUU ini selaras dengan revitalisasi 50 taman kota sebagai upaya penurunan emisi karbon perkotaan." },
    
    // RUU Reformasi Pendidikan ↔ Pendidikan Gratis
    { ruuTitle: "RUU Reformasi Pendidikan", promiseTitle: "Pendidikan Gratis", type: "SUPPORTS", notes: "Pasal 8 RUU ini mewajibkan beasiswa penuh bagi mahasiswa berprestasi dari keluarga kurang mampu, mendukung janji pendidikan gratis sampai kuliah." },
  ];

  let created = 0;
  for (const rel of relations) {
    // Cari RUU yang cocok (partial match)
    const ruu = allRuu.find(r => r.title.includes(rel.ruuTitle));
    const promise = allPromises.find(p => p.title.includes(rel.promiseTitle));

    if (!ruu || !promise) {
      console.log(`⚠️  Skip: RUU "${rel.ruuTitle}" atau Janji "${rel.promiseTitle}" tidak ditemukan`);
      continue;
    }

    // Cek apakah relasi sudah ada
    const existing = await prisma.promiseLegislation.findUnique({
      where: { promiseId_legislationId: { promiseId: promise.id, legislationId: ruu.id } }
    });

    if (existing) {
      console.log(`⚠️  Relasi "${ruu.title}" ↔ "${promise.title}" sudah ada`);
      continue;
    }

    await prisma.promiseLegislation.create({
      data: {
        promiseId: promise.id,
        legislationId: ruu.id,
        relationType: rel.type,
        notes: rel.notes,
      }
    });
    const icon = rel.type === "SUPPORTS" ? "🟢" : "🔴";
    console.log(`${icon} ${ruu.title} ↔ ${promise.title} (${rel.type})`);
    created++;
  }

  console.log(`\n🎉 ${created} relasi baru berhasil ditambahkan!`);
}

main()
  .catch((e) => { console.error("Error:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
