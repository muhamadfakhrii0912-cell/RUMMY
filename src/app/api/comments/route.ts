import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { promiseId, content } = body;

    if (!promiseId || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        userId: (session.user as any).id,
        promiseId,
      },
    });

    return NextResponse.json(comment);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
