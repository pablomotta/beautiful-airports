export default function VisitedAirportSkeleton() {
  return (
    <li className="flex flex-col space-y-1 rounded border bg-gray-100 p-4 shadow-lg">
      <div className="flex items-center justify-between">
        {/* Airport name and code */}
        <div className="h-6 w-3/5 animate-pulse rounded bg-gray-200"></div>
        {/* ICAO code */}
        <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
      </div>
      {/* City, country */}
      <div className="h-4 w-2/5 animate-pulse rounded bg-gray-200"></div>
      {/* Size */}
      <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
    </li>
  );
}
