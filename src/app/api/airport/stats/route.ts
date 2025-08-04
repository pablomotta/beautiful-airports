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

  // Get visited airport IDs for this user
  const visitedAirportIds = await prisma.visit.findMany({
    where: { userId: userId },
    select: { airportId: true },
  });
  const visitedIds = visitedAirportIds.map((v) => v.airportId);

  // Get counts for each size
  const sizes = ["Small", "Medium", "Large"];
  const stats = await Promise.all(
    sizes.map(async (size) => {
      const total = await prisma.airport.count({
        where: { size },
      });
      const visited = await prisma.airport.count({
        where: {
          size,
          id: { in: visitedIds },
        },
      });
      const unvisited = total - visited;

      return {
        size,
        total,
        visited,
        unvisited,
      };
    }),
  );

  return NextResponse.json(stats);
}
