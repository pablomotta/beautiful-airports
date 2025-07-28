// src/app/api/airport/random/route.ts
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
  const { searchParams } = new URL(req.url);
  const requestedSize = searchParams.get("size") || "Small";

  // Try the requested size first
  let count = await prisma.airport.count({
    where: { size: requestedSize, visitedByUsers: { none: { id: userId } } },
  });

  let size = requestedSize;

  // If no airports available in requested size, try other sizes
  if (!count) {
    const sizes = ["Small", "Medium", "Large"];
    for (const fallbackSize of sizes) {
      if (fallbackSize !== requestedSize) {
        count = await prisma.airport.count({
          where: {
            size: fallbackSize,
            visitedByUsers: { none: { id: userId } },
          },
        });
        if (count > 0) {
          size = fallbackSize;
          break;
        }
      }
    }
  }

  // If still no airports found, return 404
  if (!count) {
    return NextResponse.json(
      { error: "No unvisited airports available in any size" },
      { status: 404 }
    );
  }

  const skip = Math.floor(Math.random() * count);
  const airport = await prisma.airport.findFirst({
    where: { size, visitedByUsers: { none: { id: userId } } },
    skip,
  });

  return NextResponse.json(airport);
}
