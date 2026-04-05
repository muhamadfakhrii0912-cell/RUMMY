/**
 * RUUMY - Simulator Scraper Bot (Engine 1)
 * 
 * Script ini mensimulasikan tugas "Cron Job Scraper" di dunia nyata.
 * Di produksi (production), script ini akan menggunakan Puppeteer/Cheerio 
 * untuk membaca portal berita, mengirim teksnya ke OpenAI/Gemini, 
 * lalu menembakkan hasilnya ke API RUUMY.
 * 
 * Cara menjalankan: 
 * node scripts/simulator-scraper.js
 */

const RUUMY_API_URL = "http://localhost:3000/api/cron/ingest-promises";
const CRON_SECRET = "ruumy-cron-secret-123";

async function runSimulator() {
  console.log("🤖 [Scraper Bot] Memulai patroli data otomatis...");
  
  // Simulasi penundaan pencarian data (scraping)
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log("📰 [Scraper Bot] Menemukan 1 artikel berita baru dari portal nasional.");

  console.log("🧠 [Scraper Bot] Mengirim berita ke AI (LLM) untuk di-ekstrak...");
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log("✅ [Scraper Bot] AI sukses membedah janji politik.");

  console.log("📡 [Scraper Bot] Mengirim 'Payload Data' ke Server RUUMY (Database)...");
  
  try {
    // Menembak data ke API Next.js kita
    const response = await fetch(RUUMY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${CRON_SECRET}`
      }
    });

    const data = await response.json();

    if (response.ok) {
      console.log("🎉 [Server RUUMY]:", data.message);
      console.log("📊 [Database]:", data.ingestedPromises, "janji berhasil masuk dan dicatat di AuditLog!");
    } else {
      console.error("❌ [Server Error]:", data.error);
      console.error("🔍 [Detail Error]:", data.detail); 
    }
  } catch (error) {
    console.error("🚨 Gagal menghubungi Server RUUMY. Pastikan server ('npm run dev') sedang berjalan.", error.message);
  }
}

runSimulator();
