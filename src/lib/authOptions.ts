import { PrismaClient } from "@/generated/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcrypt";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" as const },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: "Email or Username",
            credentials: {
                identifier: { label: "Email or Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(creds) {
                if (!creds?.identifier || !creds.password) return null;
                // look up by email OR username
                const user = await prisma.user.findFirst({
                    where: {
                        OR: [{ email: creds.identifier }, { username: creds.identifier }],
                    },
                });
                if (user && (await compare(creds.password, user.password))) {
                    return { id: user.id.toString(), name: user.name, email: user.email };
                }
                return null;
            },
        }),
    ],
    pages: { signIn: "/auth/signin" },
    callbacks: {
        async jwt({ token, user }) {
            if (user) token.sub = user.id;
            return token;
        },
        async session({ session, token }) {
            if (session.user) session.user.id = token.sub;
            return session;
        },
    },
}; 