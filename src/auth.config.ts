import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

// Edge-safe configuration (no database access). Providers read their
// credentials from AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET / AUTH_GITHUB_* env vars.
export default {
  providers: [
    Google({ allowDangerousEmailAccountLinking: true }),
    GitHub({ allowDangerousEmailAccountLinking: true }),
  ],
  pages: {
    signIn: "/sign-in",
  },
} satisfies NextAuthConfig;
