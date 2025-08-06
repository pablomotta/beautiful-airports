export default function PageSkeleton() {
  return (
    <main className="mx-auto max-w-7xl">
      <div className="grid h-full grid-cols-12 px-4">
        <div className="col-span-12 h-full space-y-6 rounded-lg border-2 border-gray-200 bg-white px-4 py-8 shadow-sm md:col-span-4 md:col-start-5 md:p-8">
          {/* Title */}
          <div className="mb-10 flex w-full items-center justify-center">
            <div className="h-9 w-48 animate-pulse rounded bg-gray-200"></div>
          </div>

          <div className="flex flex-col items-start gap-4">
            {/* Size dropdown */}
            <div className="flex items-center gap-2">
              <div className="h-6 w-10 animate-pulse rounded bg-gray-200"></div>
              <div className="h-8 w-20 animate-pulse rounded bg-gray-200"></div>
            </div>

            {/* Get Random button */}
            <div className="h-10 w-full animate-pulse rounded bg-gray-200"></div>

            {/* Runway size info */}
            <div className="w-full rounded border border-blue-200 bg-blue-50 p-3">
              <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
            </div>

            {/* Stats skeleton */}
            <div className="w-full rounded border border-blue-200 bg-blue-50 p-3">
              <div className="mb-2 h-4 w-24 animate-pulse rounded bg-gray-200"></div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 w-12 animate-pulse rounded bg-gray-200"></div>
                  <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
                </div>
              ))}
            </div>

            {/* Buttons row */}
            <div className="flex w-full gap-2">
              <div className="h-10 w-1/2 animate-pulse rounded bg-gray-200"></div>
              <div className="h-10 w-1/2 animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>

          {/* Airport card skeleton */}
          <div className="space-y-2 rounded border bg-gray-100 p-4 shadow-lg">
            <div className="h-7 w-3/4 animate-pulse rounded bg-gray-200"></div>
            <div className="h-5 w-32 animate-pulse rounded bg-gray-200"></div>
            <div className="h-5 w-1/2 animate-pulse rounded bg-gray-200"></div>
            <div className="h-5 w-20 animate-pulse rounded bg-gray-200"></div>
            <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
            <div className="h-4 w-4/5 animate-pulse rounded bg-gray-200"></div>
            <div className="mt-2 h-10 w-32 animate-pulse rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    </main>
  );
}
