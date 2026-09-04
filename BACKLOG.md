# Sewing Mum — backlog

Last updated: 5 September 2026

Where things stand: a working five-page prototype (home, our story, products,
product detail, customer voice) is built and runs locally. Everything in it is
placeholder content. Nothing is deployed and the domain is not pointed
anywhere yet.

The six items below are roughly in the order they unblock each other. Items 1,
2 and 4 need Kim's input before code can move. Items 3, 5 and 6 are linked
decisions and are best made together — see the note under item 5.

---

## Launch blockers

The site cannot go public until these are done, regardless of anything else in
this backlog.

- [ ] Real WhatsApp number in `lib/site.ts` (currently a dummy, so every
      enquiry button leads nowhere)
- [ ] Replace all nine product photos in `public/products/` — the current ones
      are AI-generated stand-ins, not real work
- [ ] Real product names, prices and descriptions in `data/products.json`
- [ ] Real "Our story" copy in `app/about/page.tsx`
- [ ] Real customer reviews in `data/reviews.json`, published with permission
- [ ] Decide hosting and point the domain (item 6)

---

## 1. Brand colour and identity

**Why it matters:** everything visual is currently my guess at a warm handmade
palette. It reads well but it is not Kim's brand, and changing it later means
touching every page unless it stays in the tokens.

**What exists now** — all in `app/globals.css`, used everywhere as token
classes rather than raw hex, so a rebrand is a single-file edit:

| Token | Value | Used for |
| --- | --- | --- |
| `cream` | `#fdf8f3` | page background |
| `linen` / `linen-dark` | `#f4ebe0` / `#e7d9c8` | section bands, borders |
| `ink` | `#3b2f2a` | body text, primary buttons |
| `muted` | `#7a6a60` | secondary text |
| `berry` | `#9c4a63` | accent, enquiry buttons, links |
| `sage` | `#6f8462` | "made all year" badge |
| `gold` | `#b8863a` | seasonal badge, star ratings |

Fonts are currently Fraunces (headings) and Karla (body), both free from
Google Fonts.

**Decisions needed:**

- [ ] Does Kim already have a logo, or colours she uses on packaging,
      labels or her Instagram? If so those win over anything here.
- [ ] Is there a sewn-in fabric label or care tag? Its colours and typeface
      are the most authentic starting point for a brand palette.
- [ ] Do we want a real logo mark, or is the wordmark enough? A wordmark is
      cheaper and ages better; a mark is useful for the favicon and for
      stamping on packaging.
- [ ] Confirm the tone of the writing. Current copy is warm and plain-spoken,
      first person, British spelling, and slightly dry. If that is not Kim's
      voice it should change before more copy is written.

**Recommendation:** collect photos of her existing labels, packaging and
Instagram grid first, then pick the palette from those rather than designing
from scratch. Budget a proper logo only after the site is live and earning.

---

## 2. Product profiling

**Why it matters:** the fields we settle on now become the shape of the data
in every future system, including Shopify. Getting this right once saves
re-photographing and re-writing everything later.

**Fields captured today** (see `Product` in `lib/catalog.ts`): slug, name,
category, price, blurb, long description, details list, images, availability,
featured flag.

**Fields likely still needed:**

- [ ] **Multiple images per product** — the schema already accepts an array
      but every product currently has one, and the detail page only renders
      the first. Needs a gallery component.
- [ ] **Variants** — does a bag come in more than one fabric or size at the
      same price? If yes this is a real schema change and should be decided
      before Shopify, because Shopify models variants strictly.
- [ ] **Stock status** — distinct from seasonal availability. A product can be
      in season but sold out. Currently unmodelled.
- [ ] **Lead time / made to order** — some pieces are cut only after ordering.
      Currently buried in the details list as free text.
- [ ] **Structured dimensions** — currently prose ("roughly 38cm wide"). Should
      be structured if we ever want shipping calculations.
- [ ] **Weight** — needed for real shipping rates later, not now.
- [ ] **SKU or internal code** — for Kim's own record keeping and for Shopify.
- [ ] **Materials and care** as separate fields rather than a mixed bullet list.

**How many images per product — recommendation: four, five for bundles.**

1. Hero shot, plain background, whole piece, square. This is the listing card.
2. Detail close-up showing stitching, lining or hardware. This is what
   justifies a handmade price.
3. Scale shot — held, worn, or beside a common object. The single most common
   pre-purchase question is "how big is it".
4. Interior or reverse — pockets, lining, the back of a soft toy.
5. For bundles only: a flat lay showing every item included.

**Photography consistency matters more than photo quality.** Same background,
same light, same distance for the hero shot of every product. A window, a
sheet of cream paper and a phone will beat inconsistent professional photos on
a listing grid.

- [ ] Agree the shot list above with Kim
- [ ] Agree a fixed hero-shot setup she can reproduce for new products
- [ ] Decide aspect ratios (suggest 1:1 for cards, allow 4:5 on detail pages)
- [ ] Build the gallery component once there is more than one image per product

---

## 3. Porting to Shopify or similar

**Why it matters:** this is the "later" the current architecture was built
for, and how we do it determines items 5 and 6.

**What was done to prepare:** all product data is read through
`lib/catalog.ts`. Nothing else in the codebase touches `data/products.json`.
Swapping the JSON file for a Shopify Storefront API call means rewriting that
one module while keeping its function signatures, and the rest of the site
does not change.

**The three realistic paths:**

**a) Shopify Buy Button on this site.** Keep this Next.js site exactly as it
is, and embed Shopify's hosted buy button or checkout link per product.
Cheapest change, adds payments and basic inventory, keeps the site's look.
Downside: two systems to keep in step, and product copy would live in both.

**b) Headless — Shopify as backend, this site as frontend.** Shopify holds
products, stock, orders and payments. `lib/catalog.ts` reads from the
Storefront API. Kim manages everything in the Shopify admin app. Keeps the
bespoke design, gives her a real back office. This is the path the current
architecture was designed for.

**c) Move onto a Shopify theme entirely.** Abandon this codebase and use a
Shopify theme. Least work to maintain, least distinctive, and the handmade
character of the current design would be hard to reproduce.

**Recommendation:** stay on the WhatsApp-enquiry prototype until enquiry
volume is genuinely annoying to handle by hand. When it is, go to (b) — it
solves inventory, payments and item 5 in one move. Avoid (a) as a permanent
answer; a split source of truth causes more work than it saves.

**Decisions needed:**

- [ ] Agree the trigger for moving. Suggest: more than roughly ten enquiries a
      week, or Kim losing track of what is sold.
- [ ] Confirm whether she wants to take card payments at all, or is happy with
      PayNow / bank transfer arranged over WhatsApp
- [ ] Check Shopify's monthly cost against actual monthly sales before
      committing — it is not worth it below a certain volume
- [ ] Consider lighter alternatives if payments are the only need: Shopify
      Starter, Ecwid, or a simple PayNow QR

---

## 4. The Sewing Mum story

**Why it matters:** it is the reason someone pays handmade prices instead of
buying from a chain. It is also the one thing a competitor cannot copy. The
current "Our story" page is plausible placeholder writing and should not go
live as-is.

**Questions to put to Kim** — her answers, in her own words, are the raw
material. Recording a voice note and transcribing it usually produces better
copy than asking her to write:

- [ ] When and why did she start sewing? Who taught her?
- [ ] What was the first thing she made for someone else, and what happened?
- [ ] Why these three categories — handbags, soft toys, bookish bundles? The
      combination is unusual and the reason is probably a good story.
- [ ] Where does the fabric come from? Offcuts, deadstock, specific shops,
      things brought back from travels?
- [ ] What does "Sewing Mum" mean — is it what her children call it?
- [ ] Which piece is she proudest of, and which does she refuse to make again?
- [ ] What does she want this to become? A side income, a small business, a
      way to keep busy? This sets the tone of the whole site.
- [ ] Any photos of her at work, the sewing room, or works in progress? A
      photograph of hands sewing is worth several paragraphs.

**Decisions needed:**

- [ ] How visible does Kim want to be? Name and face, first name only, or stay
      behind the brand? This affects the story page, the reviews page and the
      WhatsApp messaging.
- [ ] First person ("I make") or third ("Sewing Mum makes")? Current copy
      mixes both and should be made consistent once decided.

---

## 5. How Kim updates products and manages stock

**Why it matters:** this is the item that decides whether the site stays
current or quietly goes stale. Kim is not technical, and right now adding a
product means editing a JSON file — which is fine for me and impossible for
her. Until this is solved she is dependent on someone else for every change.

**Options, roughly easiest to most capable:**

**a) Kim sends photos and details on WhatsApp; someone else updates the site.**
Zero setup, works today. Fine if updates are monthly. Becomes a bottleneck and
a favour-based dependency if she is making things weekly.

**b) Google Sheet as the source of truth.** Kim edits a spreadsheet with one
row per product; the site reads from it. She already knows how a spreadsheet
works, it is free, and it works on her phone. Weak on images — she would still
need to get photos into a folder — and it has no concept of orders or stock
movements.

**c) A friendly CMS** (Sanity, Payload or similar). A proper web form: type the
name, drag in photos, tick "seasonal", press publish. Much nicer for images
than a spreadsheet. Costs a little, needs a one-off setup, and is one more
login and password to remember.

**d) Shopify admin.** The Shopify phone app is genuinely designed for
non-technical shop owners: add a product, photograph it in the app, set stock,
mark it sold out. It also handles orders and payments, which none of the above
do. This is item 3, path (b) — the same decision seen from Kim's side.

**Recommendation:** start with (a) while there are nine products and the site
is new; it costs nothing and defers the decision. Then go straight to (d) when
enquiry volume justifies it, and skip (b) and (c) entirely. Building a custom
CMS that Kim must learn, only to move her to Shopify's admin a year later,
means teaching her two systems instead of one.

**On inventory specifically:** note that stock and seasonal availability are
different things and the site currently only models the second. A piece can be
in season but sold out, or out of season with one left over from last year. If
Kim is losing track of what is physically on the shelf, that is the strongest
argument for moving to (d) sooner.

**Decisions needed:**

- [ ] How often does Kim expect to add or change products? This single answer
      decides between (a) and (d).
- [ ] Does she keep any stock record today — a notebook, a spreadsheet, or
      nothing? Whatever it is, the new system should not be more work than it.
- [ ] Who is the fallback if she gets stuck? Agree this explicitly rather than
      assuming.
- [ ] Would she rather do this on a phone or a laptop? Shopify's app is
      phone-first; a spreadsheet is not.

---

## 6. Hosting

**Why it matters:** the domain is owned but points nowhere, so this is the last
gate before anything is public.

**Current position:** `sewingmum.com` is registered; there is no hosting yet.
The site is a Next.js application which builds to twenty fully static pages,
so it is cheap and easy to host.

**Options:**

**a) Vercel free tier.** Made by the same people as Next.js, so everything
works with no configuration, including automatic image optimisation and
preview builds. Free at this scale, custom domain and HTTPS included.
Deploying is connecting a git repository. This is the obvious default.

**b) Cloudflare Pages or Netlify.** Also free at this scale and perfectly
capable. Slightly more configuration for a Next.js app, and image
optimisation needs attention.

**c) Static export to any web host.** `next build` can emit plain HTML that
will sit on the cheapest shared hosting. Works anywhere, but gives up
on-demand image optimisation, meaning we would need to size and compress every
product photo by hand.

**Recommendation:** (a). It is free, it is the least work, and it does not
foreclose anything — if Kim later moves to a full Shopify theme, the domain
just gets repointed.

**Decisions needed:**

- [ ] Confirm where the domain is registered, and who holds the login. This
      matters more than it sounds: losing access to a registrar account is a
      genuinely painful problem.
- [ ] Decide the host (suggest Vercel) and create the account in Kim's name or
      a shared account she can access, not a personal one she cannot
- [ ] Set up a `www` to apex redirect, or pick one and stick to it
- [ ] Decide whether to put the site behind a holding page first, so the
      domain resolves to something while content is still being gathered
- [ ] Set up email on the domain if `hello@sewingmum.com` is to be real — it
      is currently a placeholder in `lib/site.ts` and goes nowhere
- [ ] Create the Google Business Profile, so the "Write a Google review" link
      on the reviews page can be filled in. It is stubbed out and shows
      "coming soon" until then.

---

## Nice to have, not now

Deliberately parked. None of these are worth doing before the site has real
content and real traffic.

- Photo gallery with multiple images per product (needs item 2 first)
- Structured data so Google shows products and prices in search results
- Instagram feed embedded on the homepage
- "Notify me when back in season" for seasonal pieces — currently handled by
  Kim noting names down manually, which is fine and arguably nicer
- Analytics, to find out whether anyone is actually reading the story page
- A second language, if a meaningful share of customers would prefer it
