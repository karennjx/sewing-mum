import Image from "next/image";
import Link from "next/link";
import { EnquireButton } from "@/components/enquire-button";
import {
  CurvedArrow,
  Heart,
  PromiseIcon,
  Squiggle,
  WaveEdge,
} from "@/components/ornaments";
import type { PromiseMark } from "@/components/ornaments";
import { StarRating } from "@/components/star-rating";
import { getCategories, getCategoryImage } from "@/lib/catalog";
import { getAverageRating, getFeaturedReviews } from "@/lib/reviews";

const CORPORATE_SAMPLES = [
  {
    src: "/corporate/brand-on-piece.jpg",
    alt: "A black cherry blossom brocade bag with a red trim, lettered with a client's brand name",
    width: 1153,
    height: 1178,
  },
  {
    src: "/corporate/co-branded-label.jpg",
    alt: "A coral cotton piece with a client's woven label sewn on beside the Sewing Mums label",
    width: 833,
    height: 832,
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
 * The two pieces propped over the corner of the hero photograph.
 *
 * Studio shots supplied for the banner, deliberately not wired into the
 * catalogue: they are the same owl and the same trio bundle those product pages
 * already sell, but Kim asked to keep them to the banner for now, so those
 * pages keep their own photographs.
 */
const BANNER_CARDS = [
  {
    src: "/home/banner-trio-bundle.jpg",
    alt: "The trio bundle in a blue mandala print — a snap wallet, a flap pouch and a strapped cup carrier holding a tumbler, on a wooden board",
    width: 819,
    height: 1024,
  },
  {
    src: "/home/banner-patchwork-owl.jpg",
    alt: "The patchwork owl, with a wave-print head, red felt eyes, polka dot sides and a red floral belly, sitting on a cream knitted throw",
    width: 819,
    height: 1024,
  },
];

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
    body: "Pieces with a price can go in the cart and be paid by PayNow. For everything else, tell us what caught your eye on WhatsApp and we will sort out sizing, fabric and delivery together.",
  },
];

export default function Home() {
  const categories = getCategories();
  const reviews = getFeaturedReviews().slice(0, 3);
  const averageRating = getAverageRating();

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-linen/70 via-linen/20 to-cream">
        <div className="mx-auto grid max-w-5xl items-center gap-9 px-5 pt-10 pb-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.14fr)] lg:gap-10 lg:pt-16 lg:pb-14">
          <div>
            <p className="text-xs tracking-[0.2em] text-berry uppercase">
              A Singapore social enterprise
            </p>
            <h1 className="font-display mt-5 text-4xl leading-[1.1] font-semibold tracking-tight text-ink sm:text-5xl">
              Beautiful things, made by mothers{" "}
              <span className="relative inline-block whitespace-nowrap">
                at home
                <Squiggle className="absolute -bottom-2.5 left-0 h-3 w-full text-rose" />
              </span>
            </h1>
            <p className="mt-11 max-w-lg text-lg leading-relaxed text-muted">
              Fabric crafts, toys, games and good-to-haves &mdash; every one of
              them sewn at home, by hand, by a mother who needs the work.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/products"
                className="inline-flex items-center rounded-full bg-berry px-6 py-3 font-medium text-cream transition-colors hover:bg-berry-dark"
              >
                See what&rsquo;s available
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
              rather than rounded corners, so the photo edges stay square. The
              top padding reserves room for the handwritten aside, which is
              absolutely placed so it sits against the photo's top edge. */}
          <div className="relative lg:-ml-6 lg:pt-14">
            <div className="absolute top-0 right-6 z-20 hidden lg:block">
              <div className="relative">
                <p className="font-hand -rotate-3 text-2xl leading-tight text-berry">
                  Made with love
                  <br />
                  at home
                </p>
                <Heart className="absolute -top-1 -right-6 h-4 w-4 text-rose" />
                <CurvedArrow className="absolute -right-3 -bottom-8 h-10 w-8 text-rose-soft" />
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
                sizes="(min-width: 1024px) 560px, 100vw"
                loading="eager"
                fetchPriority="high"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Portrait shots, so the frames keep 4:5 rather than cropping
                square. Desktop only: below lg the hero stacks and the photo
                runs nearly full width, where these overhang the screen edge
                and crowd the band beneath. */}
            <div className="absolute -bottom-6 right-20 z-10 hidden w-36 rotate-[-5deg] bg-white p-2 shadow-lg lg:block">
              <Image
                src={BANNER_CARDS[0].src}
                alt={BANNER_CARDS[0].alt}
                width={BANNER_CARDS[0].width}
                height={BANNER_CARDS[0].height}
                sizes="144px"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <div className="absolute -right-6 -bottom-7 z-10 hidden w-32 rotate-[6deg] bg-white p-2 shadow-lg lg:block">
              <Image
                src={BANNER_CARDS[1].src}
                alt={BANNER_CARDS[1].alt}
                width={BANNER_CARDS[1].width}
                height={BANNER_CARDS[1].height}
                sizes="128px"
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
        <WaveEdge className="absolute bottom-0 left-0 block h-6 w-full text-linen/60 sm:h-8" />
      </section>

      <section className="bg-linen/60">
        <div className="mx-auto max-w-5xl px-5 pt-10 pb-12">
          <div className="relative grid gap-9 sm:grid-cols-3 sm:gap-8">
            {/* Stitched through the three icons. Each icon sits on a cream
                disc, which breaks the line where it passes behind. */}
            <div
              aria-hidden="true"
              className="absolute top-7 right-[16%] left-[16%] hidden border-t-2 border-dashed border-rose-soft sm:block"
            />
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
