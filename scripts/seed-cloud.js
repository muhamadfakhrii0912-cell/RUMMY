const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Seeding database cloud Neon...\n");

  // 1. Create Admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@ruumy.id" },
    update: {},
    create: {
      name: "Admin RUUMY",
      email: "admin@ruumy.id",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user dibuat:", admin.email, "(password: admin123)");

  // 2. Create Politicians
  const politisi1 = await prisma.politician.create({
    data: {
      name: "Gubernur X",
      party: "Partai Keadilan Rakyat",
      position: "Gubernur",
      bio: "Gubernur yang menjanjikan pembangunan infrastruktur dan transparansi pemerintahan.",
      truthScore: 65.0,
    },
  });

  const politisi2 = await prisma.politician.create({
    data: {
      name: "Budi Santoso",
      party: "Partai Demokrat Maju",
      position: "Anggota DPR RI",
      bio: "Wakil rakyat yang fokus pada pendidikan dan kesehatan masyarakat.",
      truthScore: 50.0,
    },
  });

  const politisi3 = await prisma.politician.create({
    data: {
      name: "Siti Rahayu",
      party: "Partai Amanat Bangsa",
      position: "Walikota",
      bio: "Walikota yang berjanji memperbaiki tata kota dan kesejahteraan warga.",
      truthScore: 80.0,
    },
  });
  console.log("✅ 3 Politisi dibuat:", politisi1.name, politisi2.name, politisi3.name);

  // 3. Create Promises
  const promises = await Promise.all([
    prisma.promise.create({
      data: {
        politicianId: politisi1.id,
        title: "Pembangunan Jalur MRT Timur-Barat",
        description: "Membangun jalur MRT Fase Timur-Barat sepanjang 30 KM untuk mengurangi kemacetan komuter.",
        category: "Infrastruktur",
        status: "ON_TRACK",
      },
    }),
    prisma.promise.create({
      data: {
        politicianId: politisi1.id,
        title: "Program Internet Gratis untuk Sekolah",
        description: "Menyediakan akses internet gratis berkecepatan tinggi untuk 1000 sekolah negeri.",
        category: "Pendidikan",
        status: "PENDING",
      },
    }),
    prisma.promise.create({
      data: {
        politicianId: politisi2.id,
        title: "Pendidikan Gratis Sampai Kuliah",
        description: "Memastikan setiap anak Indonesia mendapat pendidikan gratis dari SD hingga perguruan tinggi negeri.",
        category: "Pendidikan",
        status: "PENDING",
      },
    }),
    prisma.promise.create({
      data: {
        politicianId: politisi2.id,
        title: "Pembukaan 500.000 Lapangan Kerja Baru",
        description: "Program penciptaan lapangan kerja baru melalui investasi dan pelatihan vokasi.",
        category: "Ekonomi",
        status: "FAILED",
      },
    }),
    prisma.promise.create({
      data: {
        politicianId: politisi3.id,
        title: "Revitalisasi 50 Taman Kota",
        description: "Merenovasi dan membangun 50 taman kota baru sebagai ruang publik hijau berkualitas.",
        category: "Infrastruktur",
        status: "FULFILLED",
      },
    }),
    prisma.promise.create({
      data: {
        politicianId: politisi3.id,
        title: "Puskesmas 24 Jam di Seluruh Kecamatan",
        description: "Membuka layanan Puskesmas 24 jam di setiap kecamatan untuk akses kesehatan yang lebih baik.",
        category: "Kesehatan",
        status: "ON_TRACK",
      },
    }),
  ]);
  console.log("✅ 6 Janji Politik dibuat");

  // 4. Create Legislation
  const ruu1 = await prisma.legislation.create({
    data: {
      title: "RUU Perlindungan Data Pribadi",
      number: "RUU/2026/001",
      type: "RUU",
      status: "Pembahasan DPR",
      description: "Rancangan undang-undang yang mengatur perlindungan data pribadi warga negara di era digital.",
      passedAt: null,
    },
  });

  const ruu2 = await prisma.legislation.create({
    data: {
      title: "RUU Ketahanan Pangan Nasional",
      number: "RUU/2026/005",
      type: "RUU",
      status: "Disahkan",
      description: "Undang-undang baru untuk menjamin ketersediaan pangan nasional dan melindungi petani lokal.",
      passedAt: new Date("2026-02-15"),
    },
  });
  console.log("✅ 2 RUU/Legislation dibuat");

  // 5. Create Promise-Legislation relations
  await prisma.promiseLegislation.create({
    data: {
      promiseId: promises[0].id,
      legislationId: ruu1.id,
      relationType: "CONTRADICTS",
      notes: "Pasal 12 dalam RUU bertentangan dengan janji transparansi infrastruktur.",
    },
  });

  await prisma.promiseLegislation.create({
    data: {
      promiseId: promises[1].id,
      legislationId: ruu1.id,
      relationType: "SUPPORTS",
      notes: "Pasal 4 dan 7 pada RUU mendukung digitalisasi pendidikan.",
    },
  });
  console.log("✅ Relasi RUU ↔ Janji dibuat");

  console.log("\n" + "=".repeat(50));
  console.log("🎉 SEEDING CLOUD DATABASE SELESAI!");
  console.log("=".repeat(50));
  console.log("\n📧 Login Admin: admin@ruumy.id / admin123");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
