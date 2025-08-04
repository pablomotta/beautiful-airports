// src/app/api/airport/visit/route.ts
import { PrismaClient } from "@/generated/prisma";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = Number(session.user.id);
  const { airportId } = await req.json();

  // Create or update visit record with current timestamp
  await prisma.visit.upsert({
    where: {
      userId_airportId: {
        userId: userId,
        airportId: Number(airportId),
      },
    },
    update: {
      visitedAt: new Date(), // Update timestamp if already visited
    },
    create: {
      userId: userId,
      airportId: Number(airportId),
      visitedAt: new Date(),
    },
  });

  return NextResponse.json({ success: true });
}
