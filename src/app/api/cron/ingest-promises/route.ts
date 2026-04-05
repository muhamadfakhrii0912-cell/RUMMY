import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Mengamankan cron job agar tidak bisa dipanggil sembarang orang
const CRON_SECRET = process.env.CRON_SECRET || "ruumy-cron-secret-123";

export async function POST(req: Request) {
  try {
    // 1. Otorisasi Header (Keamanan Anti-Spam)
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // --- ENGINE 1: SIMULASI SCRAPER & AI LLM CATEGORIZATION ---
    // Di dunia nyata, di sinilah Puppeteer/Cheerio dan API OpenAI (gpt-4) berjalan.
    // Karena ini kerangka pipeline, kita akan mensimulasikan hasil scrape data dari portal berita/twitter
    // yang sudah dikonversi oleh AI ke format JSON.
    
    // Asumsi: AI model baru saja mengekstrak berita tentang Politisi A
    const mockAiExtractedData = [
      {
        politicianName: "Gubernur X",
        title: "Pembangunan Jalur MRT Timur-Barat",
        description: "Membangun jalur MRT Fase Timur-Barat sepanjang 30 KM untuk mengurangi kemacetan komuter.", // ADDED
        category: "Infrastruktur",
        metrics: "Selesai 30 Kilometer",
        deadline: new Date("2027-12-31"),
        source: "Konferensi Pers X",
        sourceUrl: "https://twitter.com/contoh/123",
      }
    ];

    const results = [];

    for (const data of mockAiExtractedData) {
      // Step A: Cari atau buat Politisi
      let politician = await prisma.politician.findFirst({
        where: { name: data.politicianName }
      });

      if (!politician) {
        politician = await prisma.politician.create({
          data: {
            name: data.politicianName,
            position: "Gubernur",
            party: "Independent"
          }
        });
      }

      // Step B: Masukkan Janji ke Pipeline Database
      const newPromise = await prisma.promise.create({
        data: {
          title: data.title,
          description: data.description, // ADDED
          category: data.category,
          metrics: data.metrics,
          deadline: data.deadline,
          source: data.source,
          sourceUrl: data.sourceUrl,
          status: "PENDING",
          politicianId: politician.id
        }
      });

      // Step C: Catat di Audit Trail (Strategy Anti-Manipulasi)
      await prisma.auditLog.create({
        data: {
          action: "AI_INGESTION",
          entityType: "PROMISE",
          entityId: newPromise.id,
          newValue: JSON.stringify(data),
          reason: "Otomatis di-scrape dari portal berita via Engine 1",
          aiAgent: true
        }
      });

      results.push(newPromise);
    }

    return NextResponse.json({
      message: "Scraping pipeline berhasil dieksekusi",
      ingestedPromises: results.length,
      data: results
    }, { status: 200 });

  } catch (error: any) {
    console.error("Pipeline Error:", error);
    return NextResponse.json({ error: "Gagal menjalankan Data Pipeline", detail: error.message }, { status: 500 });
  }
}
