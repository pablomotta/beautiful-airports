'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { useSession, signIn } from 'next-auth/react';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function VisitedPage() {
    const { data: session, status } = useSession();
    const {
        data: visited = [],
        isLoading,
        mutate,
    } = useSWR(
        () => (session ? '/api/airport/visited' : null),
        fetcher
    );

    const clearVisited = async () => {
        await fetch('/api/airport/clear', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: (session?.user as any)?.id }),
        });
        mutate();
    };

    if (status === 'loading') return <p className="p-8 text-center">Loading…</p>;

    if (!session) {
        return (
            <div className="min-h-screen">
                <main className="max-w-7xl mx-auto h-screen">
                    <div className="grid grid-cols-12 py-10 px-4 h-full">
                        <div className="bg-white col-span-12 md:col-start-5 md:col-span-4 px-4 md:p-8 py-8 space-y-6 border-2 border-gray-200 rounded-lg h-full shadow-sm text-center">
                            <p>Please sign in to view your visited airports.</p>
                            <button
                                onClick={() => signIn()}
                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                            >
                                Sign In
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <main className="max-w-7xl mx-auto">
                <div className="grid grid-cols-12 py-10 px-4 h-full">
                    <div className="bg-white col-span-12 md:col-start-4 md:col-span-6 px-4 md:p-8 py-8 space-y-6 border-2 border-gray-200 rounded-lg h-full shadow-sm overflow-y-auto">
                        <div className="flex flex-col justify-between items-start mb-6 gap-4">
                            <h1 className="text-3xl font-bold">Visited Airports</h1>
                            <button
                                onClick={clearVisited}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Clear Visited
                            </button>
                        </div>

                        {isLoading ? (
                            <p>Loading…</p>
                        ) : visited.length > 0 ? (
                            <ul className="space-y-4">
                                {visited.map((a: any) => (
                                    <li
                                        key={a.id}
                                        className="border p-4 rounded flex flex-col space-y-1 bg-gray-100 shadow-lg"
                                    >
                                        <div className="flex justify-between items-center">
                                            <h2 className="font-semibold">
                                                {a.airportName} ({a.airportCode})
                                            </h2>
                                            {a.icaoCode && (
                                                <span className="text-sm text-gray-600">
                                                    ICAO: {a.icaoCode}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-700">
                                            {a.city}, {a.country}
                                        </div>
                                        <div className="text-sm text-gray-500">Size: {a.size}</div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">
                                You haven’t marked any airports as visited yet.
                            </p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
