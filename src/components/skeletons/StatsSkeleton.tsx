export default function StatsSkeleton() {
  return (
    <div className="rounded border border-blue-200 bg-blue-50 p-3 text-sm">
      {/* Title */}
      <div className="mb-2 h-4 w-24 animate-pulse rounded bg-gray-200"></div>

      {/* Three stat rows - Small, Medium, Large */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex justify-between">
          <div className="h-4 w-12 animate-pulse rounded bg-gray-200"></div>
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
        </div>
      ))}
    </div>
  );
}
