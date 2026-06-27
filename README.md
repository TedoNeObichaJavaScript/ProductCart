# ProductCart

> Next-generation inventory & stock-management software for food-service businesses — restaurants, bars, clubs, cafés and shops.

ProductCart is a production-grade, multi-tenant SaaS for tracking products, stock levels, usage and wastage. It pairs a polished, animated marketing site with a secure, authenticated dashboard. Fully responsive, dark/light themed, and bilingual (Bulgarian 🇧🇬 / English 🇬🇧).

This repository is a complete, modern rebuild of the original static HTML/CSS/JS prototype (preserved under [`legacy/`](./legacy)).

---

## ✨ Features

- **Marketing site** — animated hero, feature grids, FAQ accordion and a validated contact form.
- **Authentication** — Auth.js v5 with Google & GitHub OAuth, database sessions, and protected dashboard routes.
- **Inventory dashboard** — full product CRUD, automatic remaining-stock & wastage calculation, low-stock status, category management and an append-only stock-movement audit log.
- **Multi-tenant** — every product belongs to an organization; users get a personal org automatically.
- **Internationalized** — first-class BG/EN routing with `next-intl` and a language switcher.
- **Theming** — seamless dark/light/system mode via `next-themes`.
- **Premium motion** — Framer Motion page/section animations that respect `prefers-reduced-motion`.
- **Robust UX** — global toasts, error boundaries, 404 page, loading skeletons and empty states.
- **Type-safe end to end** — strict TypeScript, Zod validation shared between client and server, typed Server Actions, and Prisma.

---

## 🧱 Tech stack

| Layer      | Technology                                                                            |
| ---------- | ------------------------------------------------------------------------------------- |
| Framework  | [Next.js 16](https://nextjs.org) (App Router, React 19, Turbopack)                     |
| Language   | TypeScript (strict)                                                                   |
| Styling    | Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com) (Radix primitives)               |
| Animation  | [Framer Motion](https://www.framer.com/motion/)                                       |
| Auth       | [Auth.js v5 (NextAuth)](https://authjs.dev)                                           |
| Database   | PostgreSQL (e.g. [Neon](https://neon.tech)) via [Prisma 7](https://www.prisma.io) + `@prisma/adapter-pg` |
| Validation | [Zod](https://zod.dev)                                                                |
| i18n       | [next-intl](https://next-intl.dev)                                                    |
| State      | [Zustand](https://zustand.docs.pmnd.rs) (client UI only)                              |
| Tooling    | ESLint, Prettier, TypeScript                                                          |

---

## 📁 Project structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── (marketing)/        # Public, statically-rendered site (home, faq, contact)
│   │   ├── (auth)/             # Sign-in
│   │   ├── (app)/              # Auth-protected dashboard & inventory
│   │   ├── layout.tsx          # Root layout: fonts, providers, i18n
│   │   ├── error.tsx           # Localized error boundary
│   │   └── not-found.tsx       # Localized 404
│   ├── api/auth/[...nextauth]/ # Auth.js route handler
│   └── global-error.tsx        # Top-level fallback
├── components/
│   ├── ui/                     # shadcn/ui primitives
│   ├── marketing/ dashboard/ inventory/ motion/ providers/ …
├── server/
│   ├── actions/                # 'use server' mutations (Zod-validated)
│   ├── products.ts  org.ts     # Data-access layer (server-only)
├── lib/                        # db client, validations, formatters, inventory math
├── i18n/                       # routing, navigation, request config
├── stores/                     # Zustand UI stores
├── auth.ts  auth.config.ts     # Auth.js setup
└── proxy.ts                    # Locale negotiation (Next 16 proxy/middleware)
messages/                       # bg.json, en.json
prisma/                         # schema.prisma, seed.ts
```

---

## 🚀 Getting started

### Prerequisites

- Node.js ≥ 20 (tested on 22)
- A PostgreSQL database — [Neon](https://neon.tech) free tier recommended

### 1. Install

```bash
npm install
```

### 2. Configure environment

Copy the example and fill in your values:

```bash
cp .env.example .env
```

| Variable                                  | Description                                                                     |
| ----------------------------------------- | ------------------------------------------------------------------------------- |
| `DATABASE_URL`                            | Postgres pooled connection string (Neon)                                        |
| `DIRECT_URL`                              | Postgres direct connection (migrations) — optional                              |
| `AUTH_SECRET`                             | Run `npx auth secret` to generate                                               |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`   | [Google OAuth](https://console.cloud.google.com/apis/credentials) credentials   |
| `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET`   | [GitHub OAuth](https://github.com/settings/developers) app credentials          |

> OAuth redirect URL: `http://localhost:3000/api/auth/callback/{google|github}`

### 3. Set up the database

```bash
npm run db:push     # create tables from the Prisma schema
npm run db:seed     # (optional) load demo products
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 📜 Scripts

| Script                            | Description                            |
| --------------------------------- | -------------------------------------- |
| `npm run dev`                     | Start the dev server                   |
| `npm run build`                   | Generate Prisma client + prod build    |
| `npm run start`                   | Run the production server              |
| `npm run lint` / `lint:fix`       | ESLint                                 |
| `npm run format` / `format:check` | Prettier                               |
| `npm run typecheck`               | `tsc --noEmit`                         |
| `npm run db:push`                 | Push schema to the database            |
| `npm run db:migrate`              | Create a migration                     |
| `npm run db:studio`               | Open Prisma Studio                     |
| `npm run db:seed`                 | Seed demo data                         |

---

## 🌍 Internationalization

Locales live in [`messages/`](./messages). The default locale (`bg`) is served without a prefix (`/`), English at `/en`. Add a locale by extending `routing.locales` in [`src/i18n/routing.ts`](./src/i18n/routing.ts) and adding a matching message file.

---

## 🔐 Two-factor authentication

The data model and session already carry `twoFactorEnabled` / `twoFactorSecret`, so MFA is **scaffolded** at the schema level. A full TOTP enrolment/verification flow is the natural next step (e.g. with `otpauth` + a QR component).

---

## ☁️ Deployment

Deploy to [Vercel](https://vercel.com): import the repo, add the environment variables above, and set the build command to `npm run build` (it runs `prisma generate` automatically). Point `NEXT_PUBLIC_APP_URL` and the OAuth callback URLs at your production domain.

---

## 📦 Legacy

The original prototype is preserved verbatim in [`legacy/`](./legacy) for reference. It is excluded from linting, formatting and the build.
