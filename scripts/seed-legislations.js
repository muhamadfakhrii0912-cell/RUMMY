// Script untuk mengisi database dengan contoh RUU nyata
// Jalankan: node scripts/seed-legislations.js

const API_URL = "http://localhost:3000/api/seed/legislations";

const legislations = [
  {
    title: "RUU Cipta Kerja (Omnibus Law)",
    number: "RUU No. 11 Tahun 2020",
    type: "UU",
    status: "DISAHKAN",
    description: `Undang-Undang yang mengubah, menghapus, atau menetapkan pengaturan baru dari beberapa UU sekaligus. 
Mencakup 11 klaster: penyederhanaan perizinan, persyaratan investasi, ketenagakerjaan, kemudahan UMKM, 
dukungan riset & inovasi, pengadaan lahan, kawasan ekonomi, investasi pemerintah pusat, pelaksanaan administrasi pemerintahan, 
pengenaan sanksi, serta jaminan sosial ketenagakerjaan. 

PASAL KUNCI:
- Pasal 59: Kontrak kerja (PKWT) bisa diperpanjang tanpa batasan waktu tertentu.
- Pasal 81 Angka 42: Pesangon dikurangi, pemerintah menanggung sebagian lewat JKP.
- Pasal 81 Angka 15: Upah Minimum ditetapkan Gubernur berdasarkan formula baru.
- Pasal 117: Penyederhanaan izin lingkungan menjadi "persetujuan lingkungan".
- Pasal 178: Kemudahan pendirian PT oleh 1 orang untuk UMKM.`,
    url: "https://peraturan.bpk.go.id/Details/149750/uu-no-11-tahun-2020",
  },
  {
    title: "RUU Perlindungan Data Pribadi (PDP)",
    number: "RUU No. 27 Tahun 2022",
    type: "UU",
    status: "DISAHKAN",
    description: `Undang-Undang yang mengatur perlindungan data pribadi warga negara Indonesia di era digital. 
Mengatur hak subjek data, kewajiban pengendali data, dan sanksi bagi pelanggar.

PASAL KUNCI:
- Pasal 1: Definisi data pribadi spesifik dan umum (KTP, biometrik, rekam medis, data keuangan).
- Pasal 5-15: Hak subjek data: akses, koreksi, hapus, portabilitas, tarik persetujuan.
- Pasal 20-39: Kewajiban pengendali data dan pemroses data.
- Pasal 65: Sanksi administratif hingga 2% pendapatan tahunan perusahaan.
- Pasal 67-73: Sanksi pidana: penjara hingga 6 tahun dan denda Rp6 miliar.`,
    url: "https://peraturan.bpk.go.id/Details/229798",
  },
  {
    title: "RUU Kesehatan (Omnibus Kesehatan)",
    number: "RUU Tahun 2023",
    type: "RUU",
    status: "PEMBAHASAN",
    description: `Rancangan Undang-Undang yang menyatukan 8 UU terkait kesehatan menjadi satu regulasi komprehensif. 
Mengatur tenaga kesehatan, pelayanan kesehatan, farmasi, dan pengawasan makanan/obat.

PASAL KUNCI:
- Pasal 188: Izin praktik dokter asing di Indonesia dengan syarat tertentu.
- Pasal 269: Legalisasi aborsi untuk korban pemerkosaan di bawah usia kehamilan 14 minggu.
- Pasal 342: Pemerintah wajib menyediakan layanan kesehatan mental di Puskesmas.
- Pasal 420: Pengaturan harga obat oleh pemerintah untuk obat esensial.
- Pasal 450: Sanksi pidana bagi tenaga kesehatan yang melakukan malpraktik.`,
    url: null,
  },
  {
    title: "RUU Perampasan Aset Tindak Pidana",
    number: "RUU Tahun 2024",
    type: "RUU",
    status: "INISIATIF_DPR",
    description: `Rancangan Undang-Undang yang memungkinkan negara merampas aset hasil kejahatan tanpa harus menunggu putusan pidana (NCB Asset Forfeiture). 
Ditargetkan untuk memberantas korupsi, pencucian uang, dan kejahatan terorganisasi.

PASAL KUNCI:
- Pasal 2: Perampasan aset dapat dilakukan secara perdata tanpa tuntutan pidana (in rem).
- Pasal 8: Aset yang dapat dirampas: tanah, bangunan, kendaraan, rekening bank, kripto.
- Pasal 15: Beban pembuktian terbalik — tersangka harus membuktikan aset diperoleh secara sah.
- Pasal 28: Perlindungan pihak ketiga yang beriktikad baik.
- Pasal 35: Hasil perampasan aset masuk ke kas negara dan dana korban.`,
    url: null,
  },
  {
    title: "RUU Ketahanan Pangan dan Gizi",
    number: "RUU Tahun 2024",
    type: "RUU",
    status: "PEMBAHASAN",
    description: `Rancangan Undang-Undang yang bertujuan menjamin ketersediaan dan keterjangkauan pangan bagi seluruh rakyat Indonesia, 
sekaligus menangani masalah stunting dan malnutrisi.

PASAL KUNCI:
- Pasal 12: Pemerintah wajib menjaga cadangan pangan nasional minimal untuk 6 bulan.
- Pasal 25: Larangan monopoli distribusi pangan oleh korporasi besar.
- Pasal 38: Program makan bergizi gratis untuk anak sekolah dan ibu hamil.
- Pasal 45: Subsidi pupuk langsung ke petani kecil.
- Pasal 60: Impor pangan hanya boleh dilakukan jika produksi domestik tidak mencukupi.`,
    url: null,
  }
];

async function seedLegislations() {
  console.log("🏛️  [Seed] Memulai injeksi data RUU ke database...");
  
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ legislations })
    });

    const data = await res.json();
    
    if (res.ok) {
      console.log(`✅ [Seed] Berhasil! ${data.count} RUU telah masuk ke database.`);
    } else {
      console.error("❌ [Seed Error]:", data.error);
    }
  } catch (err) {
    console.error("❌ [Network Error]:", err.message);
  }
}

seedLegislations();
