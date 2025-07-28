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

  const userId = session?.user.id;

  // Define the getRandomAirport function early so it can be used in useEffect
  const getRandomAirport = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await fetch(
        `/api/airport/random?size=${size}&userId=${userId}`
      );
      const data = await response.json();
      setAirport(data);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner />
          <p className="mt-4 text-gray-600">Loading session...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center bg-white max-w-sm mx-auto border-2 border-gray-200 rounded-lg shadow-sm  py-10">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
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
      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-12 px-4 h-full">
          <div className="bg-white col-span-12 md:col-start-5 md:col-span-4 px-4 md:p-8 py-8 space-y-6 border-2 border-gray-200 rounded-lg h-full shadow-sm">
            <div className="w-full flex justify-center items-center mb-10">
              <h1 className="text-3xl font-bold">Beautiful Airports</h1>
            </div>
            <div className="flex items-start flex-col gap-4">
              <label>
                <span className="font-medium">Size:</span>
                <select
                  value={size}
                  onChange={(e) =>
                    setSize(e.target.value as "Small" | "Medium" | "Large")
                  }
                  className="ml-2 p-1 border rounded"
                >
                  <option>Small</option>
                  <option>Medium</option>
                  <option>Large</option>
                </select>
              </label>
              <button
                onClick={getRandomAirport}
                disabled={loading}
                className="w-full px-6 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                {loading ? "Loading..." : "Get Random"}
              </button>
              <div className="flex gap-2 w-full">
                <Link href="/visited" className="w-1/2">
                  <button className="w-full px-6 py-2 bg-purple-500 text-white rounded">
                    See visited
                  </button>
                </Link>
                <button
                  onClick={handleClearVisitsClick}
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
