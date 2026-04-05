import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  // Optional: check session role

  try {
    const verifications = await prisma.verification.findMany({
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(verifications);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  
  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: "ID dan status diperlukan" }, { status: 400 });
    }

    const updated = await prisma.verification.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengupdate data" }, { status: 500 });
  }
}
