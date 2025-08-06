interface AuthFormSkeletonProps {
  isSignUp?: boolean;
}

export default function AuthFormSkeleton({
  isSignUp = false,
}: AuthFormSkeletonProps) {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="grid h-full grid-cols-12 px-4">
        <div className="col-span-12 h-full space-y-6 rounded-lg border-2 border-gray-200 bg-white px-4 py-8 shadow-sm md:col-span-4 md:col-start-5 md:p-8">
          {/* Title */}
          <div className="mb-6 flex justify-center">
            <div className="h-9 w-64 animate-pulse rounded bg-gray-200"></div>
          </div>

          {/* Description for sign in page */}
          {!isSignUp && (
            <div className="mb-6 space-y-2 text-center">
              <div className="mx-auto h-6 w-full animate-pulse rounded bg-gray-200"></div>
              <div className="mx-auto h-6 w-4/5 animate-pulse rounded bg-gray-200"></div>
              <div className="mx-auto h-4 w-full animate-pulse rounded bg-gray-200"></div>
              <div className="mx-auto h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
            </div>
          )}

          {/* Form fields */}
          <div className="space-y-4">
            {isSignUp && (
              <div>
                <div className="mb-1 h-5 w-32 animate-pulse rounded bg-gray-200"></div>
                <div className="h-10 w-full animate-pulse rounded bg-gray-200"></div>
              </div>
            )}
            <div>
              <div className="mb-1 h-5 w-32 animate-pulse rounded bg-gray-200"></div>
              <div className="h-10 w-full animate-pulse rounded bg-gray-200"></div>
            </div>
            {isSignUp && (
              <div>
                <div className="mb-1 h-5 w-24 animate-pulse rounded bg-gray-200"></div>
                <div className="h-10 w-full animate-pulse rounded bg-gray-200"></div>
              </div>
            )}
            <div>
              <div className="mb-1 h-5 w-20 animate-pulse rounded bg-gray-200"></div>
              <div className="h-10 w-full animate-pulse rounded bg-gray-200"></div>
            </div>
            {isSignUp && (
              <div>
                <div className="mb-1 h-5 w-32 animate-pulse rounded bg-gray-200"></div>
                <div className="h-10 w-full animate-pulse rounded bg-gray-200"></div>
              </div>
            )}

            {/* Submit button */}
            <div className="h-10 w-full animate-pulse rounded bg-gray-200"></div>
          </div>

          {/* Bottom link */}
          <div className="mt-4 flex justify-center">
            <div className="h-5 w-48 animate-pulse rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
