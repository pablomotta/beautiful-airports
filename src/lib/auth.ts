// src/lib/auth.ts
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth/next";

export function getSession() {
  return getServerSession(authOptions);
}
