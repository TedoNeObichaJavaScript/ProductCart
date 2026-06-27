# Contributing to ProductCart

Thanks for your interest in improving ProductCart! This guide covers the workflow and conventions for the codebase.

## Getting set up

See the [README](./README.md#-getting-started) for environment setup. In short:

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL + AUTH_* values
npm run db:push
npm run dev
```

## Branch & commit workflow

1. Create a feature branch off `main`: `git checkout -b feat/short-description`.
2. Keep commits focused and write clear messages (Conventional Commits style appreciated: `feat:`, `fix:`, `chore:`, `docs:`…).
3. Open a pull request describing **what** changed and **why**.

## Before you push

All three must pass:

```bash
npm run typecheck
npm run lint
npm run format:check
```

Run `npm run lint:fix` and `npm run format` to auto-fix most issues.

## Conventions

- **TypeScript everywhere** — no `any`; prefer inferred or explicit types. Validation lives in [`src/lib/validations`](./src/lib/validations) with Zod and is reused on both client and server.
- **Server vs client** — data access and mutations live in [`src/server`](./src/server) (Server Actions are `"use server"` and Zod-validated). Mark client components with `"use client"` only when they need interactivity.
- **UI** — compose from [`src/components/ui`](./src/components/ui) (shadcn/ui). Don't hand-edit generated primitives; re-run `npx shadcn@latest add <component>` instead. Use the design tokens (`bg-primary`, `text-muted-foreground`, …) rather than hard-coded colors.
- **i18n** — never hard-code user-facing copy. Add keys to **both** [`messages/en.json`](./messages/en.json) and [`messages/bg.json`](./messages/bg.json) and read them with `useTranslations` / `getTranslations`.
- **Animation** — use the helpers in [`src/components/motion`](./src/components/motion); they already honor `prefers-reduced-motion`.
- **Database** — edit [`prisma/schema.prisma`](./prisma/schema.prisma), then `npm run db:push` (dev) or `npm run db:migrate` (tracked migration), then `npm run db:generate`.

## Adding a new product field (example)

1. Add the column to `Product` in `schema.prisma` and push.
2. Extend `productSchema` in `src/lib/validations/product.ts`.
3. Surface it in the form ([`product-form-dialog.tsx`](./src/components/inventory/product-form-dialog.tsx)) and the create/update actions.
4. Add any new copy to both message catalogs.

Happy building! 🧺
