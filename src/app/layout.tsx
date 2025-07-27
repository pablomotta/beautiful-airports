import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Header from "@/components/Header";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Beautiful Airports",
  description: "Discover stunning approaches in MSFS 2024",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-gradient-to-br from-blue-600 via-blue-200 to-blue-500 min-h-screen">
        <Providers>
          <Header />
          <main className="py-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
