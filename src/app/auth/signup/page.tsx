'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUpPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (password !== confirm) {
            setError("Passwords don't match");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, username, email, password }),
            });
            const body = await res.json();
            if (!res.ok) {
                setError(body.error || 'Sign up failed');
                setLoading(false);
                return;
            }
            // auto-sign-in
            const signInRes = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });
            setLoading(false);
            if (signInRes?.error) {
                setError(signInRes.error);
            } else {
                router.replace('/');
            }
        } catch (err) {
            console.error(err);
            setError('Unexpected error');
            setLoading(false);
        }
    };

    return (
        <main className="max-w-7xl mx-auto">
            <div className="grid grid-cols-12 py-10 px-4 h-full">
                <div className="bg-white col-span-12 md:col-start-5 md:col-span-4 px-4 md:p-8 py-8 space-y-6 border-2 border-gray-200 rounded-lg h-full shadow-sm">
                    <h1 className="text-3xl font-bold text-center mb-6">
                        Create an Account
                    </h1>

                    {error && (
                        <div className="text-red-600 text-center">{error}</div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block mb-1 font-medium">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
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
                            <label className="block mb-1 font-medium">Confirm Password</label>
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
                            {loading ? 'Creating…' : 'Sign Up'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link href="/auth/signin" className="text-blue-600 hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
