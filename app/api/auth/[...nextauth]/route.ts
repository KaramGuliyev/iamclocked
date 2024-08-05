import { type NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { User, Account, Profile } from "next-auth";
import { ObjectId } from "mongodb";

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
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // console.log("SignIn callback: ", { user, account, profile, email, credentials });
      const userId = new ObjectId(user.id);
      const existingTenant = await prisma.tenant.findFirst({
        where: { userId: userId.toString() },
      });

      if (!existingTenant) {
        await prisma.tenant.create({
          data: {
            name: user.name || "Default Tenant Name",
            email: user.email as string,
            userId: userId.toString(),
          },
        });
      }

      return true;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      // console.log("JWT callback: ", { token, user, account, profile, isNewUser });
      return token;
    },
    async session({ session, token, user }) {
      // console.log("Session callback: ", { session, token, user });
      return session;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
