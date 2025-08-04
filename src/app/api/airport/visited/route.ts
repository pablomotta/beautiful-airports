// src/app/api/airport/visited/route.ts
import { PrismaClient } from "@/generated/prisma";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = Number(session.user.id);

  // Get visited airports ordered by most recent visit first
  const visits = await prisma.visit.findMany({
    where: { userId: userId },
    include: {
      airport: {
        select: {
          id: true,
          airportCode: true,
          icaoCode: true,
          airportName: true,
          city: true,
          country: true,
          size: true,
          description: true,
        },
      },
    },
    orderBy: { visitedAt: "desc" },
  });

  // Extract just the airport data
  const visitedAirports = visits.map((visit) => visit.airport);

  return NextResponse.json(visitedAirports);
}
