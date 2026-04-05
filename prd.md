  # 📄 Product Requirements Document (PRD): RUUMY 2.0

  **Project Name:** RUUMY 2.0 - Democratic Accountability Engine
  **Document Version:** 1.0

  ---

  ## 1. Executive Summary

  ### 1.1 Visi Terintegrasi

  > "Dari janji kampanye sampai implementasi UU—setiap kata ada bukti, setiap dampak terhitung, setiap warga terdengar."

  **Taglines:**
  - "Setiap janji punya jejak. Setiap RUU punya dampak. Setiap warga punya suara."
  - "Dari kata-kata di podium sampai perubahan di dompet—kita hitung semuanya."

  ### 1.2 Elevator Pitch
  **RUUMY** adalah sistem kecerdasan buatan berbasis *Civic Technology* yang dibuat untuk mengatasi kelemahan transparansi demokrasi di Indonesia. Platform ini menghubungkan titik buta antara **janji kampanye, proses legislasi, dan hasil realita di masyarakat**. Dengan RUUMY, warga dapat melacak kebenaran sebuah janji politik, mensimulasikan dampak Undang-Undang ke profil personal mereka, dan memverifikasi laporan fakta di lapangan. 

  ### 1.3 Analogi Sederhana (Untuk Memudahkan Pemahaman)
  Bayangkan aplikasi **Fitness/Diet Tracker**, tapi untuk ranah politik:
  - **Janji (Target Diet):** Politisi berjanji *"Aku mau turun 5kg!"* (Pajak turun).
  - **RUU (Rencana Latihan):** Dibuat aturan *"Lari tiap pagi."* (RUU Kesejahteraan).
  - **RUUMY (Smartwatch Tracker):** Sistem yang melacak *"Apakah benar lari? Kok detak jantungnya menunjukkan rebahan?"*
  - **Hasil:** Tracker RUUMY membuktikan kebohongan atau memvalidasi kebenaran.

  ---

  ## 2. Problem Statement (Latar Belakang Masalah)

  Demokrasi seringkali kehilangan jejak janji di tengah proses birokrasi, yang disebut **"Democratic Black Hole"**:

  1. **Sisi A: Legislative Black Hole (Input)**
    Janji Politik → Rancangan Kebijakan → **(BLACK HOLE: "Dampaknya gajelas!")** → UU Tiba-tiba Berlaku!
  2. **Sisi B: Promise-Implementation Gap (Output)**
    UU Berlaku → Implementasi → **(BLACK HOLE: "Anggaran bocor/Tidak jalan!")** → Warga dirugikan.

  ### Kelemahan Platform Existing (Mengapa butuh RUUMY?)
  - *TheyWorkForYou (UK)*: Hanya rekam jejak voting (tanpa prediksi).
  - *PolitiFact (US)*: Cek fakta manual case-by-case (kurang proaktif).
  - *KawalPemilu (ID)*: Reaktif berbasis event pemilu saja.
  - *LAPOR! (ID)*: Cuma ruang aduan, tidak tersinkronisasi ke data legislatif.

  ---

  ## 3. Product Features & Verification Layers

  ### Layer 1: Promise Capture (Melacak Janji Masuk)
  Mengumpulkan data janji yang diucapkan (Debat capres, Pidato, Social Media Twitter/IG). 
  - *Output:* Database Janji dengan Deadline dan Metrik Jelas.

  ### Layer 2: Legislative Tracking (RUU sebagai Implementasi)
  - **Promise-to-RUU Matcher:** Menghubungkan "Janji A" dengan "Rincian RUU X".
  - **Impact Simulator:** Menghitung simulasi untung/rugi konstituen terhadap suatu RUU.

  ### Layer 3: Implementation Verification (Data Resmi Negara)
  Membandingkan klaim pemerintah dengan Open Data Pemerintah (APBN, BPS audit).

  ### Layer 4: Citizen Verification Network (Crowdsourcing Warga)
  Warga menjadi "Sensor Demokrasi" via aplikasi.
  - Bukti foto proyek infrastruktur dengan GPS/Lokasi.
  - Survey pengalaman layanan in-app.

  ### Core Tools Engine (Fitur Pintar)
  1. **Contradiction Detector:** Mendeteksi bilamana sebuah aturan yang disahkan justru berkebalikan dari janji kampanye awal.
  2. **Broken Promise Forecaster:** Menghitung apakah progres saat ini *On-Track* atau akan *Terlambat* di akhir jabatan.
  3. **Promise Radar (Dashboard):** Bubble chart visual metrik keberhasilan janji (Hijau=Tercapai, Kuning=Proses, Merah=Gagal).
  4. **Citizens "Kebenaran Index":** Skor validitas dan kredibilitas politisi berdasar jejak kerjanya.

  ---

  ## 4. User Personas & Roles

  | Role | Deskripsi & Hak Akses | Syarat |
  |------|------------------------|--------|
  | **Guest** | Hanya bisa melihat dashboard pubik dan Promise Radar. | Tanpa Login |
  | **Citizen (Warga)** | Bisa Bookmark janji, pakai Simulasi, beri Komentar, Vote (Up/Down). | Daftar Email biasa |
  | **Verified Citizen**| Bisa lapor/upload bukti foto lapangan secara valid & geo-tagging. | Verifikasi KTP |
  | **Journalist / Ahli**| Priority upload fakta lapangan, melihat dashboard Analytics detail. | Approval Admin |
  | **Moderator** | Bisa verifikasi (Approve/Reject) status janji & laporan yang masuk. | Role Internal |
  | **Admin** | Full system control. | Owner / Developer |

  ---

  ## 5. Technical Specifications (Tech Stack)

  Berikut rincian tools yang digunakan agar **Dapat Dipahami Secara Mudah Saat Development**:

  ### 🛠️ Frontend (Tampilan & Interaksi)
  - **Next.js 14 (App Router):** Inti aplikasi utama. Dipilih karena cepat (Server-Side Rendering) dan ramah SEO.
  - **TypeScript:** Bahasa JS dengan aturan ketat (Type checking) agar tidak mudah error/bug saat develop.
  - **Tailwind CSS & shadcn/ui:** Sistem styling dan komponen UI modern siap pakai yang gampang disesuaikan.
  - **Recharts / D3.js:** Library untuk menggambar diagram rumit (*Promise Radar Bubble Chart*).
  - **Zustand & React Query:** Untuk mengatur data cache browser dan state interaksi UI.

  ### ⚙️ Backend (Logika Server & API)
  - **Next.js API Routes:** Berfungsi sebagai jembatan backend, menangani logic di folder `app/api/`.
  - **NextAuth.js:** Mengurus sistem Login (Register, Google/Github login, Cookies, JWT Token). Cukup panggil tanpa repot tulis script auth dari nol.
  - **Zod:** *Satpam data*. Setiap form dari user akan dicek oleh Zod agar terhindar dari inputan aneh (SQL Injection).

  ### 🗄️ Database & Storage (Penyimpanan Data)
  - **PostgreSQL 16:** Database relasional utamanya. Tempat simpan data politisi, RUU, komentar dan *Promises*.
  - **Prisma ORM:** Jembatan pintar ke PostgreSQL. Kamu bisa menulis `prisma.user.create()` alih-alih bahasa SQL panjang. (Dilengkapi *Prisma Studio* untuk GUI melihat database).
  - **Redis (Cache):** Memori sementara yang sangat cepat, agar dashboard web tidak lama *loading* saat banyak traffic.
  - **Uploadthing / S3:** Tempat menyimpan File upload warga (Gambar/Video bukti), bukan disimpan di dalam database langsung.

  ### 🐳 Infrastruktur & Deployment (Pembangunan & Rilis)
  - **Docker & Docker-Compose:** Sistem wadah *Container*. Mengikat Next.js + Postgres + Redis di local laptop developer, sehingga di-klik `docker-compose up` semua berjalan lancar serentak tanpa konfigurasi manual pusing.
  - **Vercel:** Platform gratis (Freemium) tempat menaruh aplikasi Frontend agar online.
  - **Railway/Supabase (Opsional):** Digunakan untuk Database hosting ketika project akan di-Online-kan seluruh dunia.

  ---

  ## 6. Architecture & Database Schema Overview

  ### Alur Arsitektur Sistem (Simplifikasi)
  ```
  [User Browser] (Next.js Frontend)
        │
      (API Calls via NextAuth / React Query)
        │
        ▼
  [Next.js Backend API] ---> [Zod Validator] 
        │
        ▼
  [Prisma ORM (Data Layer)]
    │            │              │
    ▼            ▼              ▼
  PostgreSQL   Redis          Uploadthing
  (Main DB)    (Cache Log)    (Foto Warga)
  ```

  ### Relasi Database Utama (Prisma ERD Logic)
  - `User` 1---M `Verification`, `Comment`, `Bookmark`
  - `Politician` 1---M `Promise`
  - `Promise` M---M `Legislation` (Tabel Perantara: `PromiseLegislation` untuk deteksi Contradiction)
  - `Legislation` 1---M `ImpactSimulation`

  ---

  ## 7. Timeline Development & Milestones (MVP 12 Minggu)

  Untuk mengatur manajemen kerja pengembangan, dibagi ke fase **Minimum Viable Product (MVP)**.

  | Fase | Waktu | Fokus Pekerjaan | Deliverables (Hasil Pengerjaan) |
  |---|---|---|---|
  | **Phase 1: Foundation** | Minggu 1-4 | Setup Project & Database | Setup Docker, instal Next.js + DB Prisma. Sistem Login/Auth ready. Landing page & View Politician List berjalan. |
  | **Phase 2: Core Data** | Minggu 5-8 | Data View & Dashboard | CRUD Janji & Legislasi selesai. Full-text search jalan. **Promise Radar (Chart) selesai dirakit.** Comment/Bookmark System online. |
  | **Phase 3: Verify** | Minggu 9-12 | Interaksi Warga | Fitur upload foto Citizen Verification lengkap (GPS, verifikasi). Modul kalkulasi *Score Kebenaran* dan notifikasi berjalan. |
  | *Future Post-MVP* | *Masa Depan* | AI Integration | Menerapkan integrasi Machine Learning beneran untuk AI Prediction NLP RUU. Integrasi API BPJS/KPU/BPS live. |

  ---

  ## 8. Development Workflow Checklist

  ### 1. Cara Menjalankan Project di Laptop (Local Dev)
  Cukup jalankan langkah ini di Terminal:
  ```bash
  git clone ruumy-repo && cd ruumy  # Masuk folder
  cp .env.example .env.local        # Salin file environment (Isi key lokal)
  docker-compose up -d              # Otomatis membangun Postgres + Redis
  npm install                       # Download library code
  npx prisma db push                # Migrasi kerangka ke tabel db
  npm run dev                       # Buka di localhost:3000
  ```
  ### 2. Cara Kerja Sehari-hari (Coding)
  - Menggunakan `npx prisma studio` untuk interaksi GUI Database visual lokal.
  - Setiap update DB, dikerjakan migrasi via `npx prisma migrate dev`.
  - Pemangkasan branch git menggunakan standard fitur seperti `feature/ui-dashboard` dan `fix/login-bug`.

  ### 3. Keamanan Wajib (Non Functional Rules)
  - **Token Secret:** *Jangan pernah* push `.env.local` ke Github.
  - **Ratelimit:** Jangan lupa integrasikan ratelimit login via Redis untuk anti-spam bot. 

  ---

  ## 9. UI/UX & Design Guidelines (Standar Internasional)

  Untuk memastikan RUUMY tidak terlihat seperti 'website pemerintah lawas' melainkan sebagai standar *Civic Tech B2C SaaS* berkelas dunia, estetika dan interaktivitas akan menjadi senjata utama.

  ### 9.1 Konsep Visual (Premium & Otoritatif)
  - **Tema Warna (Sleek Dark Mode):** Prioritaskan *dark mode* (Latar belakang slate/deep blue gelap) untuk memberi kesan 'investigatif', 'premium', dan 'tech-forward'.
  - **Warna Aksen Semantik:** 
    - 🟢 Hijau Neon (Terpenuhi / Skor Tinggi)
    - 🔴 Merah Crimson (Janji Bohong / Kontradiksi)
    - 🟡 Kuning Amber (Status Tertunda / Peringatan)
  - **Tipografi:** Gunakan font Sans-Serif modern berskala global seperti **Inter**, **Outfit**, atau **Plus Jakarta Sans** untuk keterbacaan data yang tinggi.
  - **Material Design:** Terapkan gaya desain *Glassmorphism* (efek kaca transparan buram) pada kartu data (cards) dan sidebar agar terlihat melayang di atas data.

  ### 9.2 Standard Animasi Web (Kritik Politik Dinamis)
  Penggunaan animasi harus bermakna dan menyoroti masalah politik, menggunakan *Framer Motion* (library animasi React).
  - **Micro-Animations:** Efek sentuhan responsif. Saat user melakukan hover (menyorot) pada politisi yang berbohong, muncul efek getar halus (*glitch* atau *shake pattern*) yang melambangkan peringatan/bahaya.
  - **Data Visualization Flow:** Animasi masuk pada chart. Saat "Promise Radar" memuat, gelembung-gelembung (*bubbles*) data janji bermunculan satu persatu sesuai timeline, seolah "memanggil ulang ingatan masa lalu". 
  - **Page Transitions:** Navigasi ekstra halus memudar masuk/keluar saat berpindah dari halaman "Janji Capres" ke "Bukti Laporan Realita", memperlihatkan alur kesinambungan.
  - **Scroll Telling:** Elemen fakta/teks tentang "Democratic Black Hole" akan masuk melayang secara dramatis sembari *user* menscroll halaman ke bawah, mengunci fokus mereka pada teks kontradiksi janji.

  ### 9.3 Framework Frontend Design
  1. **Tailwind CSS:** Digunakan untuk eksekusi standar *utility class*, layout responsif mutlak di mobile UI.
  2. **Framer Motion & GSAP:** Eksekusi animasi interaktif kelas atas (drag & drop kartu, parallax efek, transisi).
  3. **Recharts / D3.js (Interactive):** Interaksi Tooltip: Saat cursor diarahkan pada titik grafik/bubble merah, info *Janji vs Realita APBN* akan muncul mengambang. 

  *--- End of Document ---*