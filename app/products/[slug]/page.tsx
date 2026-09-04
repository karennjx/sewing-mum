import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AvailabilityBadge } from "@/components/availability-badge";
import { EnquireButton } from "@/components/enquire-button";
import { StarRating } from "@/components/star-rating";
import {
  formatPrice,
  getAllProducts,
  getCategory,
  getProductBySlug,
  isSeasonal,
  seasonWindowLabel,
} from "@/lib/catalog";
import { getReviewsForProduct } from "@/lib/reviews";

export function generateStaticParams() {
  return getAllProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata(
  props: PageProps<"/products/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: "Product not found" };
  }

  return {
    title: product.name,
    description: product.blurb,
    openGraph: {
      title: product.name,
      description: product.blurb,
      images: [{ url: product.images[0].src }],
    },
  };
}

export default async function ProductPage(
  props: PageProps<"/products/[slug]">,
) {
  const { slug } = await props.params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const category = getCategory(product.category);
  const image = product.images[0];
  const seasonWindow = seasonWindowLabel(product);
  const reviews = getReviewsForProduct(product.slug);

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 lg:py-14">
      <nav className="text-sm text-muted">
        <Link href="/products" className="hover:text-berry">
          Products
        </Link>
        <span className="px-2">/</span>
        <Link href={`/products#${category.slug}`} className="hover:text-berry">
          {category.label}
        </Link>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="overflow-hidden rounded-card bg-linen">
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="(min-width: 1024px) 480px, 92vw"
            priority
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <h1 className="font-display text-3xl leading-tight font-semibold tracking-tight text-ink sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-3 text-2xl font-medium text-ink">
            {formatPrice(product.price)}
          </p>
          <div className="mt-4">
            <AvailabilityBadge product={product} />
          </div>

          {isSeasonal(product) && seasonWindow ? (
            <p className="mt-4 rounded-card border border-gold/30 bg-gold/10 px-4 py-3 text-sm leading-relaxed text-ink">
              A seasonal piece, made only from {seasonWindow}. Enquire out of
              season and you will be first on the list when the next batch
              starts.
            </p>
          ) : null}

          <div className="mt-6 space-y-4">
            {product.description.map((paragraph) => (
              <p key={paragraph} className="leading-relaxed text-muted">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-8">
            <EnquireButton product={product} />
            <p className="mt-3 text-xs text-muted">
              Opens WhatsApp with this piece already mentioned, so you do not
              have to explain which one you meant.
            </p>
          </div>

          <div className="mt-8 border-t border-linen-dark/60 pt-6">
            <h2 className="text-xs tracking-wider text-muted uppercase">
              The details
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink">
              {product.details.map((detail) => (
                <li key={detail} className="flex gap-2">
                  <span aria-hidden="true" className="text-berry">
                    &middot;
                  </span>
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {reviews.length > 0 ? (
        <section className="mt-16 border-t border-linen-dark/60 pt-10">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
            What people said about this one
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {reviews.map((review) => (
              <blockquote
                key={review.id}
                className="rounded-card border border-linen-dark/60 bg-white p-6"
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
        </section>
      ) : null}
    </div>
  );
}
