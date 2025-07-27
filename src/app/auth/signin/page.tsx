// src/app/auth/signin/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

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

    return (
        <main className="max-w-7xl mx-auto">
            <div className="grid grid-cols-12 py-10 px-4 h-full">
                <div className="bg-white col-span-12 md:col-start-5 md:col-span-4 
                        px-4 md:p-8 py-8 space-y-6 border-2 border-gray-200 
                        rounded-lg h-full shadow-sm">
                    <h1 className="text-3xl font-bold text-center mb-6">
                        Beautiful Airports
                    </h1>
                    <div className="text-center text-gray-600 mb-6 space-y-2">
                        <p className="text-lg">
                            Discover stunning airports in beautiful cities around the world for your next flight simulation adventure.
                        </p>
                        <p className="text-sm">
                            Track visited airports, get personalized recommendations, and never run out of amazing destinations to explore in your favorite simulator.
                        </p>
                    </div>
                    {error && (
                        <div className="text-red-600 text-center">{error}</div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block mb-1 font-medium">
                                Email or Username
                            </label>
                            <input
                                type="text"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
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
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                        >
                            {loading ? "Signing In…" : "Sign In"}
                        </button>
                    </form>
                    <p className="text-center mt-4">
                        Don’t have an account?{" "}
                        <a href="/auth/signup" className="text-blue-600 hover:underline">
                            Sign up!
                        </a>
                    </p>
                </div>
            </div>
        </main>
    );
}
