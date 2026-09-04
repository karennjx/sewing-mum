<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

## Project rules

This is a static prototype storefront. There is no database, no backend,
no auth, no payments.

Hard rules:
- All product data is read through `lib/catalog.ts`. Never import
  `products.json` anywhere else. This module is the seam we swap for a
  real commerce API later — keep its function signatures stable.
- No cart, no checkout, no user accounts, no search, no filters.
  The only conversion action is a WhatsApp enquiry link.
- Server Components by default. Add "use client" only when a component
  genuinely needs state or event handlers.
- Use next/image for all product photos, never a bare <img>.
- Tailwind utility classes only. No CSS modules, no styled-components.
- Design tokens live in app/globals.css. Use the token classes, never raw
  hex values in components.
- TypeScript strict. No `any`.