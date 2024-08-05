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
      const userId = user.id;
      console.log(userId, ObjectId.isValid(userId));

      // Ensure user.id is converted to ObjectId where necessary
      if (ObjectId.isValid(userId)) {
        // Example of converting string to ObjectId if needed
        const id = new ObjectId(userId);

        // Example of fetching a tenant
        const existingTenant = await prisma.tenant.findFirst({
          where: { userId: id.toString() },
        });

        console.log(existingTenant);
        

        if (!existingTenant) {
          await prisma.tenant.create({
            data: {
              name: user.name || "Default Tenant Name",
              email: user.email as string,
              userId: id.toString(),
            },
          });
        }
      } else {
        console.error("Invalid ObjectId:", userId);
      }

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
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
