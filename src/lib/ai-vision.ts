import OpenAI from "openai";

// Pastikan Anda menaruh OPENAI_API_KEY di .env.local
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "DUMMY",
});

export interface AiAnalysisResult {
  category: string;
  confidence: number;
  description: string;
  isRelevant: boolean;
  rawResponse: string;
}

export async function analyzeImageWithAi(
  imageUrl: string,
  context?: {
    promiseTitle?: string;
    promiseDescription?: string;
    expectedCategory?: string;
  }
): Promise<AiAnalysisResult> {
  // Jika tidak menaruh API Key di ENV, kita bypass dengan AI simulasi sukses
  if (process.env.OPENAI_API_KEY === "DUMMY" || !process.env.OPENAI_API_KEY) {
      console.log("No OPENAI_API_KEY found. Utilizing simulated AI Validator.");
      return {
          category: "infrastructure_damage",
          confidence: 0.95,
          description: "Gambar disimulasikan sebagai jalan rusak. AI Test Pass.",
          isRelevant: true,
          rawResponse: "{ simulated: true }"
      }
  }

  try {
    const systemPrompt = `
Anda adalah AI auditor untuk platform akuntabilitas publik RUUMY.
Tugas Anda:
1. Analisis gambar yang diberikan
2. Tentukan kategori gambar dari: infrastructure_damage, infrastructure_progress, infrastructure_complete, public_facility, environmental, atau irrelevant.
3. Berikan confidence score (0-1)
4. Deskripsikan apa yang Anda lihat dalam 1-2 kalimat

PENTING:
Jika gambar adalah makanan, hewan, selfie, tulisan, layar, atau screenshot -> "irrelevant"
Format response WAJIB JSON: {"category": "...", "confidence": 0.9, "description": "...", "isRelevant": true/false}
`;

    let userPrompt = "Analisis gambar berikut untuk verifikasi laporan warga.";
    if (context?.promiseTitle) userPrompt += `\nKonteks janji: "${context.promiseTitle}"`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { 
          role: "user", 
          content: [
            { type: "text", text: userPrompt },
            { type: "image_url", image_url: { url: imageUrl, detail: "low" } }
          ] 
        }
      ],
      max_tokens: 300,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("Empty response from AI");

    const parsed = JSON.parse(content) as AiAnalysisResult;
    return {
      category: parsed.category ?? "irrelevant",
      confidence: parsed.confidence ?? 0,
      description: parsed.description ?? "",
      isRelevant: parsed.isRelevant ?? false,
      rawResponse: content,
    };
  } catch (error) {
    console.error("AI Vision analysis error:", error);
    return {
      category: "irrelevant",
      confidence: 0,
      description: "Gagal menganalisis gambar via API (atau limit habis).",
      isRelevant: false,
      rawResponse: JSON.stringify({ error: String(error) }),
    };
  }
}
