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

    const { commentId, type } = await req.json();

    if (!commentId || !type || (type !== "up" && type !== "down")) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    // Determine the update object based on vote type
    const updateData = type === "up" 
      ? { voteUp: { increment: 1 } } 
      : { voteDown: { increment: 1 } };

    const comment = await prisma.comment.update({
      where: { id: commentId },
      data: updateData,
    });

    return NextResponse.json(comment);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
