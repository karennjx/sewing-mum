# Sewing Mum — backlog

Last updated: 8 September 2026

Where things stand: a working five-page prototype (home, our story, products,
product detail, customer voice) is built and runs locally. Everything in it is
placeholder content. Nothing is deployed and the domain is not pointed
anywhere yet.

The seven items below are roughly in the order they unblock each other. Items
1, 2 and 4 need Kim's input before code can move. Items 3, 5, 6 and 7 are
linked decisions and are best made together — see the note under item 5.

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
- [ ] Point the domain at Vercel (item 6 — the host is now decided, the domain
      still resolves nowhere)

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

**If we ever take path (c), what survives the port.** The storefront can be
made effectively identical. The whole visual identity is nine hex values and
one radius in `app/globals.css`, Fraunces and Karla are free fonts that can be
uploaded into a Shopify theme and wired up with `@font-face`, and Tailwind
compiles to plain CSS a theme can serve. Nothing in the design depends on
React or on interactivity, which is lucky. But an identical result needs a
one-off custom theme, and that is code again — Liquid instead of React. A
stock theme configured through Shopify's visual editor gets the same palette,
the same fonts and the same warmth but a different layout: recognisably Sewing
Mum, not the same site. The distinction worth holding on to is between "no
code exists" and "Kim never touches code". Only the second matters to her, and
Shopify gives it either way.

**The checkout is the hard limit, on any plan we would realistically buy.** On
Shopify's normal plans the checkout editor allows a logo, colours, a
background and a font choice, and nothing else. Corner radii, spacing and
component styling run through the Checkout Branding API, which is Shopify Plus
only and far outside this project's budget. So checkout will always look like
a Shopify checkout wearing Kim's colours. Treat that as a feature: a
recognisable checkout reassures people about their card details in a way a
bespoke one does not.

**The real argument for path (c) is succession, not design.** A Shopify theme
survives neglect; a Next.js codebase does not. Dependencies age, major
versions ship, and a site left alone for two years eventually stops building.
If whoever maintains this moves on and nobody replaces them, path (b) becomes
a liability and path (c) does not. That, rather than anything visual, is the
reason to keep collapsing onto a theme on the table.

### Porting checklist

**URLs are already compatible, which is the expensive part of most
migrations.** Shopify serves products at `/products/<handle>`; this site
serves them at `/products/[slug]`. If slugs become handles unchanged, every
product URL survives a Shopify move untouched, so no search ranking and no
WhatsApp link anyone has shared will break. Only three routes need redirects,
and Shopify has a built-in tool for them: `/products` becomes
`/collections/all`, `/about` becomes `/pages/about`, and `/reviews` becomes
`/pages/reviews`.

**Field mapping.** Most of `Product` has a direct Shopify equivalent:

| This site | Shopify | Notes |
| --- | --- | --- |
| `slug` | Handle | Direct — this is what keeps the URL |
| `name` | Title | Direct |
| `price` | Variant price | Direct |
| `category` | Collection | Three collections |
| `description[]` | `body_html` | Join the paragraphs as `<p>` tags |
| `details[]` | Metafield | Or appended to the description |
| `images[]` | Product images | Re-upload; alt text carries over |
| `featured` | Tag or collection | Either works |
| `availability` | — | No equivalent; see below |

**The one field that does not port.** `Availability` is ours alone — Shopify
has no concept of "made only in October to December". It would become tags or
a metafield, and `isInSeason`, `seasonWindowLabel` and `availabilityLabel`
would all be rewritten as theme logic. Budget a day for it and treat it as a
rewrite rather than a move.

**The fields Shopify wants that do not exist yet** are exactly the open list
in item 2: SKU, weight, stock quantity and variants. Variants matter most,
because Shopify models them strictly and retrofitting them onto products
already photographed and described as single items is the one migration task
that genuinely hurts. Settle that question before shooting more products.

**The CMS choice barely affects portability, but not quite equally.** A
git-based CMS such as TinaCMS keeps content in `data/products.json`, so there
is no export step at all — the file is already the export. Sanity holds
content in its own hosted store, so it takes one extra command,
`sanity dataset export`, which yields NDJSON plus the asset files. Neither is
lock-in; the data is ours in both cases.

**Adding a CMS pays down part of the Shopify migration rather than
duplicating it.** `lib/catalog.ts` is synchronous today, so any CMS forces its
functions async and every page updated to `await` them — about nine call
sites, and the bulk of the mechanical work. Once that is done, swapping the
CMS for the Storefront API is a rewrite of one file with no ripple at all. The
CMS step is the first half of the Shopify step, not a detour from it. This is
a further reason the "two systems" objection in item 5 was overstated.

**WordPress would be a rebuild, not a port.** The content itself moves fine —
WordPress has a REST API and importer plugins accept JSON or CSV — but the
design gets rebuilt inside a theme, the seasonal logic rewritten in PHP, and
the pages recreated in the block editor. Nothing carries over except words and
pictures. Note also that WooCommerce defaults to `/product/<slug>` singular,
so permalinks would need configuring or every product URL breaks.

**Disciplines to adopt now, while they are free:**

- [ ] Never change a slug once a product is published. Redirects hang off
      them, and being disciplined about it costs nothing today.
- [ ] Keep the original full-resolution photos somewhere separate from the
      web-sized files in `public/products/`. Every platform does its own
      resizing and will want the originals.
- [ ] Settle the variant question (item 2) before photographing or writing up
      any more products.
- [ ] Add a SKU field even though nothing reads it yet, so records reconcile
      after a move.
- [ ] Keep pricing and stock logic out of the frontend — that is the first
      thing a platform will want to own.

**On "scalable": it will not be scale that forces the move.** A statically
built site on Vercel serves pre-rendered pages from the edge, so a hundred
visitors and a hundred thousand cost the same and perform the same. The
reasons to move are all capability — card payments, real stock tracking, order
management, and giving Kim a system with support behind it. Framing the
trigger as "when it outgrows Vercel" would mean waiting for a signal that
never fires; use the enquiry-volume trigger below instead.

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
is new; it costs nothing and defers the decision. Then move on when enquiry
volume justifies it. Skip (b) entirely — a spreadsheet is the worst of both
worlds on images, which are the actual bottleneck.

**Amended 5 September 2026.** This item originally argued against (c) on the
grounds that Kim would learn a custom CMS only to have to learn Shopify's
admin a year later, so we would be teaching her two systems instead of one.
That objection is weaker than it was written. A hosted CMS product form and a
Shopify product form are both "fields plus a photo drop zone", so most of what
she learns transfers. Option (c) is now costed properly in item 7 and reads as
a reasonable interim step rather than wasted effort. What the original
objection does still rule out is a hand-built admin interface, which would be
unlike anything else she will ever use — see item 7, option 3.

**On inventory specifically:** note that stock and seasonal availability are
different things and the site currently only models the second. A piece can be
in season but sold out, or out of season with one left over from last year. If
Kim is losing track of what is physically on the shelf, that is the strongest
argument for moving to (d) sooner.

**Decisions needed:**

- [ ] How often does Kim expect to add or change products? This single answer
      decides between (a), (c) and (d) — see item 7 for what (c) really costs.
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
so it is cheap and easy to host. **Vercel was decided on 5 September 2026** —
see the recommendation below. The domain is still not pointed at it.

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

**Decided: (a) Vercel.** It is free, it is the least work, and it forecloses
nothing — if Kim later moves to a full Shopify theme the domain just gets
repointed, and the photos, copy and product data are all files in the
repository. There is no lock-in to worry about.

**On the free tier's licence.** Vercel's Hobby plan is licensed for personal,
non-commercial use, which is worth knowing because a shop looks commercial at
a glance. It is fine here: this is a CSR project and the site takes no money,
since the only conversion action is a WhatsApp enquiry. If payments ever
arrive they arrive on Shopify, on a paid Shopify plan, so the question
resolves itself rather than needing Vercel Pro at $20 a month. Revisit only if
this site itself starts transacting.

**Decisions needed:**

- [ ] Confirm where the domain is registered, and who holds the login. This
      matters more than it sounds: losing access to a registrar account is a
      genuinely painful problem.
- [x] Decide the host — Vercel
- [ ] Create the Vercel account in Kim's name, or a shared account she can
      access, not a personal one she cannot
- [ ] Set up a `www` to apex redirect, or pick one and stick to it
- [ ] Decide whether to put the site behind a holding page first, so the
      domain resolves to something while content is still being gathered
- [ ] Set up email on the domain if `hello@sewingmum.com` is to be real — it
      is currently a placeholder in `lib/site.ts` and goes nowhere
- [ ] Create the Google Business Profile, so the "Write a Google review" link
      on the reviews page can be filled in. It is stubbed out and shows
      "coming soon" until then.

---

## 7. Giving Kim an admin login on Vercel

**Why it matters:** this is item 5's option (c), costed properly. The question
was whether Kim could log into an admin account and upload or replace product
photos herself while the site stays on Vercel. She can, but not in the obvious
way, and the reason is worth writing down before anyone tries.

**The constraint that shapes every option.** On Vercel the site's filesystem is
read-only, and `public/products/` is baked in when the site builds — anything
written there at runtime would be wiped by the next deploy. So an upload form
has nowhere to put the photo. Every option below is really an answer to the
question "where does the photo live instead", and that choice is what drives
the effort.

**A second, smaller wrinkle.** `ProductImage` in `lib/catalog.ts` requires
`width` and `height`. Kim will not know a photo's pixel dimensions, so
whatever she uploads through has to work them out on her behalf. Hosted image
services do this automatically; a hand-built form has to be told to.

**Option 1 — a hosted CMS (Sanity or similar). Recommended.** Kim goes to
`sewingmum.com/studio`, logs in with Google, and gets a real product form:
type the name, drag in photos, reorder them, tick "seasonal", press publish.
Changes reach the live site within seconds through a revalidation webhook, so
there is no rebuild to wait for.

- Effort: roughly four to six focused days for someone comfortable in this
  stack. A day for the schema, half a day to mount and lightly style the
  studio, a day to rewrite `lib/catalog.ts` to read from the CMS instead of
  the JSON file, half a day to migrate the nine products and their photos,
  half a day for the revalidation webhook, then testing and a one-page
  illustrated guide for Kim — which matters more than any of the code.
- Cost: nothing. Sanity's free plan covers 20 seats, 10,000 documents, 100GB
  of asset storage and 100GB of monthly bandwidth (checked September 2026,
  worth re-checking before committing). Nine products at five photos each is a
  rounding error against that, so total running cost stays at the domain
  renewal.
- Caveat: the free plan offers only Administrator and Viewer roles, so Kim
  would be an admin and could in principle delete things. Acceptable for a
  single trusted owner. The restricted Editor role costs $15 per seat per
  month if we ever want that guardrail.
- The real win is that authentication becomes someone else's problem. No
  password storage, no session bugs, no security for us to own.
- Kim never touches GitHub. Her photo goes from her phone straight to the
  CMS's own servers, and the site reads it from there at request time. The
  repository is only ever touched by whoever maintains the code.

**Option 2 — a git-based CMS (Pages CMS, Decap, TinaCMS).** Much the same form
for Kim, but saving commits to the repository and Vercel rebuilds. Photos stay
in `public/products/`, `products.json` stays the source of truth, and
`lib/catalog.ts` does not change at all.

- Effort: one to three days, mostly configuration.
- Cost: nothing.
- Why not, for Kim specifically: Decap and Pages CMS authenticate her as a
  GitHub user, since the commit is made under her own identity, so she would
  need a GitHub account — an odd thing to ask a non-technical person to
  maintain. TinaCMS avoids that: TinaCloud's own GitHub app makes the commit,
  editors sign in with just an email address, and only the person who first
  links the repository needs GitHub. The objection that survives for all
  three is that the git model leaks. Saving triggers a rebuild, so a change
  takes a minute or two to appear, and if that build fails her change simply
  does not show up, with nothing to tell her why. A hosted CMS either saves
  or shows her an error.

**Option 3 — build the admin ourselves.** Login with Auth.js, photos in Vercel
Blob, product data in a small database. This is the literal answer to the
original question, and it is the one to avoid.

- Effort: realistically two to four weeks to reach something she cannot
  accidentally break. Beyond the login that means upload progress, file type
  and size validation, dimension extraction, multi-image reordering, edit and
  delete with confirmations, sensible error messages, and a phone-first layout
  because a phone is where she will actually do this. Then password resets,
  which is where hand-rolled auth usually turns nasty.
- Cost: also near nothing in money. Vercel Blob's free tier covers 1GB of
  storage, 2,000 uploads a month and 10GB of transfer; Neon or Supabase will
  hold the data free. The whole cost is time and risk.
- Why not: a month spent rebuilding, worse, what option 1 gives free in a
  week — and we would then own the security of a public login form
  indefinitely.

**Two costs that are not money.**

- `lib/catalog.ts` is synchronous today. Reading from a CMS makes its
  functions async, so every page calling them needs `await` — about nine call
  sites. Mechanical, but it touches most of the app, so budget for it rather
  than being surprised by it.
- `AGENTS.md` states "no database, no backend, no auth" as a hard rule.
  Options 1 and 3 break it deliberately. The rule needs amending at the moment
  we commit, so that future work does not keep arguing against a decision
  already made.

**Recommendation: launch first, then option 1 when the need is real.** Get the
real photos, copy and WhatsApp number in, point the domain, and let Kim send
changes on WhatsApp for the first month or two. That costs nothing, works
today, and tells us the one thing we do not currently know: how often she
actually changes anything. Building an admin now also means her first use of
it would be the initial content upload, which needs hand-holding regardless.
Then add option 1 once she is changing products more than about once a month,
or when relaying changes through someone else starts to grate on either side.

**On the pilot-then-Shopify reasoning.** The overall plan — pilot on Vercel,
move to Shopify when volume justifies it — is sound. Vercel costs nothing,
commits us to nothing, and the eventual move is a DNS change plus re-uploading
photos. One correction: "when transactions are high" is not a usable trigger,
because a WhatsApp-enquiry site has no transactions and nothing counts them.
Use the trigger already agreed in item 3 instead: roughly ten enquiries a
week, or Kim losing track of what is sold.

**Worth pricing before deciding.** Going to Shopify Basic now, around $29–39 a
month, as the back office from day one with this site as the shop window, is
the only path where Kim ever learns one system instead of two, and it brings
payments whenever she wants them. The trade is paying monthly before we know
whether the shop earns anything, which for a CSR pilot may or may not be
acceptable.

**Decisions needed:**

- [ ] Confirm the sequence: launch on WhatsApp updates first and add the CMS
      later, or build the CMS before launch anyway
- [ ] If the CMS is wanted, confirm Sanity over the git-based alternatives
- [ ] Decide who holds the CMS admin account, and who the fallback is if Kim
      is locked out — the same question as the registrar login in item 6
- [ ] Price Shopify Basic from day one against an interim CMS, and decide
      whether paying monthly before any revenue is acceptable here
- [ ] Amend the `AGENTS.md` hard rules at the point we commit to a CMS

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
