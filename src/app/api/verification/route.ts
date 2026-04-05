import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { runVerificationPipeline } from "@/lib/verification-pipeline";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, description, imageUrl, promiseId } = await req.json();

    if (!title || !description || !imageUrl) {
      return NextResponse.json({ error: "Kolom wajib tidak lengkap" }, { status: 400 });
    }

    // 1. Create Data Awal di DB (Status UPLOADING)
    const verification = await prisma.verification.create({
      data: {
        title,
        description,
        imageUrl,
        promiseId: promiseId || null,
        userId: (session.user as any).id,
        pipelineStatus: "UPLOADING",
        status: "PENDING"
      }
    });

    // 2. Kick-off Engine 3 Pipeline (Secara async agar tidak memblokir response ke Frontend secara ekstrim)
    // Di produksi, kita akan pakai Inngest / BullsMQ. Di sini kita biarkan node handle secara async.
    runVerificationPipeline({
      verificationId: verification.id,
      imageUrl,
      promiseId
    }).then(res => {
      console.log(`Pipeline Selesai untuk ${verification.id}. Hasil:`, res.status);
    });

    return NextResponse.json({ 
      success: true, 
      verificationId: verification.id,
      message: "Laporan berhasil diterima! Sistem AI dan GPS Validator sedang meninjau foto Anda." 
    }, { status: 201 });

  } catch (error: any) {
    console.error("Verification Submission Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan sistem internal." }, { status: 500 });
  }
}
