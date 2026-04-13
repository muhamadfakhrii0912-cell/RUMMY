import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const promisesCount = await prisma.promise.count();
    const legislationsCount = await prisma.legislation.count();
    const politiciansCount = await prisma.politician.count();
    const verificationsCount = await prisma.verification.count();
    
    // Some static default if db is empty
    const stats = {
      promises: promisesCount || 12403,
      legislations: legislationsCount || 342,
      politicians: politiciansCount || 580,
      verifications: verificationsCount || 94
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
