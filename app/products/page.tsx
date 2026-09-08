import type { Metadata } from "next";
import { EnquireButton } from "@/components/enquire-button";
import { ProductCard } from "@/components/product-card";
import { getCategories, getProductsByCategory } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Fabric crafts, toys, games and good-to-haves, sewn at home by single mothers in Singapore. Browse what is made all year round and what only comes out in its season.",
};

export default function ProductsPage() {
  const categories = getCategories();

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:py-16">
      <header className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink">
          Everything we make
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Every piece is pieced by hand from whatever fabric is in the basket,
          so no two come out the same and sizes vary. Send a message and we
          will tell you what is finished, what it costs, and how soon it could
          be ready. Seasonal pieces are marked with the months they are made
          in.
        </p>
      </header>

      {categories.map((category) => {
        const products = getProductsByCategory(category.slug);

        return (
          <section
            key={category.slug}
            id={category.slug}
            className="mt-14 scroll-mt-28"
          >
            <div className="border-b border-linen-dark/60 pb-4">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
                {category.label}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                {category.blurb}
              </p>
            </div>
            {products.length > 0 ? (
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            ) : (
              <p className="mt-6 rounded-card border border-linen-dark/60 bg-linen/40 px-5 py-4 text-sm leading-relaxed text-muted">
                Nothing listed here at the moment. These pieces are made to
                order in the run-up to the festival, so send a message and we
                will tell you what is planned this year.
              </p>
            )}
          </section>
        );
      })}

      <section className="mt-16 rounded-card border border-linen-dark/60 bg-linen/50 p-8 text-center">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
          Not quite what you had in mind?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted">
          Most pieces can be made in a different fabric or size, and commissions
          are welcome when the sewing pile allows. Tell us what you are picturing.
        </p>
        <div className="mt-6">
          <EnquireButton size="sm" label="Ask about a commission" />
        </div>
      </section>
    </div>
  );
}
