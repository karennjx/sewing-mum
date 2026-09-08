import Image from "next/image";
import Link from "next/link";
import { EnquireButton } from "@/components/enquire-button";
import { ProductCard } from "@/components/product-card";
import { StarRating } from "@/components/star-rating";
import { getCategories, getFeaturedProducts } from "@/lib/catalog";
import { getAverageRating, getFeaturedReviews } from "@/lib/reviews";
import { site } from "@/lib/site";

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
  const heroImage = featured[0].images[0];
  const secondaryImage = featured[1].images[0];

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
          <div className="mt-8 flex items-center gap-3">
            <StarRating rating={averageRating} />
            <p className="text-sm text-muted">
              {averageRating} average from customers who came back to tell us
            </p>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-3 overflow-hidden rounded-card bg-linen">
            <Image
              src={heroImage.src}
              alt={heroImage.alt}
              width={heroImage.width}
              height={heroImage.height}
              sizes="(min-width: 1024px) 340px, 55vw"
              priority
              className="h-full w-full object-cover"
            />
          </div>
          <div className="col-span-2 mt-8 overflow-hidden rounded-card bg-linen">
            <Image
              src={secondaryImage.src}
              alt={secondaryImage.alt}
              width={secondaryImage.width}
              height={secondaryImage.height}
              sizes="(min-width: 1024px) 220px, 35vw"
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
