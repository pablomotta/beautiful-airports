// src/app/api/airport/random/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { getSession } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(req: Request) {
    const session = await getSession();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = Number(session.user.id);
    const { searchParams } = new URL(req.url);
    const size = searchParams.get("size") || "Small";

    const count = await prisma.airport.count({
        where: { size, visitedByUsers: { none: { id: userId } } },
    });
    if (!count) {
        return NextResponse.json({ error: "None left" }, { status: 404 });
    }
    const skip = Math.floor(Math.random() * count);
    const airport = await prisma.airport.findFirst({
        where: { size, visitedByUsers: { none: { id: userId } } },
        skip,
    });
    return NextResponse.json(airport);
}
