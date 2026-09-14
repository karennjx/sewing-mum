import Image from "next/image";
import Link from "next/link";
import { EnquireButton } from "@/components/enquire-button";
import { ProductCard } from "@/components/product-card";
import { StarRating } from "@/components/star-rating";
import {
  getCategories,
  getFeaturedProducts,
  getHeroProducts,
} from "@/lib/catalog";
import { getAverageRating, getFeaturedReviews } from "@/lib/reviews";
import { site } from "@/lib/site";

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

const PROMISES = [
  {
    title: "Made by mothers at home",
    body: "Single mothers with medical conditions, or caring for a child with chronic illness, for whom work outside the home is not possible.",
  },
  {
    title: "Every order is a wage",
    body: "Through sewing projects the mothers earn a livelihood as independent contributors. Buying a piece is the support, not a donation on top of it.",
  },
  {
    title: "Just send a message",
    body: "No cart, no checkout. Tell us what caught your eye on WhatsApp and we will sort out sizing, fabric and delivery together.",
  },
];

export default function Home() {
  const featured = getFeaturedProducts();
  const categories = getCategories();
  const reviews = getFeaturedReviews().slice(0, 3);
  const averageRating = getAverageRating();
  // Hero products are flagged separately from the featured ones, so these two
  // photos are not the same photos the visitor meets again in Favourites.
  const hero = getHeroProducts();
  const heroImage = hero[0].images[0];
  const secondaryImage = hero[1].images[0];

  return (
    <>
      <section className="mx-auto grid max-w-5xl items-center gap-10 px-5 pt-12 pb-16 lg:grid-cols-2 lg:gap-16 lg:pt-20">
        <div>
          <p className="text-xs tracking-[0.2em] text-berry uppercase">
            A Singapore social enterprise
          </p>
          <h1 className="font-display mt-4 text-4xl leading-tight font-semibold tracking-tight text-ink sm:text-5xl">
            Handmade by mothers who cannot leave home to work
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">
            {site.name} helps single mothers in Singapore earn a livelihood
            through sewing. Fabric crafts, toys, games and good-to-haves, every
            one of them made at home, by hand, by a mother who needs the work.
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
              className="inline-flex items-center rounded-full border border-linen-dark px-6 py-3 font-medium text-ink transition-colors hover:border-berry hover:text-berry"
            >
              Our story
            </Link>
          </div>
          {reviews.length > 0 ? (
            <div className="mt-8 flex items-center gap-3">
              <StarRating rating={averageRating} />
              <p className="text-sm text-muted">
                {averageRating} average from customers who came back to tell us
              </p>
            </div>
          ) : null}
        </div>

        {/* Equal columns with a shared aspect: the photos are a mix of
            portrait and landscape, and unequal columns let the tall one
            stretch the row and squash the wide one. */}
        <div className="grid grid-cols-2 gap-4">
          <div className="aspect-square overflow-hidden rounded-card bg-linen">
            <Image
              src={heroImage.src}
              alt={heroImage.alt}
              width={heroImage.width}
              height={heroImage.height}
              sizes="(min-width: 1024px) 280px, 45vw"
              loading="eager"
              fetchPriority="high"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="mt-10 aspect-square overflow-hidden rounded-card bg-linen">
            <Image
              src={secondaryImage.src}
              alt={secondaryImage.alt}
              width={secondaryImage.width}
              height={secondaryImage.height}
              sizes="(min-width: 1024px) 280px, 45vw"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-linen-dark/60 bg-linen/40">
        <div className="mx-auto grid max-w-5xl gap-8 px-5 py-14 sm:grid-cols-3">
          {PROMISES.map((promise) => (
            <div key={promise.title}>
              <h2 className="font-display text-lg font-semibold text-ink">
                {promise.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {promise.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">
          What we make
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/products#${category.slug}`}
              className="group rounded-card border border-linen-dark/60 bg-white p-6 transition-shadow hover:shadow-md"
            >
              <h3 className="font-display text-xl font-semibold text-ink group-hover:text-berry">
                {category.label}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {category.blurb}
              </p>
              <span className="mt-4 inline-block text-sm font-medium text-berry">
                Browse {category.label.toLowerCase()} &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">
            Favourites
          </h2>
          <Link
            href="/products"
            className="text-sm font-medium text-berry hover:text-berry-dark"
          >
            See everything &rarr;
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
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
                className="aspect-square overflow-hidden rounded-card bg-linen"
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
          There is no checkout here on purpose. Send a message, and what you
          buy goes straight back to the mother who made it.
        </p>
        <div className="mt-8">
          <EnquireButton />
        </div>
      </section>
    </>
  );
}
