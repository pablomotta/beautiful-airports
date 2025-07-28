"use client";

import ConfirmDialog from "@/components/ConfirmDialog";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import { Airport } from "../../generated/prisma";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function VisitedPage() {
  const { data: session, status } = useSession();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const {
    data: visited = [],
    isLoading,
    mutate,
  } = useSWR<Airport[]>(
    () => (session ? "/api/airport/visited" : null),
    fetcher
  );

  const clearVisited = async () => {
    await fetch("/api/airport/clear", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: session?.user.id }),
    });
    mutate();
    setShowClearConfirm(false);
  };

  const handleClearVisitedClick = () => {
    setShowClearConfirm(true);
  };

  if (status === "loading") return <p className="p-8 text-center">Loading…</p>;

  if (!session) {
    return (
      <div className="min-h-screen">
        <main className="max-w-7xl mx-auto h-screen">
          <div className="grid grid-cols-12 py-10 px-4 h-full">
            <div className="bg-white col-span-12 md:col-start-5 md:col-span-4 px-4 md:p-8 py-8 space-y-6 border-2 border-gray-200 rounded-lg h-full shadow-sm text-center">
              <p>Please sign in to view your visited airports.</p>
              <button
                onClick={() => signIn()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
              >
                Sign In
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-12 px-4 h-full">
          <div className="bg-white col-span-12 md:col-start-5 md:col-span-4 px-4 md:p-8 py-8 space-y-6 border-2 border-gray-200 rounded-lg h-full shadow-sm">
            <div className="w-full flex justify-center items-center mb-10">
              <h1 className="text-3xl font-bold">Visited Airports</h1>
            </div>

            <div className="flex items-start flex-col gap-4">
              <div className="flex gap-2 w-full">
                <button
                  onClick={handleClearVisitedClick}
                  className="w-1/2 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Clear Visited
                </button>
                <Link href="/" className="w-1/2">
                  <button className="w-full px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Get Random
                  </button>
                </Link>
              </div>

              {isLoading ? (
                <p>Loading…</p>
              ) : visited.length > 0 ? (
                <ul className="space-y-4 w-full">
                  {visited.map((a: Airport) => (
                    <li
                      key={a.id}
                      className="border p-4 rounded flex flex-col space-y-1 bg-gray-100 shadow-lg"
                    >
                      <div className="flex justify-between items-center">
                        <h2 className="font-semibold">
                          {a.airportName} ({a.airportCode})
                        </h2>
                        {a.icaoCode && (
                          <span className="text-sm text-gray-600">
                            ICAO: {a.icaoCode}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-700">
                        {a.city}, {a.country}
                      </div>
                      <div className="text-sm text-gray-500">
                        Size: {a.size}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">
                  You haven&apos;t marked any airports as visited yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showClearConfirm}
        title="Clear Visited Airports"
        message="Are you sure you want to clear all your visited airports? This action cannot be undone."
        confirmText="Clear All"
        cancelText="Cancel"
        onConfirm={clearVisited}
        onCancel={() => setShowClearConfirm(false)}
        isDangerous={true}
      />
    </>
  );
}
