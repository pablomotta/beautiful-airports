// src/app/auth/signup/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
    const router = useRouter();
    const [name, setName] = useState('');            // ← new optional field
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const PASSWORD_REGEX =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{10,}$/;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!PASSWORD_REGEX.test(password)) {
            setError(
                'Password must be at least 10 characters and include uppercase, lowercase, number & symbol.'
            );
            return;
        }
        if (password !== confirm) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name || null, email, username, password }),
        });
        const body = await res.json();
        setLoading(false);

        if (!res.ok) {
            setError(body.error || 'Something went wrong.');
        } else {
            router.replace('/auth/signin');
        }
    };

    return (
        <main className="max-w-7xl mx-auto">
            <div className="grid grid-cols-12 py-10 px-4 h-full">
                <div className="bg-white col-span-12 md:col-start-5 md:col-span-4 px-4 md:p-8 py-8 space-y-6 border-2 border-gray-200 rounded-lg h-full shadow-sm">
                    <h1 className="text-3xl font-bold text-center mb-6">
                        Sign Up
                    </h1>

                    {error && (
                        <div className="text-red-600 text-center">{error}</div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Optional Name */}
                        <div>
                            <label className="block mb-1 font-medium">Name (optional)</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full p-2 border rounded"
                                placeholder="Your full name"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                required
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={confirm}
                                onChange={e => setConfirm(e.target.value)}
                                required
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 bg-green-600 text-white rounded disabled:opacity-50"
                        >
                            {loading ? 'Signing Up…' : 'Sign Up'}
                        </button>
                    </form>

                    <p className="text-center text-sm">
                        Already have an account?{' '}
                        <a
                            href="/auth/signin"
                            className="text-blue-600 hover:underline"
                        >
                            Sign in!
                        </a>
                    </p>
                </div>
            </div>
        </main>
    );
}
