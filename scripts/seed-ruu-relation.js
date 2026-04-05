const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Mencari data Promise (Janji) dan Legislation (RUU) yang ada...\n");

  // Ambil RUU pertama
  const legislation = await prisma.legislation.findFirst();
  if (!legislation) {
    console.log("❌ Belum ada data RUU di database.");
    console.log("   Jalankan dulu: node scripts/seed-legislations.js");
    return;
  }
  console.log(`✅ RUU ditemukan: "${legislation.title}"`);

  // Ambil janji pertama
  const promise1 = await prisma.promise.findFirst({
    include: { politician: true },
  });
  if (!promise1) {
    console.log("❌ Belum ada data Janji di database.");
    console.log("   Tambahkan data janji melalui Admin Panel terlebih dahulu.");
    return;
  }
  console.log(`✅ Janji #1 ditemukan: "${promise1.title}" oleh ${promise1.politician.name}`);

  // ============================================
  // 1) Buat relasi KONTRADIKSI (merah)
  // ============================================
  const existing1 = await prisma.promiseLegislation.findUnique({
    where: {
      promiseId_legislationId: {
        promiseId: promise1.id,
        legislationId: legislation.id,
      },
    },
  });

  if (!existing1) {
    await prisma.promiseLegislation.create({
      data: {
        promiseId: promise1.id,
        legislationId: legislation.id,
        relationType: "CONTRADICTS",
        notes:
          "Analisis AI menemukan bahwa RUU ini bertentangan dengan janji kampanye terkait. " +
          "Pasal 12 dalam RUU justru menambah beban pajak UMKM, padahal politisi berjanji meringankan pajak usaha kecil.",
      },
    });
    console.log("🔴 Relasi KONTRADIKSI berhasil dibuat!");
  } else {
    console.log("⚠️  Relasi untuk janji #1 sudah ada, dilewati.");
  }

  // ============================================
  // 2) Buat relasi MENDUKUNG (hijau)
  // ============================================
  // Cari janji ke-2 yang berbeda, atau buat dummy
  let promise2 = await prisma.promise.findFirst({
    where: { NOT: { id: promise1.id } },
    include: { politician: true },
  });

  if (!promise2) {
    // Buat janji dummy jika hanya ada 1
    promise2 = await prisma.promise.create({
      data: {
        title: "Memperluas Akses Internet ke Pelosok Desa",
        description:
          "Berjanji membangun infrastruktur fiber optik hingga ke desa-desa terpencil agar semua warga dapat mengakses internet.",
        category: "INFRASTRUKTUR",
        politicianId: promise1.politicianId,
        status: "PENDING",
      },
      include: { politician: true },
    });
    console.log(`✅ Janji #2 dummy dibuat: "${promise2.title}"`);
  } else {
    console.log(`✅ Janji #2 ditemukan: "${promise2.title}" oleh ${promise2.politician.name}`);
  }

  const existing2 = await prisma.promiseLegislation.findUnique({
    where: {
      promiseId_legislationId: {
        promiseId: promise2.id,
        legislationId: legislation.id,
      },
    },
  });

  if (!existing2) {
    await prisma.promiseLegislation.create({
      data: {
        promiseId: promise2.id,
        legislationId: legislation.id,
        relationType: "SUPPORTS",
        notes:
          "Pasal 4 dan Pasal 7 pada RUU ini selaras dengan janji penyediaan infrastruktur digital. " +
          "Alokasi anggaran dalam RUU mendukung implementasi janji tersebut.",
      },
    });
    console.log("🟢 Relasi MENDUKUNG berhasil dibuat!");
  } else {
    console.log("⚠️  Relasi untuk janji #2 sudah ada, dilewati.");
  }

  console.log("\n" + "=".repeat(60));
  console.log("🎉 SELESAI! Data relasi RUU ↔ Janji berhasil ditambahkan.");
  console.log("=".repeat(60));
  console.log(`\n👉 Buka browser Anda ke:`);
  console.log(`   http://localhost:3000/ruu-watch/${legislation.id}`);
  console.log(`\n   Scroll ke bawah dan lihat bagian "Deteksi Hubungan & Janji Politik"`);
  console.log(`   Anda akan melihat:`);
  console.log(`   🔴 Kotak merah  = Kontradiksi Janji`);
  console.log(`   🟢 Kotak hijau  = Mendukung Janji`);
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
