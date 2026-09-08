# sewingmum.com

A static prototype storefront for Sewing Mums, a Singapore social enterprise run
by Kim Underhill that helps single mothers earn a livelihood through sewing.
There is no database, no backend, no cart and no checkout. The only conversion
action is a WhatsApp enquiry.

## Running it

```bash
npm install
npm run dev     # http://localhost:3100
npm run build   # production build, all pages prerendered
npm run lint
```

## Before this goes live

These are placeholders and must be replaced. All of them live in
`lib/site.ts` except the photos and copy.

- `whatsappNumber` — currently a dummy number. International format, digits
  only, no `+` or spaces.
- `googleReviewUrl` — the "Write a review" short link from the Google Business
  Profile. While it is an empty string the reviews page shows a "coming soon"
  note instead of a broken button.
- `instagramUrl` and `email`.
- `public/products/*.jpg` — every product photo is currently an AI-generated
  stand-in, not a real piece of work. Replace all nine before launch.
- Copy in `app/about/page.tsx` and the product descriptions in
  `data/products.json` are written as plausible placeholders.
- Reviews in `data/reviews.json` are invented. Replace with real feedback,
  published with permission.

## How the data works

All product data is read through `lib/catalog.ts`, which is the seam we would
swap for a real commerce API (Shopify or similar) later. Nothing else imports
`data/products.json` directly, so that swap stays contained to one module as
long as the exported function signatures hold.

### Adding a product

Add an entry to `data/products.json` and drop its photo in
`public/products/`. The `slug` becomes the URL, the `category` must be one of
the three in `lib/catalog.ts`, and image `width`/`height` must match the file
because `next/image` needs them to reserve space.

### Seasonal products

A product is either made all year:

```json
"availability": { "kind": "regular" }
```

or made only in certain months, given as month numbers:

```json
"availability": { "kind": "seasonal", "months": [11, 12] }
```

Seasonal pieces stay listed all year so customers know what is coming. The
badge shows the season window in the prerendered HTML, then
`components/seasonal-status.tsx` swaps in the live "Available now" or "Back in
November" once the page hydrates. This is deliberate: every page is static, so
anything derived from today's date would otherwise be frozen at build time.

## Conventions

See `AGENTS.md` for the full rules. In short: Server Components by default,
`next/image` for every photo, Tailwind utilities only, design tokens in
`app/globals.css`, and TypeScript strict with no `any`.
