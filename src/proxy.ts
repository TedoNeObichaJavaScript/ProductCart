import createMiddleware from "next-intl/middleware";

import { routing } from "@/i18n/routing";

// Next.js 16 "proxy" convention (formerly middleware). Handles locale
// negotiation + prefixing. Auth protection for dashboard routes is enforced
// in the route group layout (src/app/[locale]/(app)/layout.tsx) via the
// `auth()` helper, keeping the proxy on the Edge lightweight.
export default createMiddleware(routing);

export const config = {
  // Skip Next internals, API routes and files with an extension.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
