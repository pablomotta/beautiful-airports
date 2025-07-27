// src/app/api/airport/clear/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { userId } = await request.json();
  console.log("CLEAR called for userId=", userId);

  await prisma.user.update({
    where: { id: Number(userId) },
    data: {
      visitedAirports: { set: [] },
    },
  });

  return NextResponse.json({ success: true });
}
