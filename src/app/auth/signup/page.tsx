// src/app/auth/signup/page.tsx
"use client";

import AuthFormSkeleton from "@/components/skeletons/AuthFormSkeleton";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    // 1) Create account
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, username, password }),
    });
    const payload = await res.json();

    if (!res.ok) {
      setError(payload.error || "Signup failed");
      setLoading(false);
      return;
    }

    // 2) Auto-sign-in
    const signInResult = await signIn("credentials", {
      redirect: false,
      identifier: email,
      password,
    });

    setLoading(false);
    if (signInResult?.error) {
      setError(signInResult.error);
    } else {
      router.replace("/");
    }
  };

  if (loading) {
    return <AuthFormSkeleton isSignUp={true} />;
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="grid h-full grid-cols-12 px-4">
        <div className="col-span-12 h-full space-y-6 rounded-lg border-2 border-gray-200 bg-white px-4 py-8 shadow-sm md:col-span-4 md:col-start-5 md:p-8">
          <h1 className="mb-6 text-center text-3xl font-bold">
            Create your account
          </h1>

          {error && <div className="text-center text-red-600">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block font-medium">Name (optional)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded border p-2"
              />
            </div>

            <div>
              <label className="mb-1 block font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded border p-2"
              />
            </div>

            <div>
              <label className="mb-1 block font-medium">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                minLength={10}
                placeholder="Min 10 chars, mixed case, symbol & number"
              />
            </div>

            <div>
              <label className="mb-1 block font-medium">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full rounded border p-2"
                minLength={10}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded bg-green-600 py-2 text-white disabled:opacity-50"
            >
              {loading ? "Creating Account…" : "Sign Up"}
            </button>
          </form>

          <p className="mt-4 text-center">
            Already have an account?{" "}
            <a href="/auth/signin" className="text-blue-600 hover:underline">
              Sign in!
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
