import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        // Google Social Login 
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        // Email & Password 
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // Add your logic to validate credentials against your database here
                const user = { id: "1", name: "User", email: credentials.email };
                if (user) return user;
                return null;
            }
        })
    ],
    pages: {
        signIn: '/login', // Custom login page
    }
});

export { handler as GET, handler as POST };