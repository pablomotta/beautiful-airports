// src/app/api/airport/visit/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { userId, airportId } = await request.json();

        // Mark this airport as visited for the given user
        await prisma.user.update({
            where: { id: Number(userId) },
            data: {
                visitedAirports: {
                    connect: { id: Number(airportId) },
                },
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Visit error:', error);
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
}
