import "server-only";

import { db } from "@/lib/db";

/**
 * Returns the user's active organization, creating a personal one on first use.
 * ProductCart is multi-tenant: every product/category belongs to an org.
 */
export async function getActiveOrg(
  userId: string,
  displayName?: string | null,
) {
  const membership = await db.membership.findFirst({
    where: { userId },
    include: { org: true },
    orderBy: { createdAt: "asc" },
  });

  if (membership) return membership.org;

  const base = (displayName ?? "my-venue")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 24);
  const slug = `${base || "venue"}-${userId.slice(0, 6)}`;

  return db.organization.create({
    data: {
      name: displayName ? `${displayName}'s venue` : "My venue",
      slug,
      memberships: {
        create: { userId, role: "OWNER" },
      },
    },
  });
}
