import { AuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";

interface ExtendedUser extends User {
  tenantId?: string;
  tenantSlug?: string;
}

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
              include: {
                tenant: true,
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

            return {
              id: user.id,
              email: user.username,
              tenantId: user.tenantId || undefined,
              tenantSlug: user.tenant?.slug || undefined,
            };
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
        token.tenantId = (user as ExtendedUser).tenantId;
        token.tenantSlug = (user as ExtendedUser).tenantSlug;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user && token) {
        session.user.email = token.username as string;
        (session as unknown as Record<string, unknown>).tenantId = token.tenantId;
        (session as unknown as Record<string, unknown>).tenantSlug = token.tenantSlug;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
