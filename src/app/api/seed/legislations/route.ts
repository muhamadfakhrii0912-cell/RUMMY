import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { legislations } = await req.json();

    if (!legislations || !Array.isArray(legislations)) {
      return NextResponse.json({ error: "Data legislations diperlukan" }, { status: 400 });
    }

    let count = 0;
    for (const leg of legislations) {
      await prisma.legislation.upsert({
        where: { id: leg.id || "___never_match___" },
        update: {},
        create: {
          title: leg.title,
          number: leg.number || null,
          type: leg.type,
          status: leg.status,
          description: leg.description,
          url: leg.url || null,
          passedAt: leg.passedAt ? new Date(leg.passedAt) : null,
        }
      });
      count++;
    }

    return NextResponse.json({ success: true, count }, { status: 201 });
  } catch (error: any) {
    console.error("Seed Legislation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
