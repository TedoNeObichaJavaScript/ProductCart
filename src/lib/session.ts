import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

/** Redirects to the sign-in page when there is no authenticated user. */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }
  return user;
}

// Auth.js v5 database-session cookie names (insecure dev / secure prod).
const SESSION_COOKIE_NAMES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
];

export async function getSessionToken(): Promise<string | null> {
  const store = await cookies();
  for (const name of SESSION_COOKIE_NAMES) {
    const value = store.get(name)?.value;
    if (value) return value;
  }
  return null;
}

export async function getSessionRecord() {
  const token = await getSessionToken();
  if (!token) return null;
  return db.session.findUnique({ where: { sessionToken: token } });
}

/** True when 2FA is disabled, or enabled and this session has passed the TOTP challenge. */
export async function isTwoFactorSatisfied(user: {
  twoFactorEnabled?: boolean;
}): Promise<boolean> {
  if (!user.twoFactorEnabled) return true;
  const record = await getSessionRecord();
  return Boolean(record?.twoFactorVerified);
}

/** Mark the current session as having passed the TOTP challenge. */
export async function markSessionTwoFactorVerified(): Promise<void> {
  const token = await getSessionToken();
  if (!token) return;
  await db.session.update({
    where: { sessionToken: token },
    data: { twoFactorVerified: true },
  });
}
