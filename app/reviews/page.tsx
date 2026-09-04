import type { Metadata } from "next";
import Link from "next/link";
import { StarRating } from "@/components/star-rating";
import { getProductBySlug } from "@/lib/catalog";
import {
  formatReviewDate,
  getAllReviews,
  getAverageRating,
  getReviewCount,
  sourceLabel,
} from "@/lib/reviews";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Customer voice",
  description:
    "What customers say about their handmade Sewing Mum pieces, and how to leave your own feedback.",
};

export default function ReviewsPage() {
  const reviews = getAllReviews();
  const averageRating = getAverageRating();
  const reviewCount = getReviewCount();

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:py-16">
      <header className="max-w-2xl">
        <p className="text-xs tracking-[0.2em] text-berry uppercase">
          Customer voice
        </p>
        <h1 className="font-display mt-4 text-4xl leading-tight font-semibold tracking-tight text-ink">
          What people say once they have lived with it
        </h1>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <StarRating rating={averageRating} />
          <p className="text-sm text-muted">
            {averageRating} out of 5, from {reviewCount} customers
          </p>
        </div>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          These are collected from messages, comments and Google reviews, and
          published with permission. Names are shortened because most people
          prefer it that way.
        </p>
      </header>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => {
          const product = getProductBySlug(review.productSlug);

          return (
            <blockquote
              key={review.id}
              className="flex flex-col rounded-card border border-linen-dark/60 bg-white p-6"
            >
              <StarRating rating={review.rating} />
              <p className="mt-3 flex-1 leading-relaxed text-ink">
                &ldquo;{review.quote}&rdquo;
              </p>
              <footer className="mt-5 border-t border-linen-dark/60 pt-4 text-xs text-muted">
                <p className="font-medium text-ink">{review.name}</p>
                <p className="mt-1">
                  {review.location} &middot; {formatReviewDate(review.date)}{" "}
                  &middot; {sourceLabel(review.source)}
                </p>
                {product ? (
                  <p className="mt-2">
                    on the{" "}
                    <Link
                      href={`/products/${product.slug}`}
                      className="text-berry hover:text-berry-dark"
                    >
                      {product.name}
                    </Link>
                  </p>
                ) : null}
              </footer>
            </blockquote>
          );
        })}
      </div>

      <section className="mt-16 border-t border-linen-dark/60 pt-12">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
          Leave your own feedback
        </h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted">
          If something you bought has held up well, or has not, {site.name}{" "}
          would like to hear about it. There are two ways to say so.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col rounded-card border border-linen-dark/60 bg-white p-6">
            <h3 className="font-display text-lg font-semibold text-ink">
              Message us directly
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
              Send a note and a photo on WhatsApp. With your permission it may
              appear on this page, with your name shortened.
            </p>
            <a
              href={whatsappLink(
                `Hi ${site.name}! I would like to share some feedback about a piece I bought.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center justify-center rounded-full bg-berry px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-berry-dark"
            >
              Share feedback on WhatsApp
            </a>
          </div>

          <div className="flex flex-col rounded-card border border-linen-dark/60 bg-white p-6">
            <h3 className="font-display text-lg font-semibold text-ink">
              Review us on Google
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
              A public review helps other people find a small maker they would
              otherwise never have come across.
            </p>
            {site.googleReviewUrl ? (
              <a
                href={site.googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center justify-center rounded-full border border-linen-dark px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-berry hover:text-berry"
              >
                Write a Google review
              </a>
            ) : (
              <p className="mt-5 rounded-full bg-linen px-5 py-2.5 text-center text-sm text-muted">
                Google review link coming soon
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
