# 📄 Product Requirements Document (PRD): RUUMY 2.0

**Project Name:** RUUMY 2.0 - Democratic Accountability Engine  
**Document Version:** 2.0 (Updated — Synced with Codebase)  
**Last Updated:** April 2026

---

## 1. Executive Summary

### 1.1 Visi Terintegrasi

> "Dari janji kampanye sampai implementasi UU—setiap kata ada bukti, setiap dampak terhitung, setiap warga terdengar."

**Taglines:**
- "Setiap janji punya jejak. Setiap RUU punya dampak. Setiap warga punya suara."
- "Dari kata-kata di podium sampai perubahan di dompet—kita hitung semuanya."

### 1.2 Elevator Pitch
**RUUMY** adalah sistem kecerdasan buatan berbasis *Civic Technology* yang dibuat untuk mengatasi kelemahan transparansi demokrasi di Indonesia. Platform ini menghubungkan titik buta antara **janji kampanye, proses legislasi, dan hasil realita di masyarakat**. Dengan RUUMY, warga dapat melacak kebenaran sebuah janji politik, mensimulasikan dampak Undang-Undang ke profil personal mereka, dan memverifikasi laporan fakta di lapangan.

### 1.3 Analogi Sederhana
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

## 3. Product Features (Fitur Utama — Status Implementasi)

Platform RUUMY beroperasi berdasarkan fitur inti dan layer verifikasi cerdas yang saling terintegrasi. Berikut status aktual tiap fitur:

### 3.1 Promise Capture API ✅ Implemented
Sistem NLP untuk mengekstrak dan mengarsipkan janji-janji politik dari berbagai sumber (video debat, pidato resmi, dokumen kampanye, social media).
- *Output:* Database Janji dengan konteks, deadline, dan metrik keberhasilan terukur.
- *Halaman:* `/database` (Database Janji publik)

### 3.2 Legislative Tracker / RUU Watch ✅ Implemented
Fitur pemantauan progres legislasi secara *live*. Sistem melacak setiap Rancangan Undang-Undang, menganalisis isinya, dan memproyeksikan dampaknya ke masyarakat. Terhubung dengan sistem Contradiction Detector untuk menandai inkonsistensi.
- *Halaman:* `/ruu-watch`

### 3.3 Contradiction Radar ✅ Implemented
Sistem AI yang menghubungkan (Promise-to-RUU Matcher) dan mendeteksi anomali. Apabila RUU yang sedang dirancang bertentangan dengan janji kampanye politisi pendukungnya, sistem menandainya dengan bukti kuat.
- *Tabel DB:* `PromiseLegislation` (tabel perantara untuk deteksi)

### 3.4 Verification Engine ✅ Implemented
Pencocokan (cross-check) otomatis kebenaran klaim pemerintah vs data Open Data dari lembaga resmi (APBN, BPS, Bank Dunia).

### 3.5 Crowd-Verification Pipeline (4-Langkah) ✅ Implemented
Sistem desentralisasi di mana *Verified Citizen* (terverifikasi KTP) dapat menjadi "Sensor Lapangan". Setiap laporan melewati **4 langkah validasi otomatis**:

```
📷 UPLOAD FOTO       →  GPS EXIF PARSER     →  AI VISION AUDIT    →  LOCK & KANBAN
(UploadThing/S3)        (Validasi Koordinat     (GPT-4o Vision: Cek  (Admin Final Review)
                          di Indonesia)            relevansi foto)
```

- *Validation 1 — EXIF GPS:* Memastikan foto diambil di lokasi nyata (bukan screenshot/internet), koordinat terletak di dalam wilayah Indonesia.
- *Validation 2 — AI Vision (GPT-4o):* Mengkategorikan konten foto (infrastruktur rusak, progres, dll.) dan menolak foto tidak relevan (selfie, makanan, dll.).
- *Output:* Laporan yang lulus masuk ke **Kanban Admin** untuk review final.
- *Halaman:* `/dashboard/report` (form submit), Admin: `/admin/verifications`

### 3.6 Promise Radar & Dashboard Analytics ✅ Implemented
Dashboard visual transparan dengan *bubble chart* interaktif. Memetakan metrik keberhasilan janji:
- 🟢 Hijau = Tercapai
- 🟡 Kuning = Dalam Proses / Peringatan
- 🔴 Merah = Gagal / Dilanggar
- *Halaman:* `/promise-radar`

### 3.7 Kebenaran Index (Skor Kredibilitas Politisi) ✅ Implemented
Skor *dynamic scoring* kredibilitas *real-time* tiap politisi. Dihitung dari rasio janji ditepati vs diingkari dan ditampilkan di profil politisi.
- *Halaman:* `/politicians`, `/politicians/[id]`

### 3.8 Impact Simulator ✅ Implemented
Fitur simulasi interaktif yang memproyeksikan dampak sebuah RUU secara personal ke konstituen (untung/rugi berdasarkan profil warga).
- *API:* `/api/simulate-impact`

### 3.9 Komentar & Diskusi ✅ Implemented
Sistem komentar terstruktur yang memungkinkan warga berdiskusi pada setiap entri janji dan RUU.
- *API:* `/api/comments`
- *Halaman:* `/dashboard/discussions`

### 3.10 Sistem Bookmark ✅ Implemented
Warga dapat mem-bookmark janji atau politisi yang ingin dipantau secara personal.
- *API:* `/api/bookmarks`
- *Halaman:* `/dashboard/bookmarks`

### 3.11 FAQ Section ✅ Implemented
Halaman FAQ terintegrasi langsung di Landing Page (bukan halaman terpisah), berisi penjelasan fitur, cara kerja, panduan akun & partisipasi, serta informasi keamanan data — dengan accordion interaktif dan filter kategori.
- *Anchor:* `/#faq` (di Landing Page `/`)

### 3.12 Admin Panel ✅ Implemented
Panel kontrol penuh untuk pihak admin, mencakup:
- Manajemen Politisi (`/admin/politicians`)
- Manajemen Janji (`/admin/promises`)
- Manajemen Legislasi/RUU (`/admin/legislations`)
- Kanban Verifikasi Laporan Warga (`/admin/verifications`)

---

## 4. Halaman & Rute Aplikasi

| Route | Deskripsi | Akses |
|---|---|---|
| `/` | Landing page + FAQ section terintegrasi | Public |
| `/login` | Halaman masuk akun | Public |
| `/register` | Halaman daftar akun baru | Public |
| `/politicians` | Daftar semua politisi | Public |
| `/politicians/[id]` | Profil & rekam jejak janji politisi | Public |
| `/database` | Database janji politik publik | Public |
| `/ruu-watch` | Pemantauan RUU/legislasi live | Public |
| `/promise-radar` | Dashboard bubble chart janji | Public |
| `/dashboard` | Dashboard personal warga (login) | Citizen |
| `/dashboard/bookmarks` | Daftar bookmark janji | Citizen |
| `/dashboard/discussions` | Diskusi & komentar | Citizen |
| `/dashboard/report` | Form laporan foto lapangan | Citizen |
| `/dashboard/settings` | Pengaturan akun | Citizen |
| `/admin` | Panel admin utama | Admin |
| `/admin/politicians` | CRUD data politisi | Admin |
| `/admin/promises` | CRUD data janji | Admin |
| `/admin/legislations` | CRUD data RUU/legislasi | Admin |
| `/admin/verifications` | Kanban review laporan warga | Admin |

---

## 5. User Personas & Roles

| Role | Deskripsi & Hak Akses | Syarat |
|------|------------------------|--------|
| **Guest** | Melihat dashboard publik, Promise Radar, Database Janji, RUU Watch. | Tanpa Login |
| **Citizen (Warga)** | Bookmark janji, Simulasi dampak RUU, Komentar, Vote (Up/Down). | Daftar Email |
| **Verified Citizen** | Upload laporan foto lapangan dengan validasi GPS + AI. | Verifikasi KTP |
| **Journalist / Ahli** | Priority upload fakta lapangan, akses dashboard Analytics detail. | Approval Admin |
| **Moderator** | Verifikasi (Approve/Reject) status janji & laporan di Kanban. | Role Internal |
| **Admin** | Full system control, CRUD semua data, manajemen user & role. | Owner / Developer |

---

## 6. Technical Specifications (Tech Stack Aktual)

### 🛠️ Frontend (Tampilan & Interaksi)
- **Next.js 14 (App Router):** Inti aplikasi. Server-Side Rendering dan route-based API.
- **TypeScript:** Type-safe development di seluruh codebase.
- **Tailwind CSS & shadcn/ui:** Design system, komponen UI (Button, Card, Input, dll.).
- **Framer Motion:** Animasi micro-interaction, scroll-trigger animation, accordion FAQ.
- **Recharts / D3.js:** Visualisasi Promise Radar bubble chart interaktif.

### ⚙️ Backend (API Routes)
- **Next.js API Routes** (`/src/app/api/`): Seluruh logic backend.
- **NextAuth.js:** Sistem autentikasi (register, login, session JWT, role-based access).
- **Zod:** Validasi semua input form dari client.
- **OpenAI GPT-4o Vision:** Analisis gambar laporan warga di pipeline verifikasi.

### 🧠 AI & Machine Learning
- **OpenAI GPT-4o Vision API:** Mengkategorikan dan memvalidasi konten foto laporan warga (relevansi infrastruktur, menolak foto tidak valid).
- **NLP Engine:** Mendukung Promise Capture dan Contradiction Detector.

### 📍 Geolocation & File
- **`exifr` library:** Parsing metadata EXIF foto untuk ekstraksi koordinat GPS.
- **UploadThing (S3-backed):** Penyimpanan file upload warga (foto bukti). Bukan disimpan di database.

### 🗄️ Database & Storage
- **PostgreSQL:** Database relasional utama.
- **Prisma ORM:** Data layer (`prisma.user.create()`, dll.). Disertai Prisma Studio untuk GUI.
- **Redis:** Cache layer untuk performa dashboard saat traffic tinggi.

### 🐳 Infrastruktur & Deployment
- **Docker & Docker-Compose:** Mengikat Next.js + Postgres + Redis di local dev.
- **Vercel:** Deployment frontend production.
- **Neon (PostgreSQL Cloud):** Database hosting production.

---

## 7. Architecture & Database Schema

### Alur Arsitektur Sistem
```
[User Browser] (Next.js Frontend + Framer Motion)
      │
  (NextAuth JWT Session / React Query)
      │
      ▼
[Next.js API Routes] ──► [Zod Validator]
      │
      ▼
[Prisma ORM (Data Layer)]
  │            │              │              │
  ▼            ▼              ▼              ▼
PostgreSQL   Redis          UploadThing    OpenAI API
(Main DB)    (Cache)        (Foto S3)      (AI Vision)
```

### Relasi Database Utama (Prisma ERD)
- `User` 1---M `Verification`, `Comment`, `Bookmark`
- `Politician` 1---M `Promise`
- `Promise` M---M `Legislation` → Tabel Perantara: `PromiseLegislation` (untuk deteksi Contradiction)
- `Legislation` 1---M `ImpactSimulation`
- `Verification` → field: `pipelineStatus` (UPLOADING → GPS_VALIDATING → AI_ANALYZING → LOCKED / FAILED)

### Citizen Verification Pipeline (4-Step)
```
Langkah 1: Upload Foto (UploadThing → S3 URL)
Langkah 2: EXIF GPS Validator — parse koordinat, cek wilayah Indonesia
Langkah 3: AI Vision Audit (GPT-4o) — cek relevansi & kategorisasi
Langkah 4: Verification Lock — jika lulus, masuk Kanban Admin
```

---

## 8. API Routes Lengkap

| Method | Route | Fungsi |
|---|---|---|
| GET/POST | `/api/auth/[...nextauth]` | Autentikasi NextAuth |
| POST | `/api/verification` | Submit laporan foto warga |
| GET/PUT/DELETE | `/api/admin/verifications` | CRUD verifikasi (admin) |
| GET/POST | `/api/bookmarks` | Manajemen bookmark user |
| GET/POST/DELETE | `/api/comments` | Komentar pada janji/RUU |
| POST | `/api/simulate-impact` | Simulasi dampak RUU personal |
| POST | `/api/uploadthing` | Upload file ke S3 |
| POST | `/api/seed/*` | Seed data awal (dev only) |
| GET | `/api/cron/*` | Scheduled jobs (cron) |
| GET/POST | `/api/admin/*` | CRUD data admin panel |

---

## 9. Development Workflow

### Cara Menjalankan Project di Laptop (Local Dev)
```bash
git clone <ruumy-repo> && cd RUUMY    # Masuk folder
cp .env.example .env.local             # Isi environment variables
docker-compose up -d                   # Jalankan Postgres + Redis
npm install                            # Install dependencies
npx prisma db push                     # Push schema ke database
npm run dev                            # Buka di localhost:3000
```

### Environment Variables yang Dibutuhkan
```env
# Database
DATABASE_URL="postgresql://..."

# Auth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# UploadThing (S3 file storage)
UPLOADTHING_SECRET="sk_live_xxx"
UPLOADTHING_APP_ID="app_xxx"

# OpenAI (AI Vision untuk verifikasi foto)
OPENAI_API_KEY="sk-proj-xxx"
```

### Cara Kerja Sehari-hari
- `npx prisma studio` → GUI database visual lokal.
- `npx prisma migrate dev` → Setiap ada update schema DB.
- Branch naming: `feature/nama-fitur`, `fix/nama-bug`.

### Keamanan Wajib
- **JANGAN** push `.env.local` ke GitHub.
- Rate limiting login via Redis untuk anti-spam bot.
- Semua API input divalidasi Zod sebelum masuk database.

---

## 10. UI/UX & Design Guidelines

### 10.1 Konsep Visual (Premium & Otoritatif)
- **Dark Mode:** Background `slate/deep blue` gelap — kesan investigatif & tech-forward.
- **Primary Color:** Electric Teal (`hsl(174, 86%, 45%)`) — seluruh aksen, border highlight, glow.
- **Warna Semantik:**
  - 🟢 Hijau Neon = Janji Tercapai / Skor Tinggi
  - 🔴 Merah Crimson = Janji Ingkar / Kontradiksi
  - 🟡 Kuning Amber = Status Tertunda / Peringatan
- **Glassmorphism:** Cards dan sidebar menggunakan `bg-white/[0.02] backdrop-blur-xl` untuk efek kaca.
- **Tipografi:** Font sistem (Inter/Sans Serif) dengan hierarchy yang jelas.

### 10.2 Animasi & Interaksi (Framer Motion)
- **Scroll-trigger Animations:** Elemen muncul saat user scroll (`whileInView`).
- **Accordion FAQ:** Expand/collapse dengan height animation smooth.
- **Page Transitions:** Fade in pada navigasi antar halaman.
- **Micro-interactions:** Hover effects pada cards, nav underline animation, blob background animation.

### 10.3 Design System (Tailwind + shadcn/ui)
- **`.glass-panel`** — Base glassmorphism card style.
- **`.glass-card-hover`** — Hover state dengan teal glow.
- **`.text-gradient`** — Animated teal-to-blue gradient text.
- **`.blob-bg`** — Animated blurred background blobs.

---

## 11. Timeline Development (Status Aktual)

| Fase | Target | Status | Deliverables |
|---|---|---|---|
| **Phase 1: Foundation** | Minggu 1-4 | ✅ Selesai | Docker setup, Next.js, Auth (NextAuth), Landing page, Politician list |
| **Phase 2: Core Data** | Minggu 5-8 | ✅ Selesai | CRUD Janji & RUU, Promise Radar chart, Comment/Bookmark system, RUU Watch, FAQ section |
| **Phase 3: Verify** | Minggu 9-12 | ✅ Selesai | Citizen Verification Pipeline (GPS + AI Vision), Admin Kanban, Impact Simulator |
| **Phase 4: AI & Scale** | Post-MVP | 🔄 Roadmap | ML prediction engine (NLP lebih dalam), Integrasi API live BPS/KPU/APBN, Notifikasi real-time |

---

*--- End of Document v2.0 ---*