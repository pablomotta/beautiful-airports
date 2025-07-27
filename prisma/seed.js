// prisma/seed.js
const { PrismaClient } = require('../src/generated/prisma');
const airports = require('./airports.json');
const prisma = new PrismaClient();

async function main() {
    // 1) Ensure a default test user exists
    await prisma.user.upsert({
        where: { email: 'test@example.com' },
        update: {},
        create: {
            name: 'Test User',
            email: 'test@example.com',
            username: 'testuser',
            password: 'changeme', // in real app, hash this!
        },
    });

    // 2) Filter and transform airport data
    const validData = airports
        .filter(a => a.city && a.airportCode && a.airportName && a.size)
        .map(a => ({
            country: a.country || 'Unknown',
            city: a.city,
            airportCode: a.airportCode,
            icaoCode: a.icaoCode ?? null,
            airportName: a.airportName,
            runwayLengthMeters: a.runwayLengthMeters ?? null,
            size: a.size,
            description: a.description || '',
        }));

    // 3) Bulk insert airports, skipping duplicates
    await prisma.airport.createMany({
        data: validData,
        skipDuplicates: true,
    });

    console.log(`🌍 Seeded ${validData.length} airports`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
