export default function AirportCardSkeleton() {
  return (
    <div className="space-y-2 rounded border bg-gray-100 p-4 shadow-lg">
      {/* Airport name and code */}
      <div className="h-7 w-3/4 animate-pulse rounded bg-gray-200"></div>

      {/* ICAO code */}
      <div className="h-5 w-32 animate-pulse rounded bg-gray-200"></div>

      {/* City, country */}
      <div className="h-5 w-1/2 animate-pulse rounded bg-gray-200"></div>

      {/* Size */}
      <div className="h-5 w-20 animate-pulse rounded bg-gray-200"></div>

      {/* Description - optional, so 2 lines with different widths */}
      <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
      <div className="h-4 w-4/5 animate-pulse rounded bg-gray-200"></div>

      {/* Button */}
      <div className="mt-2 h-10 w-32 animate-pulse rounded bg-gray-200"></div>
    </div>
  );
}
