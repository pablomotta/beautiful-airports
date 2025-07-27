'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });
        if (res?.error) {
            setError(res.error);
        } else {
            router.push('/');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow bg-white">
            <div className="w-full flex justify-center items-center mb-10">
                <h1 className="text-3xl font-bold">Beautiful Airports</h1>
            </div>
            <h1 className="text-2xl font-bold mb-4">Sign In</h1>
            {error && <p className="mb-2 text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div>
                    <label className="block mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        className="w-full p-2 border rounded"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 text-white rounded"
                >
                    Sign In
                </button>
            </form>
        </div>
    );
}
