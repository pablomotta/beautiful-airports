// src/app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, email, username, password } = await req.json();

    // 1. Only require email, username and password
    if (!email || !username || !password) {
      return NextResponse.json(
        { error: "email, username and password are all required" },
        { status: 400 }
      );
    }

    // 2. Check for existing user by email OR username
    const conflict = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });
    if (conflict) {
      return NextResponse.json(
        { error: "Email or username already in use" },
        { status: 409 }
      );
    }

    // 3. Hash password
    const hashed = await bcrypt.hash(password, 10);

    // 4. Create user, put name or empty string if missing
    const user = await prisma.user.create({
      data: {
        name: name ?? "",
        email,
        username,
        password: hashed,
      },
    });

    // 5. Return created user ID
    return NextResponse.json(
      { success: true, userId: user.id },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
