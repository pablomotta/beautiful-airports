"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Spinner from "@/components/Spinner";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function HomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [size, setSize] = useState<"Small" | "Medium" | "Large">("Small");

  const userId = (session?.user as any)?.id;

  const { data: airport, mutate } = useSWR(
    userId ? `/api/airport/random?size=${size}&userId=${userId}` : null,
    fetcher
  );

  // redirect if not signed in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    }
  }, [status, router]);

  // show a spinner or nothing while NextAuth is checking
  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // at this point status === 'authenticated' and session is non-null

  const markVisited = async () => {
    await fetch("/api/airport/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, airportId: airport.id }),
    });
    mutate();
  };

  const clearVisits = async () => {
    await fetch("/api/airport/clear", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    mutate();
  };

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto h-screen">
        <div className="grid grid-cols-12 py-10 px-4 h-full">
          <div className="bg-white col-span-12 md:col-start-5 md:col-span-4 px-4 md:p-8 py-8 space-y-6 border-2 border-gray-200 rounded-lg h-full shadow-sm">
            <div className="w-full flex justify-center items-center mb-10">
              <h1 className="text-3xl font-bold">Beautiful Airports</h1>
            </div>
            <div className="flex items-start flex-col gap-4">
              <label>
                <span className="font-medium">Size:</span>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value as any)}
                  className="ml-2 p-1 border rounded"
                >
                  <option>Small</option>
                  <option>Medium</option>
                  <option>Large</option>
                </select>
              </label>
              <button
                onClick={() => mutate()}
                className="w-full px-6 py-2 bg-blue-500 text-white rounded"
              >
                Get Random
              </button>
              <div className="flex gap-2 w-full">
                <Link href="/visited" className="w-1/2">
                  <button className="w-full px-6 py-2 bg-purple-500 text-white rounded">
                    See visited
                  </button>
                </Link>
                <button
                  onClick={clearVisits}
                  className="w-1/2 px-6 py-2 bg-red-500 text-white rounded"
                >
                  Clear Visited
                </button>
              </div>
            </div>

            {airport ? (
              <div className="border p-4 rounded space-y-2 shadow-lg bg-gray-100">
                <h2 className="text-xl">
                  {airport.airportName} ({airport.airportCode})
                </h2>
                <p>
                  <strong>ICAO:</strong> {airport.icaoCode ?? "N/A"}
                </p>
                <p>
                  {airport.city}, {airport.country}
                </p>
                <p>Size: {airport.size}</p>
                {airport.description && <p>{airport.description}</p>}
                <button
                  onClick={markVisited}
                  className="mt-2 px-6 py-2 bg-green-500 text-white rounded"
                >
                  Mark as Visited
                </button>
              </div>
            ) : (
              <p>Loading or no airports available...</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
