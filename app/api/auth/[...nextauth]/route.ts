import { type NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const authOptions: NextAuthOptions = {
  debug: true,
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
    signIn: async ({ user, account, profile }) => {
      console.log("User signed in:", user);
      console.log("Account:", account);
      console.log("Profile:", profile);
    },
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!profile || !account) {
        return false; // Başarısız oturum açma durumunda false döndür
      }

      try {
        const newUser = user;
        console.log("Name :"+newUser.name);
        
        await prisma.user.upsert({
          where: {
            email: newUser.email as string,
          },
          create: {
            email: newUser.email as string,
            name: newUser.name as string,
            image: newUser.image as string,
            tenant: {
              create: {
                name: newUser.name as string,
              },
            },
          },
          update: {
            name: profile.name || (user.name as string),
            image: profile.image || (user.image as string),
          },
        });
      } catch (error) {
        console.log(error);
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
