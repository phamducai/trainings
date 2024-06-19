import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/utils/prisma";
import type { DefaultSession, NextAuthOptions } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";

interface CustomUser extends AdapterUser {
  id: string;
  email: string;
  phone: string;
  role: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      phone: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    phone: string;
    role: string;
  }
}

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt", 
    maxAge: 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials.password) {
          return null;
        }
        const user = await authenticateUser(
          credentials.email,
          credentials.password
        );
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const customUser = user as CustomUser;
        return {
          ...token,
          id: customUser.id,
          phone: customUser.phone,
          role: customUser.role,
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string,
        phone: token.phone as string,
        role: token.role as string,
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

async function authenticateUser(
  email: string,
  password: string
): Promise<CustomUser | null> {
  const user = await fetchUserFromDatabase(email, password);
  return user;
}

async function fetchUserFromDatabase(
  email: string,
  password: string
): Promise<CustomUser | null> {
  try {
    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    if (user && user.password === password) {
      return {
        id: user.id.toString(),
        email: user.email,
        phone: user.password,
        role: user.role || "",
        emailVerified:  new Date(user.email)
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching user from database", error);
    return null;
  }
}
