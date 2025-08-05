import { Airport } from "@/generated/prisma";
import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";

export type AirportSize = "Small" | "Medium" | "Large";

interface LoadingStates {
  fetchingRandom: boolean;
  fetchingVisited: boolean;
  clearingVisited: boolean;
  markingVisited: boolean;
}

interface AirportStore {
  // State
  airportSize: AirportSize;
  currentAirport: Airport | null;
  loading: LoadingStates;
  sizeMessage: string | null;

  // Actions
  setAirportSize: (size: AirportSize) => void;
  setCurrentAirport: (airport: Airport | null) => void;
  setLoading: (key: keyof LoadingStates, value: boolean) => void;
  setSizeMessage: (message: string | null) => void;

  // Complex actions
  fetchRandomAirport: (
    userId: string,
    requestedSize?: AirportSize,
  ) => Promise<void>;
  setAirportSizeAndFetch: (userId: string, size: AirportSize) => Promise<void>;
  markAirportAsVisited: (userId: string, airportId: string) => Promise<void>;
  clearVisitedAirports: (userId: string) => Promise<void>;
}

export const useAirportStore = create<AirportStore>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        // Initial state
        airportSize:
          (typeof window !== "undefined"
            ? (localStorage.getItem("currentSize") as AirportSize)
            : null) || "Large",
        currentAirport: null,
        loading: {
          fetchingRandom: false,
          fetchingVisited: false,
          clearingVisited: false,
          markingVisited: false,
        },
        sizeMessage: null,

        // Basic setters
        setAirportSize: (size) => {
          set({ airportSize: size });
          // Also update localStorage with currentSize key
          localStorage.setItem("currentSize", size);
        },
        setCurrentAirport: (airport) => set({ currentAirport: airport }),
        setLoading: (key, value) =>
          set((state) => ({
            loading: { ...state.loading, [key]: value },
          })),
        setSizeMessage: (message) => set({ sizeMessage: message }),

        // Complex actions
        fetchRandomAirport: async (
          userId: string,
          requestedSize?: AirportSize,
        ) => {
          const { airportSize, setLoading, setSizeMessage, setCurrentAirport } =
            get();
          const sizeToUse = requestedSize || airportSize;

          setLoading("fetchingRandom", true);
          setSizeMessage(null);

          try {
            const response = await fetch(
              `/api/airport/random?size=${sizeToUse}&userId=${userId}`,
            );
            const data = await response.json();

            if (response.ok) {
              setCurrentAirport(data);

              // Check if we got a different size than requested using the API metadata
              if (data.wasFallback) {
                setSizeMessage(
                  `No unvisited ${data.requestedSize.toLowerCase()} airports available. Showing ${data.actualSize.toLowerCase()} airport instead.`,
                );
              } else {
                setSizeMessage(null); // Clear message if we got the requested size
              }
            } else {
              console.error("Failed to fetch random airport:", data.error);
              setCurrentAirport(null);
              if (data.error.includes("No unvisited airports")) {
                setSizeMessage(
                  "You've visited all airports! Consider clearing your visited list to start over.",
                );
              }
            }
          } catch (error) {
            console.error("Failed to fetch random airport:", error);
          } finally {
            setLoading("fetchingRandom", false);
          }
        },

        setAirportSizeAndFetch: async (userId: string, size: AirportSize) => {
          const { setAirportSize, fetchRandomAirport, setSizeMessage } = get();

          // Set the new size first
          setAirportSize(size);
          setSizeMessage(null); // Clear any existing size message

          // Then fetch a new airport with that size
          await fetchRandomAirport(userId, size);
        },

        markAirportAsVisited: async (userId: string, airportId: string) => {
          const { setLoading, fetchRandomAirport } = get();

          setLoading("markingVisited", true);

          try {
            await fetch("/api/airport/visit", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId, airportId }),
            });

            // Get a new random airport after marking one as visited
            await fetchRandomAirport(userId);
          } catch (error) {
            console.error("Failed to mark airport as visited:", error);
          } finally {
            setLoading("markingVisited", false);
          }
        },

        clearVisitedAirports: async (userId: string) => {
          const { setLoading, fetchRandomAirport } = get();

          setLoading("clearingVisited", true);

          try {
            await fetch("/api/airport/clear", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId }),
            });

            // Get a new random airport after clearing visits
            await fetchRandomAirport(userId);
          } catch (error) {
            console.error("Failed to clear visited airports:", error);
          } finally {
            setLoading("clearingVisited", false);
          }
        },
      }),
      {
        name: "airport-storage",
        partialize: (state) => ({
          currentAirport: state.currentAirport,
          airportSize: state.airportSize,
        }),
      },
    ),
  ),
);
