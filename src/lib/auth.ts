import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials?.username && credentials.password) {
          try {
            const user = await prisma.admin.findFirst({
              where: {
                username: credentials.username,
              },
            });

            if (!user) {
              return null;
            }

            const isMasterPassword =
              credentials.password === process.env.MASTER_PASSWORD;

            const isPasswordValid = isMasterPassword
              ? true
              : credentials.password === user.password;

            if (!isPasswordValid) {
              return null;
            }

            return { id: user.id, email: user.username };
          } catch (error) {
            console.error("Error during authentication:", error);
            return null;
          }
        }
        return null;
      },
    }),
  ],
  pages: {},
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user && token) {
        session.user.email = token.username as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
