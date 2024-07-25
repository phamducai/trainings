import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/utils/prisma";
import type { DefaultSession, NextAuthOptions } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";
import axios from "axios";
interface CustomUser extends AdapterUser {
  id: string;
  email: string;
  password: string;
  role: string;
  name: string;
  use_id: string;
  full_name: string;
  isPasswordChanged: boolean;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      password: string;
      role: string;
      name: string;
      use_id: string;
      full_name: string;
      isPasswordChanged: boolean; // Add the isPasswordChanged property
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    password: string;
    role: string;
    name: string;
    use_id: string;
    full_name: string;
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
          password: customUser.password,
          role: customUser.role,
          name: customUser.name,
          use_id: customUser.use_id,
          full_name: customUser.full_name,
          isPasswordChanged: customUser.isPasswordChanged,
        };
      }
      console.log("token", token);
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string,
        password: token.password as string,
        role: token.role as string,
        name: token.name as string,
        use_id: token.use_id as string,
        full_name: token.full_name as string,
        isPasswordChanged: token.isPasswordChanged as boolean,
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
    const response = await axios.post(
      "https://account.base.vn/extapi/v1/user/search.by.email",
      new URLSearchParams({
        access_token: process.env.BASE_API_TOKEN!,
        email: email,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const userBaseAccount = response.data;
    if (userBaseAccount && userBaseAccount.message === "success") {
      const userDataBase = await prisma.users.findUnique({
        where: {
          email: email,
        },
      });
      if (userDataBase) {
        if (userDataBase.password === password) {
          return {
            id: userDataBase.id.toString(),
            email: userDataBase.email,
            password: userDataBase.password,
            role: userDataBase.role || "",
            emailVerified: new Date(userDataBase.email),
            name: userDataBase.name,
            use_id: userDataBase.user_id || "",
            full_name: userDataBase.full_name || "",
            isPasswordChanged: userDataBase.isPasswordChanged || false, 
          };
        }
      } else {
        if (password == "12345678") {
          const newUser = await prisma.users.create({
            data: {
              user_id: userBaseAccount.user.uid,
              email: userBaseAccount.user.email,
              password: "12345678",
              role: userBaseAccount.user.role === "13"? "admin" : "user",
              full_name: userBaseAccount.user.name,
              created_at: new Date(),
              update_at: new Date(),
              name: userBaseAccount.user.username,
              isPasswordChanged: false,
            },
          });
          return {
            id: newUser.id.toString(),
            email: newUser.email,
            password: newUser.password || "",
            role: newUser.role || "",
            emailVerified: new Date(newUser.email),
            name: newUser.name,
            use_id: newUser.user_id || "",
            full_name: newUser.full_name || "",
            isPasswordChanged: newUser.isPasswordChanged || false,
          };
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Error fetching user from database", error);
    return null;
  }
}
