# 🔍 Blueprint: Citizen Verification Pipeline

## 📋 Ringkasan
Sistem pelaporan warga berbasis bukti foto dengan validasi otomatis (GPS + AI) sebelum masuk ke kanban verifikasi admin.

---

## 🏗️ Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────────┐
│                        CITIZEN DASHBOARD                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Langkah 1: Upload Foto (UploadThing)                     │   │
│  │  ┌─────────────┐     ┌──────────────┐     ┌───────────┐  │   │
│  │  │  📷 Kamera  │ ──► │  Upload S3   │ ──► │  URL Foto │  │   │
│  │  └─────────────┘     └──────────────┘     └───────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Langkah 2: EXIF GPS Validator (Backend)                  │   │
│  │  ┌─────────────┐     ┌──────────────┐     ┌───────────┐  │   │
│  │  │  Parse EXIF │ ──► │  Cek GPS     │ ──► │  ✅/❌     │  │   │
│  │  │  Metadata   │     │  Coordinates │     │  Valid    │  │   │
│  │  └─────────────┘     └──────────────┘     └───────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Langkah 3: AI Vision Audit (OpenAI/Gemini)               │   │
│  │  ┌─────────────┐     ┌──────────────┐     ┌───────────┐  │   │
│  │  │  Kirim URL  │ ──► │  GPT-Vision  │ ──► │  Kategori │  │   │
│  │  │  ke AI      │     │  Analysis    │     │  Gambar   │  │   │
│  │  └─────────────┘     └──────────────┘     └───────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Langkah 4: Sistem Kunci (Verification Lock)              │   │
│  │  ┌─────────────┐     ┌──────────────┐     ┌───────────┐  │   │
│  │  │  AI Match?  │ ──► │  Buat Record │ ──► │  Masuk ke │  │   │
│  │  │  Relevan?   │     │  Verification│     │  Kanban   │  │   │
│  │  └─────────────┘     └──────────────┘     └───────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Struktur File yang Akan Dibuat

```
RUUMY/
├── prisma/
│   └── schema.prisma                    # Update model Verification
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── uploadthing/
│   │   │   │   └── core.ts              # Konfigurasi UploadThing
│   │   │   │   └── route.ts             # API Route UploadThing
│   │   │   │
│   │   │   ├── verification/
│   │   │   │   └── route.ts             # POST: Submit laporan baru
│   │   │   │
│   │   │   └── admin/
│   │   │       └── verifications/
│   │   │           └── route.ts         # Sudah ada (akan diupdate)
│   │   │
│   │   ├── dashboard/
│   │   │   ├── page.tsx                 # Sudah ada
│   │   │   ├── report/
│   │   │   │   └── page.tsx             # 🆕 Halaman form laporan
│   │   │   └── my-reports/
│   │   │       └── page.tsx             # 🆕 Riwayat laporan user
│   │   │
│   │   └── admin/
│   │       └── verifications/
│   │           └── page.tsx             # Sudah ada (kanban admin)
│   │
│   ├── components/
│   │   ├── verification/
│   │   │   ├── PhotoUploader.tsx        # 🆕 Komponen upload + preview
│   │   │   ├── GpsStatus.tsx            # 🆕 Status validasi GPS
│   │   │   ├── AiAnalysisResult.tsx     # 🆕 Hasil analisis AI
│   │   │   ├── ReportForm.tsx           # 🆕 Form lengkap laporan
│   │   │   └── VerificationCard.tsx     # 🆕 Kartu laporan di kanban
│   │   │
│   │   └── ui/
│   │       └── ...                      # Komponen UI existing
│   │
│   ├── lib/
│   │   ├── uploadthing.ts               # 🆕 Client helper UploadThing
│   │   ├── exif-parser.ts               # 🆕 Fungsi parse EXIF/GPS
│   │   ├── ai-vision.ts                 # 🆕 Fungsi panggil AI Vision
│   │   └── verification-pipeline.ts     # 🆕 Orkestrasi 4 langkah
│   │
│   └── hooks/
│       └── useVerification.ts           # 🆕 React Query hooks
│
├── .env.example                         # Update: tambah AI API key
└── package.json                         # Update: tambah dependencies
```

---

## 🗄️ 1. Database Schema Update

### Model Verification (Update)

```prisma
model Verification {
  id              String             @id @default(cuid())
  userId          String
  promiseId       String?
  title           String
  description     String             @db.Text
  imageUrl        String?
  
  // GPS & EXIF Data
  latitude        Float?
  longitude       Float?
  exifData        Json?              // 🆕 Simpan metadata EXIF mentah
  gpsVerified     Boolean            @default(false)  // 🆕 Status validasi GPS
  
  // AI Analysis
  aiCategory      String?            // 🆕 Kategori dari AI (e.g., "infrastructure_damage")
  aiConfidence    Float?             // 🆕 Skor kepercayaan AI (0-1)
  aiRawResponse   String?            @db.Text  // 🆕 Response mentah AI
  aiVerified      Boolean            @default(false)  // 🆕 Status validasi AI
  
  // Pipeline Status
  pipelineStatus  VerificationPipelineStatus @default(UPLOADING)  // 🆕 Track progress
  
  // Moderation
  status          VerificationStatus @default(PENDING)
  moderatorId     String?
  moderatorNotes  String?            @db.Text
  
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt

  user            User               @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("verifications")
}

// 🆕 Enum baru untuk tracking pipeline
enum VerificationPipelineStatus {
  UPLOADING        // Langkah 1: Upload foto ke S3
  GPS_VALIDATING   // Langkah 2: Validasi GPS
  AI_ANALYZING     // Langkah 3: Analisis AI
  LOCKED           // Langkah 4: Terverifikasi, masuk kanban
  FAILED           // Gagal di salah satu langkah
}
```

### Tabel Audit Trail (Update)

```prisma
// Tambah field di AuditLog untuk tracking pipeline
model AuditLog {
  // ... existing fields ...
  
  pipelineStep    String?            // 🆕 "UPLOAD", "GPS_CHECK", "AI_AUDIT", "LOCK"
  pipelineResult  String?            @db.Text  // 🆕 Hasil step (JSON)
  
  // ... existing fields ...
}
```

---

## 🔧 2. Dependencies Baru

### package.json additions

```json
{
  "dependencies": {
    "uploadthing": "^6.13.0",
    "@uploadthing/react": "^6.8.0",
    "exifr": "^7.1.3",
    "openai": "^4.70.0",
    "sharp": "^0.33.5"
  }
}
```

### .env additions

```env
# UploadThing
UPLOADTHING_SECRET="sk_live_xxx"
UPLOADTHING_APP_ID="app_xxx"

# OpenAI (untuk Vision API)
OPENAI_API_KEY="sk-proj-xxx"

# Optional: Google Gemini Vision (alternatif)
GOOGLE_AI_API_KEY="xxx"
```

---

## 📝 3. Implementasi Detail per Langkah

### Langkah 1: Upload Foto (UploadThing + S3)

**File:** `src/app/api/uploadthing/core.ts`

```typescript
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
  verificationPhoto: f({
    image: { 
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      // Auth check
      const session = await getServerSession(authOptions);
      if (!session) throw new Error("Unauthorized");
      
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Log upload untuk audit trail
      console.log("Upload complete for user:", metadata.userId);
      console.log("File URL:", file.url);
      
      return { 
        uploadedBy: metadata.userId, 
        url: file.url,
        key: file.key,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
```

**File:** `src/app/api/uploadthing/route.ts`

```typescript
import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
```

**File:** `src/components/verification/PhotoUploader.tsx`

```typescript
"use client";

import { UploadButton } from "@/lib/uploadthing";
import { useState } from "react";
import { ImagePlus, Loader2, CheckCircle } from "lucide-react";

interface PhotoUploaderProps {
  onUploadComplete: (data: { url: string; key: string }) => void;
}

export function PhotoUploader({ onUploadComplete }: PhotoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {!preview ? (
        <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center">
          <ImagePlus className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-4">
            Foto bukti lapangan (maks. 8MB)
          </p>
          <UploadButton
            endpoint="verificationPhoto"
            onUploadBegin={() => setUploading(true)}
            onClientUploadComplete={(res) => {
              setUploading(false);
              const data = res[0];
              setPreview(data.url);
              onUploadComplete({ url: data.url, key: data.key });
            }}
            onUploadError={(error) => {
              setUploading(false);
              console.error("Upload failed:", error);
            }}
          />
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-white/10">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-64 object-cover"
          />
          <div className="absolute top-3 right-3 bg-green-500/90 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Terupload
          </div>
        </div>
      )}
    </div>
  );
}
```

---

### Langkah 2: EXIF GPS Parser

**File:** `src/lib/exif-parser.ts`

```typescript
import * as exifr from "exifr";

interface GpsData {
  latitude: number;
  longitude: number;
  altitude?: number;
  timestamp?: Date;
}

interface ExifResult {
  gps: GpsData | null;
  hasGps: boolean;
  camera?: string;
  timestamp?: Date;
  rawMetadata: Record<string, unknown>;
}

/**
 * Parse EXIF data dari URL foto untuk ekstrak GPS coordinates
 * Returns null jika tidak ada GPS data (foto dari internet/screenshot)
 */
export async function parseExifFromUrl(imageUrl: string): Promise<ExifResult> {
  try {
    // Fetch image as buffer
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();

    // Parse EXIF
    const exif = await exifr.parse(buffer, {
      gps: true,
      tiff: true,
      xmp: true,
      icc: false,
      jfif: false,
      ihdr: false,
    });

    if (!exif) {
      return {
        gps: null,
        hasGps: false,
        rawMetadata: {},
      };
    }

    const hasGps = !!(exif.latitude && exif.longitude);

    return {
      gps: hasGps
        ? {
            latitude: exif.latitude,
            longitude: exif.longitude,
            altitude: exif.altitude || undefined,
            timestamp: exif.DateTimeOriginal || exif.CreateDate || undefined,
          }
        : null,
      hasGps,
      camera: exif.Make && exif.Model
        ? `${exif.Make} ${exif.Model}`
        : undefined,
      timestamp: exif.DateTimeOriginal || exif.CreateDate || undefined,
      rawMetadata: exif,
    };
  } catch (error) {
    console.error("EXIF parsing error:", error);
    return {
      gps: null,
      hasGps: false,
      rawMetadata: {},
    };
  }
}

/**
 * Validasi apakah GPS coordinates masuk akal (bukan di tengah laut)
 */
export function validateGpsCoordinates(lat: number, lng: number): boolean {
  // Indonesia bounding box (perkiraan)
  const INDONESIA_BOUNDS = {
    minLat: -11.0,
    maxLat: 6.0,
    minLng: 95.0,
    maxLng: 141.0,
  };

  return (
    lat >= INDONESIA_BOUNDS.minLat &&
    lat <= INDONESIA_BOUNDS.maxLat &&
    lng >= INDONESIA_BOUNDS.minLng &&
    lng <= INDONESIA_BOUNDS.maxLng
  );
}

/**
 * Hitung jarak antara 2 titik GPS (Haversine formula)
 * Berguna untuk validasi: apakah foto dekat dengan lokasi janji?
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}
```

---

### Langkah 3: AI Vision Audit

**File:** `src/lib/ai-vision.ts`

```typescript
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Kategori yang valid untuk verifikasi
const VALID_CATEGORIES = [
  "infrastructure_damage",    // Jalan rusak, jembatan retak
  "infrastructure_progress",  // Proyek konstruksi berjalan
  "infrastructure_complete",  // Proyek selesai
  "public_facility",          // Fasilitas umum (taman, lampu jalan)
  "environmental",            // Masalah lingkungan (banjir, sampah)
  "irrelevant",               // Bukan kategori valid (bakso, kucing, dll)
] as const;

export interface AiAnalysisResult {
  category: string;
  confidence: number;
  description: string;
  isRelevant: boolean;
  rawResponse: string;
}

/**
 * Analisis gambar menggunakan OpenAI GPT-4o Vision
 * Menentukan apakah foto relevan untuk verifikasi janji infrastruktur
 */
export async function analyzeImageWithAi(
  imageUrl: string,
  context?: {
    promiseTitle?: string;
    promiseDescription?: string;
    expectedCategory?: string;
  }
): Promise<AiAnalysisResult> {
  try {
    const systemPrompt = `
Anda adalah AI auditor untuk platform akuntabilitas publik RUUMY.

Tugas Anda:
1. Analisis gambar yang diberikan
2. Tentukan kategori gambar dari daftar berikut:
   - infrastructure_damage: Kerusakan infrastruktur (jalan retak, jembatan rusak)
   - infrastructure_progress: Progres pembangunan (proyek konstruksi berjalan)
   - infrastructure_complete: Infrastruktur selesai dibangun
   - public_facility: Fasilitas umum (taman, lampu jalan, trotoar)
   - environmental: Masalah lingkungan (banjir, sampah, polusi)
   - irrelevant: Gambar tidak relevan (makanan, hewan, selfie, screenshot, dll)

3. Berikan confidence score (0-1) untuk analisis Anda
4. Deskripsikan apa yang Anda lihat dalam 1-2 kalimat

PENTING:
- Jika gambar adalah makanan, hewan, selfie, atau bukan bukti lapangan → kategori "irrelevant"
- Jika gambar adalah screenshot/teks tanpa konteks lapangan → kategori "irrelevant"
- Hanya terima gambar yang menunjukkan kondisi fisik infrastruktur/fasilitas umum

Format response JSON:
{
  "category": "nama_kategori",
  "confidence": 0.95,
  "description": "Deskripsi singkat apa yang terlihat",
  "isRelevant": true/false
}
`;

    let userPrompt = "Analisis gambar berikut untuk verifikasi laporan warga.";

    if (context?.promiseTitle) {
      userPrompt += `\n\nKonteks janji: "${context.promiseTitle}"`;
    }
    if (context?.promiseDescription) {
      userPrompt += `\nDetail: "${context.promiseDescription}"`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            { type: "text", text: userPrompt },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
                detail: "high",
              },
            },
          ],
        },
      ],
      max_tokens: 500,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("Empty response from AI");
    }

    const parsed = JSON.parse(content) as AiAnalysisResult;

    return {
      category: parsed.category || "irrelevant",
      confidence: parsed.confidence || 0,
      description: parsed.description || "",
      isRelevant: parsed.isRelevant ?? false,
      rawResponse: content,
    };
  } catch (error) {
    console.error("AI Vision analysis error:", error);
    return {
      category: "irrelevant",
      confidence: 0,
      description: "Gagal menganalisis gambar",
      isRelevant: false,
      rawResponse: JSON.stringify({ error: String(error) }),
    };
  }
}
```

---

### Langkah 4: Sistem Kunci (Verification Lock)

**File:** `src/lib/verification-pipeline.ts`

```typescript
import { prisma } from "@/lib/prisma";
import { parseExifFromUrl, validateGpsCoordinates } from "@/lib/exif-parser";
import { analyzeImageWithAi } from "@/lib/ai-vision";

interface PipelineInput {
  verificationId: string;
  imageUrl: string;
  promiseId?: string;
}

interface PipelineResult {
  success: boolean;
  status: string;
  gpsVerified: boolean;
  aiVerified: boolean;
  error?: string;
}

/**
 * Orkestrasi 4 langkah pipeline verifikasi:
 * 1. Upload → URL (sudah dilakukan sebelum call ini)
 * 2. EXIF GPS Validation
 * 3. AI Vision Analysis
 * 4. Lock & Push to Kanban
 */
export async function runVerificationPipeline(
  input: PipelineInput
): Promise<PipelineResult> {
  const { verificationId, imageUrl, promiseId } = input;

  try {
    // Update status: mulai pipeline
    await prisma.verification.update({
      where: { id: verificationId },
      data: { pipelineStatus: "GPS_VALIDATING" },
    });

    // ─── LANGKAH 2: EXIF GPS VALIDATION ───
    const exifResult = await parseExifFromUrl(imageUrl);

    if (!exifResult.hasGps || !exifResult.gps) {
      await prisma.verification.update({
        where: { id: verificationId },
        data: {
          pipelineStatus: "FAILED",
          status: "REJECTED",
          moderatorNotes: "Foto tidak memiliki data GPS. Pastikan foto diambil langsung dari kamera HP.",
        },
      });

      await createAuditLog(verificationId, "GPS_CHECK", "FAILED", "No GPS data in EXIF");

      return {
        success: false,
        status: "FAILED_GPS",
        gpsVerified: false,
        aiVerified: false,
        error: "Foto tidak memiliki data GPS",
      };
    }

    // Validasi koordinat GPS (apakah di Indonesia?)
    const isValidLocation = validateGpsCoordinates(
      exifResult.gps.latitude,
      exifResult.gps.longitude
    );

    if (!isValidLocation) {
      await prisma.verification.update({
        where: { id: verificationId },
        data: {
          pipelineStatus: "FAILED",
          status: "REJECTED",
          moderatorNotes: "Lokasi GPS tidak valid (di luar Indonesia).",
        },
      });

      return {
        success: false,
        status: "FAILED_GPS_INVALID",
        gpsVerified: false,
        aiVerified: false,
        error: "Lokasi GPS tidak valid",
      };
    }

    // Simpan data GPS
    await prisma.verification.update({
      where: { id: verificationId },
      data: {
        latitude: exifResult.gps.latitude,
        longitude: exifResult.gps.longitude,
        exifData: exifResult.rawMetadata as any,
        gpsVerified: true,
        pipelineStatus: "AI_ANALYZING",
      },
    });

    await createAuditLog(verificationId, "GPS_CHECK", "PASSED", JSON.stringify(exifResult.gps));

    // ─── LANGKAH 3: AI VISION ANALYSIS ───
    let promiseContext;
    if (promiseId) {
      const promise = await prisma.promise.findUnique({
        where: { id: promiseId },
        select: { title: true, description: true, category: true },
      });
      promiseContext = promise;
    }

    const aiResult = await analyzeImageWithAi(imageUrl, {
      promiseTitle: promiseContext?.title,
      promiseDescription: promiseContext?.description,
      expectedCategory: promiseContext?.category,
    });

    // ─── LANGKAH 4: SISTEM KUNCI ───
    if (!aiResult.isRelevant || aiResult.category === "irrelevant") {
      await prisma.verification.update({
        where: { id: verificationId },
        data: {
          pipelineStatus: "FAILED",
          status: "REJECTED",
          aiCategory: aiResult.category,
          aiConfidence: aiResult.confidence,
          aiRawResponse: aiResult.rawResponse,
          aiVerified: false,
          moderatorNotes: `AI mendeteksi gambar tidak relevan: ${aiResult.description}`,
        },
      });

      await createAuditLog(verificationId, "AI_AUDIT", "FAILED", aiResult.rawResponse);

      return {
        success: false,
        status: "FAILED_AI",
        gpsVerified: true,
        aiVerified: false,
        error: `Gambar tidak relevan: ${aiResult.description}`,
      };
    }

    // ✅ GAMBAR LOLES SEMUA VALIDASI - LOCK & PUSH TO KANBAN
    await prisma.verification.update({
      where: { id: verificationId },
      data: {
        pipelineStatus: "LOCKED",
        status: "PENDING", // Masuk kanban untuk review admin final
        aiCategory: aiResult.category,
        aiConfidence: aiResult.confidence,
        aiRawResponse: aiResult.rawResponse,
        aiVerified: true,
      },
    });

    await createAuditLog(verificationId, "LOCK", "SUCCESS", JSON.stringify({
      gps: { lat: exifResult.gps.latitude, lng: exifResult.gps.longitude },
      ai: aiResult.category,
      confidence: aiResult.confidence,
    }));

    return {
      success: true,
      status: "LOCKED",
      gpsVerified: true,
      aiVerified: true,
    };
  } catch (error) {
    console.error("Pipeline error:", error);

    await prisma.verification.update({
      where: { id: verificationId },
      data: {
        pipelineStatus: "FAILED",
        status: "REJECTED",
        moderatorNotes: `Error sistem: ${String(error)}`,
      },
    });

    return {
      success: false,
      status: "FAILED_ERROR",
      gpsVerified: false,
      aiVerified: false,
      error: String(error),
    };
  }
}

/**
 * Helper: Buat audit log untuk setiap step pipeline
 */
async function createAuditLog(
  verificationId: string,
  step: string,
  result: string,
  details: string
) {
  await prisma.auditLog.create({
    data: {
      action: `VERIFICATION_${step}`,
      entityType: "VERIFICATION",
      entityId: verificationId,
      newValue: result,
      reason: details,
      aiAgent: step === "GPS_CHECK" || step === "AI_AUDIT",
    },
  });
}
```

---

## 🚀 4. API Routes

### Submit Verification (Entry Point)

**File:** `src/app/api/verification/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { runVerificationPipeline } from "@/lib/verification-pipeline";
import { z } from "zod";

const verificationSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(10).max(2000),
  imageUrl: z.string().url(),
  promiseId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = verificationSchema.parse(body);

    // Langkah 1: Buat record verification (status: UPLOADING)
    const verification = await prisma.verification.create({
      data: {
        userId: (session.user as any).id,
        title: validated.title,
        description: validated.description,
        imageUrl: validated.imageUrl,
        promiseId: validated.promiseId,
        pipelineStatus: "UPLOADING",
      },
    });

    // Jalankan pipeline (Langkah 2-4)
    const result = await runVerificationPipeline({
      verificationId: verification.id,
      imageUrl: validated.imageUrl,
      promiseId: validated.promiseId,
    });

    return NextResponse.json({
      success: result.success,
      verificationId: verification.id,
      status: result.status,
      gpsVerified: result.gpsVerified,
      aiVerified: result.aiVerified,
      error: result.error,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

---

## 🖥️ 5. Frontend Components

### Halaman Report (Form Lengkap)

**File:** `src/app/dashboard/report/page.tsx`

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PhotoUploader } from "@/components/verification/PhotoUploader";
import { GpsStatus } from "@/components/verification/GpsStatus";
import { AiAnalysisResult } from "@/components/verification/AiAnalysisResult";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ReportPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async () => {
    setSubmitting(true);
    setStep(2); // Show processing

    try {
      const res = await fetch("/api/verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
        }),
      });

      const data = await res.json();
      setResult(data);
      setStep(3); // Show result
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="text-muted-foreground hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Laporkan Temuan</h1>
          <p className="text-muted-foreground text-sm">
            Foto bukti lapangan akan diverifikasi otomatis oleh sistem
          </p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2">
        {["Upload Foto", "Verifikasi", "Hasil"].map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step > i + 1
                  ? "bg-green-500 text-white"
                  : step === i + 1
                  ? "bg-primary text-white"
                  : "bg-white/10 text-muted-foreground"
              }`}
            >
              {step > i + 1 ? "✓" : i + 1}
            </div>
            <span
              className={`text-sm hidden sm:inline ${
                step >= i + 1 ? "text-white" : "text-muted-foreground"
              }`}
            >
              {label}
            </span>
            {i < 2 && <div className="flex-1 h-px bg-white/10" />}
          </div>
        ))}
      </div>

      {/* Step 1: Form Upload */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-white mb-2 block">
              Judul Laporan
            </label>
            <Input
              placeholder="Contoh: Jalan Retak di Jl. Sudirman No. 45"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white/5 border-white/10"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white mb-2 block">
              Deskripsi
            </label>
            <textarea
              placeholder="Jelaskan kondisi yang Anda lihat..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-[120px] rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white mb-2 block">
              Foto Bukti
            </label>
            <PhotoUploader
              onUploadComplete={(data) => setImageUrl(data.url)}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!title || !description || !imageUrl || submitting}
            className="w-full"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Kirim Laporan
              </>
            )}
          </Button>
        </div>
      )}

      {/* Step 2: Processing */}
      {step === 2 && (
        <div className="glass-panel p-8 rounded-2xl text-center space-y-6">
          <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
          <div>
            <h3 className="text-lg font-medium text-white mb-2">
              Memverifikasi Laporan...
            </h3>
            <p className="text-muted-foreground text-sm">
              Sistem sedang memeriksa GPS dan menganalisis foto Anda
            </p>
          </div>
          <GpsStatus status="checking" />
        </div>
      )}

      {/* Step 3: Result */}
      {step === 3 && result && (
        <div className="space-y-6">
          {result.success ? (
            <div className="glass-panel p-8 rounded-2xl border-green-500/20">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Laporan Berhasil Diverifikasi!
                </h3>
                <p className="text-muted-foreground">
                  Laporan Anda telah masuk ke antrian review admin
                </p>
              </div>
              <AiAnalysisResult result={result} />
              <Button onClick={() => router.push("/dashboard/my-reports")} className="w-full mt-4">
                Lihat Laporan Saya
              </Button>
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-2xl border-red-500/20">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Verifikasi Gagal
                </h3>
                <p className="text-muted-foreground">{result.error}</p>
              </div>
              <Button onClick={() => setStep(1)} variant="outline" className="w-full">
                Coba Lagi
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## 📊 6. Flow Diagram Lengkap

```
┌─────────────────────────────────────────────────────────────┐
│                    DASHBOARD WARGA                           │
│                                                              │
│  [📷 Tombol "Laporkan Temuan"] ──► /dashboard/report         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  HALAMAN FORM LAPORAN                                        │
│  1. Input judul & deskripsi                                  │
│  2. Upload foto (UploadThing → S3) → dapat URL               │
│  3. Klik "Kirim Laporan"                                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ POST /api/verification
┌─────────────────────────────────────────────────────────────┐
│  BACKEND PIPELINE                                            │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Step 1: Buat record DB (status: UPLOADING)           │   │
│  └──────────────────────────────────────────────────────┘   │
│                          │                                    │
│                          ▼                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Step 2: parseExifFromUrl(imageUrl)                   │   │
│  │   ├─ Ada GPS? → YES → lanjut                        │   │
│  │   └─ Ada GPS? → NO  → REJECT (status: FAILED_GPS)   │   │
│  └──────────────────────────────────────────────────────┘   │
│                          │                                    │
│                          ▼                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Step 3: analyzeImageWithAi(imageUrl)                 │   │
│  │   ├─ Relevant? → YES → lanjut                       │   │
│  │   └─ Relevant? → NO  → REJECT (status: FAILED_AI)   │   │
│  └──────────────────────────────────────────────────────┘   │
│                          │                                    │
│                          ▼                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Step 4: LOCK → Update status: PENDING                │   │
│  │   └─ Masuk ke kanban admin untuk review final        │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  ADMIN KANBAN (/admin/verifications)                         │
│                                                              │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐                │
│  │ PENDING  │──►│ APPROVED │   │ REJECTED │                │
│  │   (3)    │   │   (12)   │   │   (5)    │                │
│  └──────────┘   └──────────┘   └──────────┘                │
│                                                              │
│  Admin bisa:                                                 │
│  - Lihat foto + GPS map + AI result                         │
│  - Approve → status: APPROVED                               │
│  - Reject  → status: REJECTED + notes                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 7. Security & Anti-Manipulasi

| Layer | Mekanisme | Tujuan |
|-------|-----------|--------|
| **Auth** | NextAuth session check | Hanya user login bisa upload |
| **Upload** | UploadThing middleware + 8MB limit | Cegah upload file berbahaya |
| **GPS** | EXIF parser + Indonesia bounding box | Cegah foto dari internet |
| **AI** | GPT-4o Vision + category filter | Cegah foto tidak relevan |
| **Audit** | AuditLog untuk setiap pipeline step | Track semua perubahan |
| **Rate Limit** | Redis-based (future) | Cegah spam laporan |

---

## 📈 8. Metrics & Monitoring

```typescript
// Dashboard metrics yang bisa ditambahkan
interface VerificationMetrics {
  totalReports: number;
  passedGps: number;        // % laporan yang lolos GPS check
  passedAi: number;         // % laporan yang lolos AI audit
  approvedByAdmin: number;  // % laporan yang diapprove admin
  avgProcessingTime: number; // Rata-rata waktu pipeline (ms)
  topCategories: Array<{    // Kategori laporan terbanyak
    category: string;
    count: number;
  }>;
}
```

---

## 🎯 9. Checklist Implementasi

### Phase 1: Setup (Minggu 1)
- [ ] Install dependencies: `uploadthing`, `exifr`, `openai`, `sharp`
- [ ] Update Prisma schema + migrate
- [ ] Setup UploadThing API routes
- [ ] Tambah env variables

### Phase 2: Core Pipeline (Minggu 2)
- [ ] Implement `exif-parser.ts`
- [ ] Implement `ai-vision.ts`
- [ ] Implement `verification-pipeline.ts`
- [ ] Implement `POST /api/verification`

### Phase 3: Frontend (Minggu 3)
- [ ] Buat halaman `/dashboard/report`
- [ ] Buat halaman `/dashboard/my-reports`
- [ ] Komponen PhotoUploader
- [ ] Komponen GpsStatus
- [ ] Komponen AiAnalysisResult
- [ ] Update admin kanban

### Phase 4: Polish (Minggu 4)
- [ ] Error handling & loading states
- [ ] Toast notifications
- [ ] Map preview untuk GPS
- [ ] Testing end-to-end
- [ ] Documentation

---

## 💡 10. Contoh Use Case: Budi Melaporkan Jalan Retak

```
1. Budi login ke RUUMY → Dashboard → "Laporkan Temuan"
2. Budi isi form:
   - Judul: "Jalan Retak di Jl. Tol Jakarta-Cikampek KM 47"
   - Deskripsi: "Retakan sepanjang 2 meter, sudah 3 bulan tidak diperbaiki"
   - Upload foto dari HP (langsung kamera, bukan dari galeri)

3. Sistem memproses:
   ✅ Upload ke S3 → URL: https://utfs.io/f/abc123.jpg
   ✅ EXIF GPS → Lat: -6.234, Lng: 107.123 (valid, di Indonesia)
   ✅ AI Vision → Category: "infrastructure_damage", Confidence: 0.94
   ✅ LOCK → Status: PENDING (masuk kanban admin)

4. Admin melihat di kanban:
   - Foto jalan retak
   - Peta lokasi GPS
   - Hasil analisis AI: "Jalanan rusak - 94% confidence"
   - Admin klik "Approve" → Status: APPROVED

5. Laporan Budi muncul di:
   - Dashboard publik sebagai bukti lapangan
   - Profil Budi sebagai kontribusi valid
   - Skor "Kebenaran Index" politisi terkait terupdate
```

---

*Blueprint ini siap untuk diimplementasikan. Setiap file sudah memiliki struktur kode yang bisa langsung digunakan.*
