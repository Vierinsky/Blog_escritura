import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import { connectDB } from "@/lib/db";
import User from "@/models/user"


export const authOptions: NextAuthOptions = {
    session: { strategy: "jwt" },

    providers: [
        CredentialProvider({
            name: "Credentials",
            Credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },

            
            async authorize(credentials) {
                await connectDB();

                const email = credentials?.email;
                const password = credentials?.password;

                if (!email || !password) return null;

                const user = await User.findOne({ email });
                if (!user) return null;

                const match = await bcrypt.compare(password, user.password);
                if (!match) return null;

                // MUY IMPORTANTE: devolver un objeto "user" compatible con NextAuth
                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                };
            },
        }),
    ],

    callbacks: {
        // se ejecuta cuando se crea/actualiza el token JWT
        async jwt({ token, user }) {
            if (user) {
                token.id = (user as any).id;
            }
            return token;
        },

        // Se ejecuta cada vez que se crea la session que llega al frontend
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
            }
            return session;
        },

    },

    pages: {
        signIn: "/login",
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST}