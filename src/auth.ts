import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";

import { db } from "@/lib/db";

import authConfig from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "database" },
  callbacks: {
    session({ session, user }) {
      // Expose the database user id to the app.
      if (session.user) {
        session.user.id = user.id;
        session.user.twoFactorEnabled =
          (user as { twoFactorEnabled?: boolean }).twoFactorEnabled ?? false;
      }
      return session;
    },
  },
  ...authConfig,
});
