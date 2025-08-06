"use client";

import ConfirmDialog from "@/components/ConfirmDialog";
import VisitedListSkeleton from "@/components/skeletons/VisitedListSkeleton";
import { useAirportStore } from "@/store/airport-store";
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
    fetcher,
  );

  // Get loading state from store
  const { loading, clearVisitedAirports } = useAirportStore();

  const clearVisited = async () => {
    if (!session?.user.id) return;
    await clearVisitedAirports(session.user.id);
    mutate(); // Refresh the visited list
    setShowClearConfirm(false);
  };

  const handleClearVisitedClick = () => {
    setShowClearConfirm(true);
  };

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="grid h-full grid-cols-12 px-4">
          <div className="col-span-12 h-full space-y-6 rounded-lg border-2 border-gray-200 bg-white px-4 py-8 shadow-sm md:col-span-4 md:col-start-5 md:p-8">
            <div className="mb-10 flex w-full items-center justify-center">
              <div className="h-9 w-48 animate-pulse rounded bg-gray-200"></div>
            </div>
            <div className="flex flex-col items-start gap-4">
              <div className="flex w-full gap-2">
                <div className="h-10 w-1/2 animate-pulse rounded bg-gray-200"></div>
                <div className="h-10 w-1/2 animate-pulse rounded bg-gray-200"></div>
              </div>
              <VisitedListSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      // visited logged out page
      <div className="mx-auto max-w-7xl">
        <div className="grid h-full grid-cols-12 px-4">
          <div className="col-span-12 h-full space-y-6 rounded-lg border-2 border-gray-200 bg-white px-4 py-8 text-center shadow-sm md:col-span-4 md:col-start-5 md:p-8">
            <p>Please sign in to view your visited airports.</p>
            <button
              onClick={() => signIn()}
              className="mt-4 rounded bg-blue-600 px-4 py-2 text-white"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-7xl">
        <div className="grid h-full grid-cols-12 px-4">
          <div className="col-span-12 h-full space-y-6 rounded-lg border-2 border-gray-200 bg-white px-4 py-8 shadow-sm md:col-span-4 md:col-start-5 md:p-8">
            <div className="mb-10 flex w-full items-center justify-center">
              <h1 className="text-3xl font-bold">Visited Airports</h1>
            </div>

            <div className="flex flex-col items-start gap-4">
              <div className="flex w-full gap-2">
                <button
                  onClick={handleClearVisitedClick}
                  disabled={loading.clearingVisited}
                  className="w-1/2 rounded bg-red-500 px-6 py-2 text-white hover:bg-red-600 disabled:opacity-50"
                >
                  {loading.clearingVisited ? "Clearing..." : "Clear Visited"}
                </button>
                <Link href="/" className="w-1/2">
                  <button className="w-full rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600">
                    Get Random
                  </button>
                </Link>
              </div>

              {isLoading ? (
                <VisitedListSkeleton />
              ) : visited.length > 0 ? (
                <ul className="w-full space-y-4">
                  {visited.map((a: Airport) => (
                    <li
                      key={a.id}
                      className="flex flex-col space-y-1 rounded border bg-gray-100 p-4 shadow-lg"
                    >
                      <div className="flex items-center justify-between">
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
