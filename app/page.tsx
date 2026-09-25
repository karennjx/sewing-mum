import Image from "next/image";
import Link from "next/link";
import { EnquireButton } from "@/components/enquire-button";
import {
  Heart,
  PointerLine,
  PromiseIcon,
  Squiggle,
  WaveEdge,
} from "@/components/ornaments";
import type { PromiseMark } from "@/components/ornaments";
import { StarRating } from "@/components/star-rating";
import { StitchLine } from "@/components/stitch-line";
import {
  getCategories,
  getCategoryImage,
  getProductBySlug,
} from "@/lib/catalog";
import { getAverageRating, getFeaturedReviews } from "@/lib/reviews";

const CORPORATE_SAMPLES = [
  {
    src: "/corporate/brand-on-piece.jpg",
    alt: "A black cherry blossom brocade bag with a red trim and cord handles, lettered with a client's brand name",
    width: 819,
    height: 1024,
  },
  {
    src: "/corporate/co-branded-label.jpg",
    alt: "Three folded cotton pieces in different prints, each with a client's woven label sewn on beside the Sewing Mums label",
    width: 819,
    height: 1024,
  },
];

/**
 * One of the mothers at her machine, supplied by Kim with her permission. It is
 * the only photograph of a person on the site, and it is doing the work no
 * product shot can: showing whose hands these things come out of.
 */
const HERO_PHOTO = {
  src: "/home/aishah-sewing.jpg",
  alt: "One of the Sewing Mums at her sewing machine at home, guiding a length of red floral cotton under the needle, with folded stacks of print fabric on the table around her",
  width: 1024,
  height: 576,
};

/**
 * The two pieces propped over the corner of the hero photograph, in the order
 * they are stacked: the bundle in front, the owl behind it.
 *
 * These are the products' own lead photographs, read through the catalogue.
 * They used to be a separate pair of files under /home, on the understanding
 * that the banner wanted studio shots and the product pages had their own; once
 * the product pages took these same shots the two were byte-for-byte identical,
 * which is two copies to keep in step for no gain.
 */
const BANNER_CARDS = ["trio-bundle", "patchwork-owl"].map((slug) => {
  const product = getProductBySlug(slug);
  if (!product) {
    throw new Error(`Hero banner references a missing product: ${slug}`);
  }
  return product.images[0];
});

const PROMISES: readonly {
  mark: PromiseMark;
  title: string;
  body: string;
}[] = [
  {
    mark: "home",
    title: "Made by mothers at home",
    body: "Single mothers with medical conditions, or caring for a child with chronic illness, for whom work outside the home is not possible.",
  },
  {
    mark: "wage",
    title: "Every order is a wage",
    body: "Through sewing projects the mothers earn a livelihood as independent contributors. Buying a piece is the support, not a donation on top of it.",
  },
  {
    mark: "ask",
    title: "Buy it, or just ask",
    body: "Shop ready-made pieces, or speak to us about fabrics, sizing and custom orders.",
  },
];

export default function Home() {
  const categories = getCategories();
  const reviews = getFeaturedReviews().slice(0, 3);
  const averageRating = getAverageRating();

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-linen/70 via-linen/20 to-cream">
        <div className="mx-auto grid max-w-5xl items-center gap-9 px-5 pt-10 pb-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-10 lg:pt-16 lg:pb-14">
          <div className="animate-rise">
            <p className="text-xs tracking-[0.2em] text-berry uppercase">
              A Singapore social enterprise
            </p>
            <h1 className="font-display mt-5 text-4xl leading-[1.1] font-semibold tracking-tight text-ink sm:text-5xl">
              Beautiful things,{" "}
              {/* Held together on desktop. The photograph leaves the headline
                  about 380px, and "made by mothers" wants 375 of it, so the
                  natural wrap flips between two different three-line
                  arrangements on a few pixels of scrollbar. */}
              <span className="lg:whitespace-nowrap">made by mothers</span>{" "}
              <span className="relative inline-block whitespace-nowrap">
                at home
                <Squiggle className="absolute -bottom-2.5 left-0 h-3 w-full text-rose" />
              </span>
            </h1>
            <p className="mt-11 max-w-md text-lg leading-relaxed text-muted">
              Thoughtfully sewn gifts and everyday pieces that create flexible
              paid work for mothers in Singapore.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/products"
                className="inline-flex items-center rounded-full bg-berry px-6 py-3 font-medium text-cream transition-colors hover:bg-berry-dark"
              >
                Explore what we make &rarr;
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center rounded-full border border-linen-dark bg-cream/60 px-6 py-3 font-medium text-ink transition-colors hover:border-berry hover:text-berry"
              >
                Our story
              </Link>
            </div>
            {reviews.length > 0 ? (
              <div className="mt-8 flex items-center gap-3">
                <StarRating rating={averageRating} />
                <p className="text-sm text-muted">
                  {averageRating} average from customers who came back to tell
                  us
                </p>
              </div>
            ) : null}
          </div>

          {/* The photograph leads, with two pieces propped over the corner of
              it like prints left on a table. The frames are white padding
              rather than rounded corners, so the photo edges stay square.
              Pulled left into the gutter so it sits nearer the headline. */}
          <div className="relative lg:-ml-6">
            {/* On the photograph rather than above it. The top left of the frame
                is a flat sunlit wall — luminance 229, almost no variation —
                so berry ink reads cleanly there, which it would not over the
                window on the right. Sitting inside the frame also costs the
                column no height, which is what keeps the two sides level. */}
            <div className="absolute top-4 left-5 z-20 hidden lg:block">
              <div className="relative animate-rise [animation-delay:520ms]">
                <p className="font-hand -rotate-3 text-2xl leading-tight text-berry">
                  Made with love
                  <br />
                  at home
                </p>
                <Heart className="absolute -top-1 -right-6 h-4 w-4 text-rose" />
                <PointerLine className="absolute top-12 left-8 h-24 w-36 text-rose/80" />
              </div>
            </div>

            {/* The photograph is 16:9, which next to a tall column of text
                reads as a letterbox strip. Cropped to 3:2 it carries the
                column, and the trim comes off the sides she is not in. */}
            <div className="aspect-[3/2] overflow-hidden bg-linen shadow-sm">
              <Image
                src={HERO_PHOTO.src}
                alt={HERO_PHOTO.alt}
                width={HERO_PHOTO.width}
                height={HERO_PHOTO.height}
                sizes="(min-width: 1024px) 600px, 100vw"
                loading="eager"
                fetchPriority="high"
                className="animate-settle h-full w-full object-cover"
              />
            </div>

            {/* Portrait shots, so the frames keep 4:5 rather than cropping
                square. They overlap each other by design, and arrive a beat
                after the photograph. Desktop only: below lg the hero stacks and
                the photo runs nearly full width, where these overhang the
                screen edge and crowd the band beneath.

                The overlap is deliberately narrow, and the trio bundle sits on
                top of the owl rather than under it. The bundle's cup carrier
                runs to within a few percent of its own right edge, so anything
                lying over it hides a piece; the owl is centred with about a
                tenth of its frame clear on the left, which is the only side
                here with room to be covered. */}
            <div className="animate-rise absolute -bottom-6 right-28 z-20 hidden w-40 rotate-[-5deg] bg-white p-2 shadow-lg [animation-delay:280ms] lg:block">
              <Image
                src={BANNER_CARDS[0].src}
                alt={BANNER_CARDS[0].alt}
                width={BANNER_CARDS[0].width}
                height={BANNER_CARDS[0].height}
                sizes="160px"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <div className="animate-rise absolute -right-6 -bottom-7 z-10 hidden w-36 rotate-[6deg] bg-white p-2 shadow-lg [animation-delay:400ms] lg:block">
              <Image
                src={BANNER_CARDS[1].src}
                alt={BANNER_CARDS[1].alt}
                width={BANNER_CARDS[1].width}
                height={BANNER_CARDS[1].height}
                sizes="144px"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* The band below rising into the hero, rather than a ruled line. Same
            token and the same alpha as that band, so the two never mismatch. */}
        {/* Absolutely placed, so it sits inside the hero's bottom padding
            rather than adding its own height to it. In the flow it pushed the
            band a further 32px down and the gap after the buttons overshot. */}
        <WaveEdge className="absolute bottom-0 left-0 block h-4 w-full text-linen/60 sm:h-5" />
      </section>

      <section className="bg-linen/60">
        <div className="mx-auto max-w-5xl px-5 pt-7 pb-10">
          <div className="relative grid gap-8 sm:grid-cols-3">
            {/* Stitched through the three icons, and drawn on first sight.
                Each icon sits on a cream disc, which breaks the line where it
                passes behind. */}
            <StitchLine className="absolute top-7 right-[16%] left-[16%] hidden border-t-2 border-dashed border-rose-soft sm:block" />
            {PROMISES.map((promise) => (
              <div key={promise.title} className="relative text-center">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-cream text-berry ring-1 ring-rose-soft">
                  <PromiseIcon mark={promise.mark} className="h-7 w-7" />
                </span>
                <h2 className="font-display mt-3 text-lg font-semibold text-ink">
                  {promise.title}
                </h2>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted">
                  {promise.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pt-14 pb-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">
            What we make
          </h2>
          <Link
            href="/products"
            className="text-sm font-medium text-berry hover:text-berry-dark"
          >
            View all products &rarr;
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {categories.map((category) => {
            const image = getCategoryImage(category.slug);
            return (
              <Link
                key={category.slug}
                href={`/products#${category.slug}`}
                className="group flex flex-col border border-linen-dark/60 bg-white transition-shadow hover:shadow-md"
              >
                {image ? (
                  <div className="aspect-[4/3] overflow-hidden bg-linen">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      sizes="(min-width: 640px) 320px, 100vw"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                ) : null}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-xl font-semibold text-ink group-hover:text-berry">
                    {category.label}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {category.blurb}
                  </p>
                  <span className="mt-4 inline-block text-sm font-medium text-berry">
                    Browse {category.label.toLowerCase()} &rarr;
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* A dark band to stop the page reading as one long wash of cream. It is
          deliberately the only one: the maroon token earns its weight by being
          used here and then only in small doses elsewhere. Short, centred and
          edge to edge, on the same grid as every other section. */}
      <section className="bg-maroon text-cream">
        <div className="mx-auto max-w-5xl px-5 py-14 text-center">
          <Squiggle className="mx-auto h-4 w-24 text-rose/60" />
          <h2 className="font-display mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
            Small stitches. Brighter tomorrows.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-linen/80">
            Every purchase creates meaningful paid work for a mother in
            Singapore.
          </p>
          <Link
            href="/about"
            className="mt-8 inline-flex items-center rounded-full border border-rose/50 px-6 py-3 font-medium text-cream transition-colors hover:border-cream hover:bg-cream/10"
          >
            Learn more about our story &rarr;
          </Link>
        </div>
      </section>

      {/* Corporate buyers want a different conversation from retail visitors,
          so they get their own band here rather than a card in the catalogue. */}
      <section className="border-y border-linen-dark/60 bg-linen/40">
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-5 py-16 lg:grid-cols-5 lg:gap-14">
          <div className="lg:col-span-3">
            <p className="text-xs tracking-[0.2em] text-berry uppercase">
              Corporate &amp; CSR
            </p>
            <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight text-ink">
              Bringing your brand into it
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
              We customise pieces for companies &mdash; staff and client gifts,
              event door gifts, and runs made for a CSR programme. A bulk order
              is the steadiest work we can pass on to the mothers, and your
              branding can go on the piece itself or on a label sewn in beside
              ours.
            </p>
            <Link
              href="/corporate"
              className="mt-6 inline-flex items-center rounded-full bg-berry px-6 py-3 font-medium text-cream transition-colors hover:bg-berry-dark"
            >
              See what we can do for corporates
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:col-span-2">
            {CORPORATE_SAMPLES.map((sample) => (
              <div
                key={sample.src}
                className="aspect-square overflow-hidden bg-linen"
              >
                <Image
                  src={sample.src}
                  alt={sample.alt}
                  width={sample.width}
                  height={sample.height}
                  sizes="(min-width: 1024px) 200px, 45vw"
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {reviews.length > 0 ? (
        <section className="border-t border-linen-dark/60 bg-linen/40">
          <div className="mx-auto max-w-5xl px-5 py-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">
                In their words
              </h2>
              <Link
                href="/reviews"
                className="text-sm font-medium text-berry hover:text-berry-dark"
              >
                Read all reviews &rarr;
              </Link>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {reviews.map((review) => (
                <blockquote
                  key={review.id}
                  className="rounded-card border border-linen-dark/60 bg-cream p-6"
                >
                  <StarRating rating={review.rating} />
                  <p className="mt-3 text-sm leading-relaxed text-ink">
                    &ldquo;{review.quote}&rdquo;
                  </p>
                  <footer className="mt-4 text-xs text-muted">
                    {review.name} &middot; {review.location}
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">
          Seen something you like?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted">
          Pieces with a price can be bought here and paid by PayNow. For
          anything else, send a message. Either way, what you buy goes straight
          back to the mother who made it.
        </p>
        <div className="mt-8">
          <EnquireButton />
        </div>
      </section>
    </>
  );
}
