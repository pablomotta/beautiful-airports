// src/app/auth/signin/page.tsx
"use client";

import AuthFormSkeleton from "@/components/skeletons/AuthFormSkeleton";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      identifier,
      password,
    });

    setLoading(false);
    if (res?.error) {
      setError(res.error);
    } else {
      router.replace("/");
    }
  };

  if (loading) {
    return <AuthFormSkeleton />;
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="grid h-full grid-cols-12 px-4">
        <div className="col-span-12 h-full space-y-6 rounded-lg border-2 border-gray-200 bg-white px-4 py-8 shadow-sm md:col-span-4 md:col-start-5 md:p-8">
          <h1 className="mb-6 text-center text-3xl font-bold">
            Beautiful Airports
          </h1>
          <div className="mb-6 space-y-2 text-center text-gray-600">
            <p className="text-lg">
              Discover stunning airports in beautiful cities around the world
              for your next flight simulation adventure.
            </p>
            <p className="text-sm">
              Track visited airports, get personalized recommendations, and
              never run out of amazing destinations to explore in your favorite
              simulator.
            </p>
          </div>
          {error && <div className="text-center text-red-600">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block font-medium">
                Email or Username
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="w-full rounded border p-2"
              />
            </div>
            <div>
              <label className="mb-1 block font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded border p-2"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded bg-blue-600 py-2 text-white disabled:opacity-50"
            >
              {loading ? "Signing In…" : "Sign In"}
            </button>
          </form>
          <p className="mt-4 text-center">
            Don&apos;t have an account?{" "}
            <a href="/auth/signup" className="text-blue-600 hover:underline">
              Sign up!
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
