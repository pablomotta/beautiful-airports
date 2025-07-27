'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

export default function Header() {
    const { data: session } = useSession();

    return (
        <header className="bg-white p-4 flex justify-center space-x-8 shadow-lg">
            <Link href="/" className="font-medium hover:underline">
                Home
            </Link>
            <Link href="/visited" className="font-medium hover:underline">
                Visited
            </Link>
            {session?.user ? (
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="font-medium hover:underline"
                >
                    Logout
                </button>
            ) : (
                <Link href="/auth/signin" className="font-medium hover:underline">
                    Sign In
                </Link>
            )}
        </header>
    );
}
