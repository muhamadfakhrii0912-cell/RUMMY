"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// --- POLITICIANS ---
export async function createPolitician(data: FormData) {
  await prisma.politician.create({
    data: {
      name: data.get("name") as string,
      party: data.get("party") as string,
      position: data.get("position") as string,
      bio: data.get("bio") as string,
    }
  });
  revalidatePath("/admin/politicians");
  revalidatePath("/politicians");
}

export async function deletePolitician(id: string) {
  await prisma.politician.delete({ where: { id } });
  revalidatePath("/admin/politicians");
  revalidatePath("/politicians");
}

// --- PROMISES ---
export async function createPromise(data: FormData) {
  const promise = await prisma.promise.create({
    data: {
      politicianId: data.get("politicianId") as string,
      title: data.get("title") as string,
      description: data.get("description") as string,
      category: data.get("category") as string,
      status: data.get("status") as any,
    }
  });
  
  await recalculateTruthScore(promise.politicianId);
  revalidatePath("/admin/promises");
  revalidatePath("/database");
}

export async function changePromiseStatus(id: string, politicianId: string, status: any) {
  await prisma.promise.update({
    where: { id },
    data: { status }
  });
  
  await recalculateTruthScore(politicianId);
  revalidatePath("/admin/promises");
  revalidatePath("/database");
  revalidatePath(`/database/${id}`);
}

export async function deletePromise(id: string, politicianId: string) {
  await prisma.promise.delete({ where: { id } });
  await recalculateTruthScore(politicianId);
  revalidatePath("/admin/promises");
  revalidatePath("/database");
}

// --- TRUTH SCORE CALCULATION ---
export async function recalculateTruthScore(politicianId: string) {
  const promises = await prisma.promise.findMany({
    where: { politicianId }
  });

  if (promises.length === 0) return;

  const fulfilled = promises.filter(p => p.status === 'FULFILLED').length;
  const failed = promises.filter(p => p.status === 'FAILED' || p.status === 'CONTRADICTED').length;
  const totalCompleted = fulfilled + failed;
  
  // If there are no completed promises, default to 50
  const truthScore = totalCompleted === 0 
    ? 50.0 
    : (fulfilled / totalCompleted) * 100;

  await prisma.politician.update({
    where: { id: politicianId },
    data: { truthScore }
  });
}
