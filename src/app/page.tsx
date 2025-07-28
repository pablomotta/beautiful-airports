"use client";

import ConfirmDialog from "@/components/ConfirmDialog";
import Spinner from "@/components/Spinner";
import { Airport } from "@/generated/prisma";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [size, setSize] = useState<"Small" | "Medium" | "Large">("Small");
  const [airport, setAirport] = useState<Airport | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasLoadedInitial, setHasLoadedInitial] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [sizeMessage, setSizeMessage] = useState<string | null>(null);

  const userId = session?.user.id;

  // Define the getRandomAirport function early so it can be used in useEffect
  const getRandomAirport = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setSizeMessage(null);
    try {
      const response = await fetch(
        `/api/airport/random?size=${size}&userId=${userId}`,
      );
      const data = await response.json();

      if (response.ok) {
        setAirport(data);
        // Check if we got a different size than requested
        if (data.size && data.size !== size) {
          setSizeMessage(
            `No unvisited ${size.toLowerCase()} airports available. Showing ${data.size.toLowerCase()} airport instead.`,
          );
        }
      } else {
        console.error("Failed to fetch random airport:", data.error);
        setAirport(null);
        if (data.error.includes("No unvisited airports")) {
          setSizeMessage(
            "You've visited all airports! Consider clearing your visited list to start over.",
          );
        }
      }
    } catch (error) {
      console.error("Failed to fetch random airport:", error);
    } finally {
      setLoading(false);
    }
  }, [userId, size]);

  // Load airport from localStorage on mount
  useEffect(() => {
    const savedAirport = localStorage.getItem("currentAirport");
    const savedSize = localStorage.getItem("selectedSize");

    if (savedAirport) {
      try {
        setAirport(JSON.parse(savedAirport));
        setHasLoadedInitial(true);
      } catch (error) {
        console.error("Failed to parse saved airport:", error);
      }
    }

    if (savedSize && ["Small", "Medium", "Large"].includes(savedSize)) {
      setSize(savedSize as "Small" | "Medium" | "Large");
    }
  }, []);

  // Auto-load airport on first authenticated session (if none exists)
  useEffect(() => {
    if (
      status === "authenticated" &&
      userId &&
      !airport &&
      !hasLoadedInitial &&
      !loading
    ) {
      getRandomAirport();
    }
  }, [status, userId, airport, hasLoadedInitial, loading, getRandomAirport]);

  // Save airport to localStorage when it changes
  useEffect(() => {
    if (airport) {
      localStorage.setItem("currentAirport", JSON.stringify(airport));
      setHasLoadedInitial(true);
    }
  }, [airport]);

  // Save size preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("selectedSize", size);
  }, [size]);

  // redirect if not signed in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    }
  }, [status, router]);

  // show a spinner or nothing while NextAuth is checking
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Spinner />
        </div>
      </div>
    );
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
    if (!airport) return;
    await fetch("/api/airport/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, airportId: airport.id }),
    });
    // Get a new random airport after marking one as visited
    getRandomAirport();
  };

  const clearVisits = async () => {
    await fetch("/api/airport/clear", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    // Get a new random airport after clearing visits
    getRandomAirport();
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
                <span className="font-medium">Size:</span>
                <select
                  value={size}
                  onChange={(e) => {
                    setSize(e.target.value as "Small" | "Medium" | "Large");
                    setSizeMessage(null); // Clear message when size changes
                  }}
                  className="ml-2 rounded border p-1"
                >
                  <option>Small</option>
                  <option>Medium</option>
                  <option>Large</option>
                </select>
              </label>
              <button
                onClick={getRandomAirport}
                disabled={loading}
                className="w-full rounded bg-blue-500 px-6 py-2 text-white disabled:opacity-50"
              >
                {loading ? "Loading..." : "Get Random"}
              </button>

              {sizeMessage && (
                <div className="rounded border border-yellow-400 bg-yellow-100 p-3 text-sm text-yellow-800">
                  {sizeMessage}
                </div>
              )}

              <div className="flex w-full gap-2">
                <Link href="/visited" className="w-1/2">
                  <button className="w-full rounded bg-purple-500 px-6 py-2 text-white">
                    See visited
                  </button>
                </Link>
                <button
                  onClick={handleClearVisitsClick}
                  className="w-1/2 rounded bg-red-500 px-6 py-2 text-white"
                >
                  Clear Visited
                </button>
              </div>
            </div>

            {airport ? (
              <div className="space-y-2 rounded border bg-gray-100 p-4 shadow-lg">
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
                  className="mt-2 rounded bg-green-500 px-6 py-2 text-white"
                >
                  Mark as Visited
                </button>
              </div>
            ) : (
              <p>
                {loading
                  ? "Loading..."
                  : "Click 'Get Random' to discover a beautiful airport!"}
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
