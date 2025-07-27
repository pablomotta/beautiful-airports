// src/app/api/airport/visited/route.ts
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

    // load the user’s visitedAirports
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            visitedAirports: {
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
                orderBy: { airportName: "asc" },
            },
        },
    });

    return NextResponse.json(user?.visitedAirports ?? []);
}
