import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { promiseId } = await req.json();

    if (!promiseId) {
      return NextResponse.json({ error: "Promise ID required" }, { status: 400 });
    }

    const userId = (session.user as any).id;

    // Cek apakah sudah dibookmark
    const existing = await prisma.bookmark.findUnique({
      where: { userId_promiseId: { userId, promiseId } }
    });

    if (existing) {
      return NextResponse.json({ error: "Anda sudah memantau janji ini." }, { status: 400 });
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        userId,
        promiseId
      }
    });

    return NextResponse.json({ success: true, bookmark }, { status: 201 });

  } catch (error: any) {
    console.error("Bookmark Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan internal" }, { status: 500 });
  }
}
