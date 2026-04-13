const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Menyiapkan Data Demo untuk Presentasi RUUMY...");

  // 1. CLEAR EXISTING DATA to avoid duplicates
  await prisma.impactSimulation.deleteMany({});
  await prisma.promiseLegislation.deleteMany({});
  await prisma.bookmark.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.verification.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.promise.deleteMany({});
  await prisma.legislation.deleteMany({});
  await prisma.politician.deleteMany({});

  console.log("✅ Data lama dibersihkan.");

  // 2. CREATE POLITICIANS (5 Politisi Nasional yang Realistis/Fiktif tapi masuk akal)
  const pol1 = await prisma.politician.create({
    data: { name: "Budi Santoso", party: "Partai Makmur Bersama", position: "Presiden RI", truthScore: 42.5 }
  });
  const pol2 = await prisma.politician.create({
    data: { name: "Rina Wijaya", party: "Partai Keadilan Rakyat", position: "Gubernur DKI Jakarta", truthScore: 85.0 }
  });
  const pol3 = await prisma.politician.create({
    data: { name: "Arif Dirgantara", party: "Golongan Muda", position: "Menteri Pendidikan", truthScore: 60.0 }
  });
  const pol4 = await prisma.politician.create({
    data: { name: "Herman Subianto", party: "Partai Karya Bangsa", position: "Anggota DPR - Komisi III", truthScore: 35.5 }
  });
  const pol5 = await prisma.politician.create({
    data: { name: "Diana Putri", party: "Partai Hijau", position: "Menteri Lingkungan Hidup", truthScore: 78.0 }
  });

  console.log("✅ 5 Politisi dimasukkan.");

  // 3. CREATE PROMISES (15 Janji)
  // Pol 1 (Presiden)
  const prom1 = await prisma.promise.create({
    data: {
      politicianId: pol1.id,
      title: "Menciptakan 10 Juta Lapangan Kerja",
      description: "Berjanji membuka 10 juta lapangan kerja baru dalam 5 tahun melalui industrialisasi dan hilirisasi.",
      category: "Ekonomi",
      status: "FAILED",
      source: "Debat Pilpres 2024",
      deadline: new Date("2029-10-20")
    }
  });
  const prom2 = await prisma.promise.create({
    data: {
      politicianId: pol1.id,
      title: "Tidak Impor Beras Selama Panen Raya",
      description: "Memastikan kedaulatan pangan dengan menyerap hasil panen petani lokal dengan harga IKN.",
      category: "Pertanian",
      status: "CONTRADICTED",
      source: "Kampanye Akbar Jawa Tengah"
    }
  });
  const prom3 = await prisma.promise.create({
    data: {
      politicianId: pol1.id,
      title: "Membangun 5.000 Puskesmas Baru",
      description: "Pemerataan fasilitas kesehatan utama di desa-desa tertinggal.",
      category: "Kesehatan",
      status: "PENDING",
    }
  });

  // Pol 2 (Gubernur)
  const prom4 = await prisma.promise.create({
    data: {
      politicianId: pol2.id,
      title: "Nol Persen Uang Muka Rumah (DP 0 Rupiah)",
      description: "Solusi hunian murah bagi warga ber-KTP ibu kota dengan penghasilan menengah ke bawah.",
      category: "Infrastruktur",
      status: "FAILED"
    }
  });
  const prom5 = await prisma.promise.create({
    data: {
      politicianId: pol2.id,
      title: "Integrasi Transportasi Publik Satu Harga",
      description: "Cukup bayar Rp10.000 untuk naik MRT, LRT, dan TransJakarta seharian.",
      category: "Transportasi",
      status: "FULFILLED"
    }
  });

  // Pol 3 (Mendikbud)
  const prom6 = await prisma.promise.create({
    data: {
      politicianId: pol3.id,
      title: "Gaji Guru Honorer Minimal UMR",
      description: "Pengangkatan jutaan guru honorer menjadi PPPK dan memastikan tidak ada yang digaji 300rb.",
      category: "Pendidikan",
      status: "PENDING"
    }
  });
  const prom7 = await prisma.promise.create({
    data: {
      politicianId: pol3.id,
      title: "Internet Gratis di Seluruh Sekolah",
      description: "Memastikan 100% sekolah di Indonesia terkoneksi dengan internet berkecepatan tinggi.",
      category: "Infrastruktur",
      status: "DELAYED"
    }
  });

  // Pol 4 (DPR)
  const prom8 = await prisma.promise.create({
    data: {
      politicianId: pol4.id,
      title: "Mengesahkan UU Perampasan Aset",
      description: "Mendukung penuh pemberantasan korupsi dengan memiskinkan koruptor.",
      category: "Hukum",
      status: "CONTRADICTED"
    }
  });

  // Pol 5 (Menteri LH)
  const prom9 = await prisma.promise.create({
    data: {
      politicianId: pol5.id,
      title: "Moratorium Izin Tambang Baru",
      description: "Larangan pembukaan lahan baru untuk tambang batubara demi target net-zero emission.",
      category: "Lingkungan",
      status: "CONTRADICTED"
    }
  });
  const prom10 = await prisma.promise.create({
    data: {
      politicianId: pol5.id,
      title: "Bebas Sampah Plastik 2025",
      description: "Melarang penuh kantong plastik sekali pakai di semua retail modern.",
      category: "Lingkungan",
      status: "ON_TRACK"
    }
  });

  console.log("✅ 10 Janji penting dimasukkan.");

  // 4. CREATE LEGISLATIONS (RUU IMPACT)
  const ruu1 = await prisma.legislation.create({
    data: {
      title: "RUU Omnibus Law Ketahanan Pangan (Impor Bebas)",
      number: "RUU No. 12/2025",
      type: "Undang-Undang",
      status: "PEMBAHASAN",
      description: "RUU ini mempermudah kementerian perdagangan untuk memberikan kuota impor hasil pertanian (beras, jagung) tanpa persetujuan ketat dari kementerian pertanian, atas nama stabilisasi harga pasar.",
    }
  });

  const ruu2 = await prisma.legislation.create({
    data: {
      title: "RUU Revisi KPK & Hukum Pidana Khusus",
      number: "RUU No. 04/2025",
      type: "Undang-Undang",
      status: "DISAHKAN",
      description: "Mengatur ulang kewenangan penyitaan aset oleh negara, mewajibkan putusan inkracht minimal 5 tahun sebelum penyitaan dapat dilakukan secara permanen.",
    }
  });

  const ruu3 = await prisma.legislation.create({
    data: {
      title: "Peraturan Menteri tentang Relaksasi Ekspor Pasir Laut & Tambang",
      number: "Permen No. 08/2026",
      type: "Peraturan Menteri",
      status: "PEMBAHASAN",
      description: "Memberikan pengecualian bagi perusahaan pertambangan strategis untuk membuka lahan baru dengan syarat melakukan penanaman kembali dalam waktu 10 tahun.",
    }
  });
  
  const ruu4 = await prisma.legislation.create({
    data: {
      title: "RUU Sistem Pendidikan Profesi Guru Nasional",
      number: "RUU No. 22/2025",
      type: "Undang-Undang",
      status: "PEMBAHASAN",
      description: "Mewajibkan guru honorer melalui sertifikasi berbayar mandiri sebelum dapat dinaikkan statusnya menjadi PPPK dengan standar gaji UMK.",
    }
  });

  console.log("✅ 4 RUU ditambahkan ke Database.");

  // 5. CREATE RELATIONS (THE WOW MOMENT - CONTRADICTIONS)
  // Beras vs RUU Ketahanan Pangan
  await prisma.promiseLegislation.create({
    data: {
      promiseId: prom2.id,
      legislationId: ruu1.id,
      relationType: "CONTRADICTION",
      notes: "RUU Omnibus mempermudah impor secara birokratis dan menghilangkan wewenang Mentan, langsung BERTENTANGAN dengan janji kampanye untuk tidak impor saat panen raya demi menyerap gabah petani lokal."
    }
  });

  // Perampasan Aset vs RUU Revisi KPK (DPR)
  await prisma.promiseLegislation.create({
    data: {
      promiseId: prom8.id,
      legislationId: ruu2.id,
      relationType: "CONTRADICTION",
      notes: "Alih-alih memudahkan perampasan aset (seperti yang dijanjikan), pengesahan revisi UU ini justru memperpanjang birokrasi penyitaan menjadi minimal 5 tahun setelah inkracht, sangat menghambat penegakan hukum."
    }
  });

  // Tambang vs Relaksasi Tambang
  await prisma.promiseLegislation.create({
    data: {
      promiseId: prom9.id,
      legislationId: ruu3.id,
      relationType: "CONTRADICTION",
      notes: "Janji moratorium total pembukaan tambang baru DILANGGAR oleh penerbitan Peraturan Menteri yang memberikan 'pengecualian' bagi pertambangan yang dilabeli strategis nasional."
    }
  });
  
  // Gaji Guru vs RUU Sertifikasi
  await prisma.promiseLegislation.create({
    data: {
      promiseId: prom6.id,
      legislationId: ruu4.id,
      relationType: "CONTRADICTION",
      notes: "Syarat sertifikasi berbayar yang memberatkan honorer justru berlawanan dengan janji pengangkatan mudah bergaji UMR yang diteriakkan saat hari guru nasional."
    }
  });

  console.log("✅ AI Contradiction Linkage berhasil dibuat.");

  // 6. CREATE COMMENTS (Biar halaman detail tidak sepi)
  // Dummy Users First
  const u1 = await prisma.user.create({ data: { name: "Ahmad Fajar", email: "fajar@demo.test" } });
  const u2 = await prisma.user.create({ data: { name: "Siti Nurhaliza", email: "siti@demo.test" } });

  await prisma.comment.create({
    data: {
      promiseId: prom2.id,
      userId: u1.id,
      content: "Saya petani di Indramayu, pas kemarin panen raya harga anjlok karena impor dibuka. Kecewa banget sama janji bapak.",
      voteUp: 45,
    }
  });
  
  await prisma.comment.create({
    data: {
      promiseId: prom6.id,
      userId: u2.id,
      content: "Sampai sekarang gaji masih 400 ribu sebulan dirapel 3 bulan sekali. Gimana mau sertifikasi jalur mandiri?",
      voteUp: 128,
    }
  });

  console.log("✅ Komentar dummy dimasukkan.");
  console.log("🎉 SEEDING SELESAI! Database siap untuk PRESENTASI MAXIMUM IMPACT.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
