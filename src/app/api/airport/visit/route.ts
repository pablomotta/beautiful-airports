// src/app/api/airport/visit/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { getSession } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = Number(session.user.id);
  const { airportId } = await req.json();

  await prisma.user.update({
    where: { id: userId },
    data: { visitedAirports: { connect: { id: Number(airportId) } } },
  });
  return NextResponse.json({ success: true });
}
