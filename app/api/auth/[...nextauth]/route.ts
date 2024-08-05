import { type NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { User, Account, Profile } from "next-auth";

const prisma = new PrismaClient();

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
<<<<<<< Updated upstream
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("SignIn callback: ", { user, account, profile, email, credentials });
      return true;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log("JWT callback: ", { token, user, account, profile, isNewUser });
      return token;
    },
    async session({ session, token, user }) {
      console.log("Session callback: ", { session, token, user });
      return session;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
=======

  events: {
    signIn: async (message: { user: User; account: Account | null; profile?: Profile }) => {
      const { user, account, profile } = message;
      console.log("User signed in:", user);
      console.log("Account:", account);
      console.log("Profile:", profile);
    },
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async session({ session, user, token }) {
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      return token;
    },
  },
>>>>>>> Stashed changes
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
