"use client";

import ConfirmDialog from "@/components/ConfirmDialog";
import AirportCardSkeleton from "@/components/skeletons/AirportCardSkeleton";
import PageSkeleton from "@/components/skeletons/PageSkeleton";
import StatsSkeleton from "@/components/skeletons/StatsSkeleton";
import { useAirportStore } from "@/store/airport-store";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [stats, setStats] = useState<Array<{
    size: string;
    total: number;
    visited: number;
    unvisited: number;
  }> | null>(null);

  // Zustand store
  const {
    airportSize,
    currentAirport,
    loading,
    sizeMessage,
    setAirportSizeAndFetch,
    fetchRandomAirport,
    markAirportAsVisited,
    clearVisitedAirports,
  } = useAirportStore();

  const userId = session?.user.id;

  // Fetch stats about airports
  const fetchStats = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await fetch("/api/airport/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  }, [userId]);

  // Auto-fetch airport on first load if none exists
  useEffect(() => {
    if (
      status === "authenticated" &&
      userId &&
      !currentAirport &&
      !loading.fetchingRandom
    ) {
      fetchRandomAirport(userId);
    }
  }, [
    status,
    userId,
    currentAirport,
    loading.fetchingRandom,
    fetchRandomAirport,
  ]);

  // Fetch stats when user is authenticated
  useEffect(() => {
    if (status === "authenticated" && userId) {
      fetchStats();
    }
  }, [status, userId, fetchStats]);

  // redirect if not signed in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    }
  }, [status, router]);

  // show a skeleton while NextAuth is checking
  if (status === "loading") {
    return <PageSkeleton />;
  }

  if (status === "unauthenticated") {
    return (
      <div className="mx-auto flex max-w-sm items-center justify-center rounded-lg border-2 border-gray-200 bg-white py-10 shadow-sm">
        <div className="text-center">
          <p className="mb-4 text-gray-600">
            You need to sign in to access this page.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to sign-in page...
          </p>
        </div>
      </div>
    );
  }

  // at this point status === 'authenticated' and session is non-null

  const markVisited = async () => {
    if (!currentAirport || !userId) return;
    await markAirportAsVisited(userId, currentAirport.id.toString());
    // Update stats
    fetchStats();
  };

  const clearVisits = async () => {
    if (!userId) return;
    await clearVisitedAirports(userId);
    // Update stats
    fetchStats();
    setShowClearConfirm(false);
  };

  const handleClearVisitsClick = () => {
    setShowClearConfirm(true);
  };

  return (
    <>
      <main className="mx-auto max-w-7xl">
        <div className="grid h-full grid-cols-12 px-4">
          <div className="col-span-12 h-full space-y-6 rounded-lg border-2 border-gray-200 bg-white px-4 py-8 shadow-sm md:col-span-4 md:col-start-5 md:p-8">
            <div className="mb-10 flex w-full items-center justify-center">
              <h1 className="text-3xl font-bold">Beautiful Airports</h1>
            </div>
            <div className="flex flex-col items-start gap-4">
              <label>
                <span className="font-medium">Runway Size:</span>
                <select
                  value={airportSize}
                  onChange={(e) => {
                    const newSize = e.target.value as
                      | "Small"
                      | "Medium"
                      | "Large";
                    if (userId) {
                      setAirportSizeAndFetch(userId, newSize);
                    }
                  }}
                  disabled={loading.fetchingRandom || !userId}
                  className="ml-2 rounded border p-1 disabled:opacity-50"
                >
                  <option>Small</option>
                  <option>Medium</option>
                  <option>Large</option>
                </select>
              </label>
              <button
                onClick={() => userId && fetchRandomAirport(userId)}
                disabled={loading.fetchingRandom || !userId}
                className="w-full rounded bg-blue-500 px-6 py-2 text-white disabled:opacity-50"
              >
                {loading.fetchingRandom ? "Loading..." : "Get Random"}
              </button>

              {sizeMessage && (
                <div className="rounded border border-yellow-400 bg-yellow-100 p-3 text-sm text-yellow-800">
                  {sizeMessage}
                </div>
              )}

              {/* Runway Size Information */}
              <div className="rounded border border-blue-200 bg-blue-50 p-3 text-sm">
                <div className="text-blue-700">
                  {airportSize === "Small" &&
                    "Light aircraft & regional planes • Runways under 800m (2625ft)"}
                  {airportSize === "Medium" &&
                    "Regional jets & turboprops • Runways 800-1800m (2625-5906ft)"}
                  {airportSize === "Large" &&
                    "Commercial jets & wide-body aircraft • Runways 1800m+ (5906ft+)"}
                </div>
              </div>

              {stats ? (
                <div className="rounded border border-blue-200 bg-blue-50 p-3 text-sm">
                  <div className="mb-2 font-medium">Airport Stats:</div>
                  {stats.map((stat) => (
                    <div key={stat.size} className="flex justify-between">
                      <span>{stat.size}:&nbsp;</span>
                      <span>
                        {stat.unvisited}/{stat.total} available
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <StatsSkeleton />
              )}

              <div className="flex w-full gap-2">
                <Link href="/visited" className="w-1/2">
                  <button className="w-full rounded bg-purple-500 px-6 py-2 text-white">
                    See visited
                  </button>
                </Link>
                <button
                  onClick={handleClearVisitsClick}
                  disabled={loading.clearingVisited}
                  className="w-1/2 rounded bg-red-500 px-6 py-2 text-white disabled:opacity-50"
                >
                  {loading.clearingVisited ? "Clearing..." : "Clear Visited"}
                </button>
              </div>
            </div>

            {currentAirport ? (
              <div className="space-y-2 rounded border bg-gray-100 p-4 shadow-lg">
                <h2 className="text-xl">
                  {currentAirport.airportName} ({currentAirport.airportCode})
                </h2>
                <p>
                  <strong>ICAO:</strong> {currentAirport.icaoCode ?? "N/A"}
                </p>
                <p>
                  {currentAirport.city}, {currentAirport.country}
                </p>
                <p>Size: {currentAirport.size}</p>
                {currentAirport.description && (
                  <p>{currentAirport.description}</p>
                )}
                <button
                  onClick={markVisited}
                  disabled={loading.markingVisited}
                  className="mt-2 rounded bg-green-500 px-6 py-2 text-white disabled:opacity-50"
                >
                  {loading.markingVisited ? "Marking..." : "Mark as Visited"}
                </button>
              </div>
            ) : loading.fetchingRandom ? (
              <AirportCardSkeleton />
            ) : (
              <p>
                Click &apos;Get Random&apos; to discover a beautiful airport!
              </p>
            )}
          </div>
        </div>
      </main>
      <ConfirmDialog
        isOpen={showClearConfirm}
        title="Clear Visited Airports"
        message="Are you sure you want to clear all your visited airports? This action cannot be undone."
        confirmText="Clear All"
        cancelText="Cancel"
        onConfirm={clearVisits}
        onCancel={() => setShowClearConfirm(false)}
        isDangerous={true}
      />
    </>
  );
}
