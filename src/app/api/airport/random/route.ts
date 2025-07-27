// src/app/api/airport/random/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const size = searchParams.get('size') || 'Small';
    const userId = Number(searchParams.get('userId'));

    // Count how many unvisited airports remain
    const unvisitedCount = await prisma.airport.count({
        where: {
            size,
            visitedByUsers: { none: { id: userId } },
        },
    });

    if (unvisitedCount === 0) {
        return NextResponse.json(
            { error: 'No more airports available' },
            { status: 404 }
        );
    }

    // Pick random offset and fetch that airport
    const randomIndex = Math.floor(Math.random() * unvisitedCount);
    const airport = await prisma.airport.findFirst({
        where: {
            size,
            visitedByUsers: { none: { id: userId } },
        },
        skip: randomIndex,
    });

    return NextResponse.json(airport);
}
