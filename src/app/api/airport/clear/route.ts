// src/app/api/airport/clear/route.ts
import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { userId } = await request.json();
  console.log("CLEAR called for userId=", userId);

  // Delete all visit records for this user
  await prisma.visit.deleteMany({
    where: { userId: Number(userId) },
  });

  return NextResponse.json({ success: true });
}
