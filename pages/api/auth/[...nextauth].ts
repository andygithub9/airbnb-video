import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { AuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import prisma from "@/app/libs/prismadb";

// https://next-auth.js.org/configuration/options
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Invalid credentials");
        }

        // findUnique() 是 Prisma Client 提供的一個方法之一，用於查詢資料庫中的唯一記錄。它接受一個物件作為參數，用於指定查詢的條件。這些條件通常是基於資料模型的屬性。
        // findUnique() 方法被呼叫並傳遞一個包含 where 屬性的物件作為參數。where 屬性用於指定查詢的條件，這裡是根據用戶的電子郵件地址進行查詢。
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user?.hashedPassword) {
          throw new Error("Invalid credentials");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }
        return user;
      },
    }),
  ],
  // https://next-auth.js.org/configuration/options#pages
  // signIn 頁面的 url
  pages: {
    signIn: "/",
  },
  // https://next-auth.js.org/configuration/options#debug
  // 在開發環境可以在終端機看到 error
  debug: process.env.NODE_ENV === "development",
  // https://next-auth.js.org/configuration/options#session
  session: {
    strategy: "jwt",
  },
  // https://next-auth.js.org/configuration/options#secret
  secret: process.env.NEXTAUTH_SECRET,
};

// https://next-auth.js.org/configuration/initialization
export default NextAuth(authOptions);
