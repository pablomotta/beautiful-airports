// src/app/auth/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

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

  return (
    <main className="max-w-7xl mx-auto">
      <div className="grid grid-cols-12 py-10 px-4 h-full">
        <div
          className="bg-white col-span-12 md:col-start-5 md:col-span-4
                        px-4 md:p-8 py-8 space-y-6 border-2 border-gray-200
                        rounded-lg h-full shadow-sm"
        >
          <h1 className="text-3xl font-bold text-center mb-6">
            Create your account
          </h1>

          {error && <div className="text-red-600 text-center">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Name (optional)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 border rounded"
                minLength={10}
                placeholder="Min 10 chars, mixed case, symbol & number"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full p-2 border rounded"
                minLength={10}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-green-600 text-white rounded disabled:opacity-50"
            >
              {loading ? "Creating Account…" : "Sign Up"}
            </button>
          </form>

          <p className="text-center mt-4">
            Already have an account?{" "}
            <a href="/auth/signin" className="text-blue-600 hover:underline">
              Sign in!
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
