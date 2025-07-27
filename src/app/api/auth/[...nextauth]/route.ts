// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@/generated/prisma';
import { compare } from 'bcrypt';

const prisma = new PrismaClient();

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    session: { strategy: 'jwt' as const },
    providers: [
        CredentialsProvider({
            name: 'Email',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(creds) {
                if (!creds?.email || !creds.password) return null;
                const user = await prisma.user.findUnique({
                    where: { email: creds.email },
                });
                if (user && (await compare(creds.password, user.password))) {
                    return { id: user.id.toString(), name: user.name, email: user.email };
                }
                return null;
            },
        }),
    ],
    callbacks: {
        async session({ session, token }: { session: any; token: any }) {
            if (session.user) session.user.id = token.sub;
            return session;
        },
    },
    pages: { signIn: '/auth/signin' },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
