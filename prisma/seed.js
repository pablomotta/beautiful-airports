// prisma/seed.js

import bcrypt from "bcrypt";
import { readFileSync } from "fs";
import { PrismaClient } from "../src/generated/prisma/index.js";

const airports = JSON.parse(readFileSync("./prisma/airports.json", "utf-8"));

const prisma = new PrismaClient();

async function main() {
  // 1) Hash and upsert a default test user
  const hashedPassword = await bcrypt.hash("changeme", 10);
  await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      name: "Test User",
      email: "test@example.com",
      username: "testuser",
      password: hashedPassword,
    },
  });

  // 2) Filter and transform airport data
  const validData = airports
    .filter((a) => a.city && a.airportCode && a.airportName && a.size)
    .map((a) => ({
      country: a.country || "Unknown",
      city: a.city,
      airportCode: a.airportCode,
      icaoCode: a.icaoCode ?? null,
      airportName: a.airportName,
      runwayLengthMeters: a.runwayLengthMeters ?? null,
      size: a.size,
      description: a.description || "",
    }));

  // 3) Bulk insert airports, skipping duplicates
  const result = await prisma.airport.createMany({
    data: validData,
    skipDuplicates: true,
  });

  console.log(`🌍 Seeded ${result.count} airports`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
