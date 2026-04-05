import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Simulasi dampak RUU berdasarkan profil pengguna
// Di produksi, ini akan menggunakan OpenAI GPT-4 untuk analisis real NLP
// Untuk demo, kita menggunakan template cerdas berdasarkan kata kunci di deskripsi RUU

const IMPACT_TEMPLATES: Record<string, Record<string, string>> = {
  // Format: [keyword di judul/deskripsi RUU]: { [profesi]: "dampak" }
  "Cipta Kerja": {
    mahasiswa: `📚 DAMPAK UNTUK ANDA SEBAGAI MAHASISWA:

1. ⚠️ MAGANG & KERJA PARUH WAKTU — Kontrak kerja (PKWT) bisa diperpanjang tanpa batas. Artinya, setelah lulus kamu bisa terjebak di status "kontrak terus-menerus" tanpa diangkat jadi karyawan tetap.

2. 💰 UPAH PERTAMA — Formula upah minimum baru bisa membuat gaji pertama kamu lebih rendah dari yang kamu harapkan, karena perhitungan yang berubah.

3. ✅ PELUANG USAHA — Kabar baiknya, mendirikan PT kini bisa dilakukan oleh 1 orang saja. Cocok untuk kamu yang mau jadi founder startup setelah lulus!

4. 🏭 LOWONGAN KERJA — Investasi dipermudah, yang secara teori membuka lebih banyak lapangan kerja. Tapi kualitas pekerjaan bisa jadi pertanyaan.

KESIMPULAN: RUU ini memberi peluang usaha lebih mudah, tapi perlindungan sebagai pekerja muda perlu diwaspadai.`,

    pekerja_kantoran: `💼 DAMPAK UNTUK ANDA SEBAGAI PEKERJA KANTORAN:

1. ⚠️ PESANGON BERKURANG — Jika Anda di-PHK, pesangon yang diterima lebih kecil dari sebelumnya. Sebagian ditanggung pemerintah lewat JKP (Jaminan Kehilangan Pekerjaan), tapi prosesnya bisa rumit.

2. 📝 KONTRAK TANPA BATAS — PKWT bisa diperpanjang tanpa batasan, artinya perusahaan punya insentif lebih kecil untuk mengangkat Anda jadi karyawan tetap.

3. 💸 UPAH MINIMUM — Formula baru bisa menekan kenaikan UMR tahunan Anda.

4. ✅ FLEKSIBILITAS — Jam kerja bisa lebih fleksibel, cocok untuk yang ingin work-life balance.

KESIMPULAN: Anda perlu lebih aktif menegosiasikan kontrak kerja dan memahami hak JKP Anda.`,

    buruh_pabrik: `🏭 DAMPAK UNTUK ANDA SEBAGAI BURUH PABRIK:

1. 🔴 DAMPAK TINGGI — Pesangon PHK dikurangi signifikan. Ini adalah pukulan besar karena pesangon seringkali jadi jaring pengaman utama.

2. ⚠️ STATUS KONTRAK — Anda bisa terus-menerus berstatus kontrak tanpa kepastian diangkat tetap.

3. 💰 UPAH — Kenaikan UMR bisa tertahan karena formula baru yang mempertimbangkan "kemampuan perusahaan".

4. ⚠️ OUTSOURCING MELUAS — Lebih banyak pekerjaan bisa di-outsource, mengurangi hak-hak pekerja langsung.

KESIMPULAN: RUU ini paling berdampak pada kelompok Anda. Bergabunglah dengan serikat pekerja untuk memperjuangkan hak.`,

    umkm: `🏪 DAMPAK UNTUK ANDA SEBAGAI PEMILIK UMKM:

1. ✅ PENDIRIAN USAHA MUDAH — Kini bisa mendirikan PT hanya dengan 1 orang (tanpa partner). Biaya dan birokrasi berkurang drastis!

2. ✅ PERIZINAN SIMPEL — Izin usaha disederhanakan lewat sistem OSS (Online Single Submission).

3. ✅ AKSES MODAL — Kemudahan investasi bisa membuka akses pendanaan lebih luas.

4. ⚠️ PERSAINGAN — Masuknya investasi asing lebih mudah bisa meningkatkan persaingan.

KESIMPULAN: Ini adalah kabar baik untuk UMKM! Manfaatkan kemudahan perizinan dan akses modal.`,

    ibu_rumah_tangga: `🏠 DAMPAK UNTUK ANDA SEBAGAI IBU RUMAH TANGGA:

1. 💰 HARGA KEBUTUHAN — Investasi asing dan kemudahan impor bisa mempengaruhi harga kebutuhan pokok (bisa naik atau turun).

2. 👨‍👩‍👧 SUAMI/ISTRI BEKERJA — Jika pasangan Anda pekerja, pesangon PHK berkurang dan kontrak kerja bisa tidak stabil.

3. ✅ PELUANG USAHA RUMAHAN — Mendirikan usaha kecil jadi lebih mudah, ada peluang untuk usaha dari rumah.

4. ⚠️ PERLINDUNGAN LINGKUNGAN — Penyederhanaan izin lingkungan bisa berdampak pada kualitas air dan udara di sekitar rumah Anda.

KESIMPULAN: Perhatikan dampak terhadap pekerjaan pasangan dan peluang usaha rumahan.`,

    petani: `🌾 DAMPAK UNTUK ANDA SEBAGAI PETANI/NELAYAN:

1. 🔴 LAHAN PERTANIAN — Penyederhanaan pengadaan lahan bisa mempermudah konversi tanah pertanian menjadi kawasan industri.

2. ⚠️ IZIN LINGKUNGAN — "Persetujuan lingkungan" yang lebih longgar bisa menyebabkan pencemaran sumber air dan tanah.

3. ✅ AKSES PASAR — Investasi di sektor logistik bisa mempermudah distribusi hasil tani.

4. ⚠️ PERSAINGAN IMPOR — Kemudahan impor bisa menurunkan harga jual hasil pertanian lokal.

KESIMPULAN: Anda termasuk kelompok yang paling terdampak. Lindungi sertifikat tanah Anda dan ikuti perkembangan regulasi.`,
  },

  "Data Pribadi": {
    mahasiswa: `📱 DAMPAK UNTUK ANDA SEBAGAI MAHASISWA:

1. ✅ PRIVASI ONLINE — Data kamu di media sosial, e-commerce, dan platform digital kini dilindungi hukum. Bisa minta hapus data kapan saja!

2. ✅ HAK PORTABILITAS — Kamu bisa pindahkan data dari satu platform ke platform lain (misal: pindah dari satu marketplace ke lainnya).

3. ✅ PELUANG KARIR — Lahirnya profesi baru: Data Protection Officer (DPO). Peluang karir besar di bidang keamanan data!

4. ⚠️ TUGAS KULIAH — Jika riset kampus menggunakan data pribadi, kini ada aturan ketat yang harus dipatuhi.

KESIMPULAN: RUU ini sangat menguntungkan kamu! Data pribadimu punya tameng hukum.`,

    pekerja_kantoran: `💻 DAMPAK UNTUK ANDA SEBAGAI PEKERJA KANTORAN:

1. ✅ DATA KARYAWAN DILINDUNGI — Perusahaan tidak bisa sembarangan membagikan data pribadi kamu (KTP, rekam medis, gaji).

2. ⚠️ BEBAN KERJA BARU — Jika Anda bekerja di divisi IT/HR, ada kewajiban baru terkait pengelolaan data karyawan.

3. ✅ KEAMANAN DATA — Perusahaan wajib melindungi data kamu. Jika bocor, mereka bisa kena denda 2% pendapatan tahunan!

4. 💼 PELUANG — Perusahaan butuh DPO. Bisa jadi peluang promosi atau spesialisasi baru.

KESIMPULAN: Hak Anda sebagai karyawan dilindungi lebih kuat. Pastikan perusahaan mematuhi regulasi.`,

    umkm: `🏪 DAMPAK UNTUK ANDA SEBAGAI PEMILIK UMKM:

1. ⚠️ KEWAJIBAN BARU — Anda wajib menjaga data pelanggan (nama, alamat, nomor HP) dengan standar keamanan tertentu.

2. ⚠️ SANKSI BERAT — Kebocoran data pelanggan bisa berujung denda administratif hingga 2% pendapatan tahunan.

3. ✅ KEPERCAYAAN KONSUMEN — UMKM yang patuh PDP akan lebih dipercaya pelanggan.

4. 💡 SOLUSI — Gunakan platform digital yang sudah comply PDP agar tidak perlu bangun sistem sendiri.

KESIMPULAN: Ada beban tambahan, tapi juga peluang meningkatkan kepercayaan pelanggan.`,
    
    ibu_rumah_tangga: `🏠 DAMPAK UNTUK ANDA SEBAGAI IBU RUMAH TANGGA:

1. ✅ DATA ANAK DILINDUNGI — Data anak-anak di platform belajar online dan game kini punya perlindungan khusus.

2. ✅ SPAM BERKURANG — Perusahaan tidak bisa mengirim promosi tanpa persetujuan. Telepon spam dari pinjol bisa dilaporkan!

3. ✅ HAK HAPUS — Bisa minta e-commerce dan sosmed menghapus data pribadi keluarga.

4. 🛡️ KEAMANAN — Data KTP dan KK yang tersebar bisa diminta untuk dihapus dari database ilegal.

KESIMPULAN: RUU ini memberi Anda senjata hukum untuk melindungi privasi keluarga.`,

    petani: `🌾 DAMPAK UNTUK ANDA SEBAGAI PETANI/NELAYAN:

1. ✅ DATA BANTUAN — Data penerima bantuan pemerintah (pupuk, benih) kini dilindungi, tidak bisa disalahgunakan.

2. ✅ PINJAMAN — Data yang disimpan fintech pertanian kini punya aturan perlindungan.

3. ⚠️ DAMPAK MINIMAL — Sebagian besar dampak RUU ini terasa di dunia digital. Dampak langsung ke petani relatif kecil.

KESIMPULAN: Dampak moderat. Tapi pastikan data KTP Anda tidak disalahgunakan oleh tengkulak atau rentenir digital.`,

    buruh_pabrik: `🏭 DAMPAK UNTUK ANDA SEBAGAI BURUH PABRIK:

1. ✅ DATA KARYAWAN — Perusahaan tidak bisa sembarangan memberikan data pribadi Anda kepada pihak ketiga.

2. ✅ REKAM MEDIS — Data kesehatan kerja Anda dilindungi. Tidak bisa dijadikan alasan PHK tanpa prosedur.

3. ⚠️ SIDIK JARI — Penggunaan biometrik (sidik jari untuk absensi) kini ada aturan lebih ketat.

KESIMPULAN: Perlindungan data Anda meningkat, terutama terkait data kesehatan dan kehadiran.`,
  },

  "Kesehatan": {
    mahasiswa: `🏥 DAMPAK UNTUK ANDA SEBAGAI MAHASISWA:

1. ✅ KESEHATAN MENTAL — Puskesmas WAJIB menyediakan layanan kesehatan mental. Ini sangat penting untuk mahasiswa yang rentan stres!

2. ✅ HARGA OBAT — Pemerintah akan mengatur harga obat esensial agar terjangkau.

3. ⚠️ DOKTER ASING — Dokter asing bisa masuk, persaingan bagi lulusan kedokteran meningkat.

4. ✅ AKSES LAYANAN — Layanan kesehatan di daerah terpencil diperluas.

KESIMPULAN: Sangat positif untuk akses kesehatan mental dan harga obat yang lebih terjangkau.`,

    pekerja_kantoran: `💼 DAMPAK UNTUK ANDA SEBAGAI PEKERJA KANTORAN:

1. ✅ KESEHATAN MENTAL — Layanan konseling kini tersedia gratis di Puskesmas terdekat.

2. ✅ OBAT MURAH — Harga obat esensial diatur pemerintah, mengurangi beban kesehatan.

3. ⚠️ IURAN — Potensi kenaikan iuran BPJS untuk mendanai program baru.

KESIMPULAN: Akses kesehatan meningkat, tapi waspadai potensi kenaikan iuran.`,

    ibu_rumah_tangga: `🏠 DAMPAK UNTUK ANDA SEBAGAI IBU RUMAH TANGGA:

1. ✅ KESEHATAN IBU & ANAK — Layanan kesehatan ibu hamil dan anak diperluas.

2. ✅ OBAT TERJANGKAU — Harga obat esensial diatur agar terjangkau keluarga.

3. ✅ KESEHATAN MENTAL — Konseling keluarga tersedia di Puskesmas.

4. ⚠️ ABORSI — Legalisasi aborsi untuk korban pemerkosaan masih kontroversial.

KESIMPULAN: Banyak manfaat langsung untuk kesehatan keluarga Anda.`,

    umkm: `🏪 DAMPAK UNTUK ANDA SEBAGAI PEMILIK UMKM:

1. ✅ KARYAWAN SEHAT — Karyawan bisa akses layanan kesehatan lebih mudah = produktivitas naik.

2. ✅ OBAT MURAH — Biaya kesehatan karyawan bisa berkurang.

KESIMPULAN: Dampak positif tidak langsung lewat produktivitas karyawan.`,

    buruh_pabrik: `🏭 DAMPAK UNTUK ANDA SEBAGAI BURUH PABRIK:

1. ✅ KESEHATAN KERJA — Standar kesehatan kerja di pabrik diperketat.

2. ✅ MALPRAKTIK — Perlindungan lebih kuat jika terjadi malpraktik medis.

3. ✅ OBAT MURAH — Harga obat esensial diatur agar terjangkau.

KESIMPULAN: Perlindungan kesehatan Anda meningkat secara signifikan.`,

    petani: `🌾 DAMPAK UNTUK ANDA SEBAGAI PETANI/NELAYAN:

1. ✅ PUSKESMAS DAERAH — Pelayanan kesehatan di daerah terpencil wajib tersedia.

2. ✅ OBAT MURAH — Obat esensial (demam, batuk, hipertensi) lebih terjangkau.

3. ✅ KESEHATAN MENTAL — Layanan konseling tersedia di Puskesmas desa.

KESIMPULAN: RUU ini sangat menguntungkan Anda yang tinggal di daerah dengan akses kesehatan terbatas.`,
  },
};

export async function POST(req: Request) {
  try {
    const { legislationId, profesi } = await req.json();

    if (!legislationId || !profesi) {
      return NextResponse.json({ error: "legislationId dan profesi diperlukan" }, { status: 400 });
    }

    // Ambil data RUU
    const legislation = await prisma.legislation.findUnique({
      where: { id: legislationId }
    });

    if (!legislation) {
      return NextResponse.json({ error: "RUU tidak ditemukan" }, { status: 404 });
    }

    // Cari dampak yang cocok berdasarkan keyword di judul RUU
    let impactResult = "";
    
    for (const [keyword, impacts] of Object.entries(IMPACT_TEMPLATES)) {
      if (legislation.title.includes(keyword) || legislation.description.includes(keyword)) {
        impactResult = impacts[profesi] || `Analisis untuk profesi "${profesi}" pada RUU "${legislation.title}" sedang dalam pengembangan. Sistem AI kami akan segera memiliki data yang lebih lengkap.`;
        break;
      }
    }

    // Fallback: Generate generic impact jika tidak ada template
    if (!impactResult) {
      const profesiMap: Record<string, string> = {
        mahasiswa: "Mahasiswa",
        pekerja_kantoran: "Pekerja Kantoran",
        buruh_pabrik: "Buruh Pabrik",
        umkm: "Pemilik UMKM",
        ibu_rumah_tangga: "Ibu Rumah Tangga",
        petani: "Petani/Nelayan",
      };
      const profesiLabel = profesiMap[profesi as string] || profesi;

      impactResult = `📋 ANALISIS DAMPAK "${legislation.title}" UNTUK ${profesiLabel.toUpperCase()}:

Sistem AI kami sedang menganalisis dampak RUU ini secara mendalam untuk profil ${profesiLabel}. 

Beberapa poin yang dapat Anda perhatikan:
1. 📖 Baca ringkasan pasal-pasal kunci di sebelah kiri
2. 🔍 Perhatikan pasal yang berkaitan dengan hak dan kewajiban ${profesiLabel}
3. 📢 Sampaikan aspirasi Anda melalui fitur Diskusi & Opini di Dashboard

💡 Tips: Untuk analisis yang lebih personal dan mendalam, sistem kami akan segera terintegrasi dengan AI NLP yang dapat membedah setiap pasal berdasarkan profil spesifik Anda.`;
    }

    // Simpan simulasi ke database
    await prisma.impactSimulation.create({
      data: {
        legislationId,
        userProfile: JSON.stringify({ profesi }),
        impactResult,
      }
    });

    return NextResponse.json({ success: true, impactResult }, { status: 200 });

  } catch (error: any) {
    console.error("Impact Simulation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
