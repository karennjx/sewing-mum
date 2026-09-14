<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

## Project rules

A storefront for a small handmade business. Product data is still a JSON
file; there is no database, no auth, and no payment gateway.

Hard rules:
- All product data is read through `lib/catalog.ts`. Never import
  `products.json` anywhere else. This module is the seam we swap for a
  real commerce API later — keep its function signatures stable.
- No user accounts, no search, no filters.
- Only products with a price can be bought. Everything else stays on the
  WhatsApp enquiry link, which remains the fallback on every product.

### Selling

A cart and checkout are in scope; the earlier "no cart" rule was a
starting constraint, not the intended end state. Shopify was considered
and ruled out — at this traffic it costs more than it saves.

How buying works, and why:
- The cart lives in the browser. No order is stored anywhere server-side
  yet, so treat it as losable and never as a record of anything.
- Payment is a static PayNow QR belonging to Kim. Nothing reports back to
  the site when money moves, so **the site can never claim a payment
  succeeded.** Order confirmations say the order was received and payment
  is being checked. Kim confirms against her bank by hand.
- Stock is a number Kim keeps by hand and nothing decrements it, so it
  guides shoppers but cannot prevent overselling. Don't write code that
  assumes it is authoritative.

Intended next step is Supabase behind `lib/catalog.ts` holding products,
stock and orders, with a CMS for Kim. Keeping to the seam above is what
makes that a swap rather than a rewrite.
- Server Components by default. Add "use client" only when a component
  genuinely needs state or event handlers.
- Use next/image for all product photos, never a bare <img>.
- Tailwind utility classes only. No CSS modules, no styled-components.
- Design tokens live in app/globals.css. Use the token classes, never raw
  hex values in components.
- TypeScript strict. No `any`.