import type { Metadata } from "next";
import Link from "next/link";
import { EnquireButton } from "@/components/enquire-button";
import { Heart, Squiggle, WaveEdge } from "@/components/ornaments";
import { ProductCard } from "@/components/product-card";
import { getCategories, getProductsByCategory } from "@/lib/catalog";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Fabric crafts, toys, games and good-to-haves, sewn at home by single mothers in Singapore. Browse what is made all year round and what only comes out in its season.",
};

const COMMISSION_MESSAGE = `Hi ${site.name}! I came from your website. I am after something a little different from what is listed — could we talk about a custom piece?`;

export default function ProductsPage() {
  const categories = getCategories();

  return (
    <>
      {/* Centred rather than the two-column hero the other pages use. Those
          lead with a photograph; the thing to look at here is the grid below,
          and putting one product's photo at the top would only pick a favourite
          out of fifteen. */}
      <section className="relative overflow-hidden bg-gradient-to-b from-linen/70 via-linen/20 to-cream">
        <div className="animate-rise mx-auto max-w-3xl px-5 py-12 text-center lg:py-16">
          <p className="text-xs tracking-[0.2em] text-berry uppercase">
            Handmade in Singapore
          </p>
          <h1 className="font-display mt-4 text-4xl leading-[1.1] font-semibold tracking-tight text-ink sm:text-5xl">
            Everything{" "}
            <span className="relative inline-block">
              we make
              <Squiggle className="absolute -bottom-2.5 left-0 h-3 w-full text-rose" />
              {/* Off on the narrowest phones. The headline is centred and
                  "Everything we make" all but fills the line at 375px, so a
                  heart hung 28px past it lands outside the section and the
                  overflow clip cuts it in half. */}
              <Heart className="absolute -right-7 -bottom-4 hidden h-4 w-4 text-rose sm:block" />
            </span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted">
            Every piece is pieced by hand from whatever fabric is in the basket,
            so no two come out the same and sizes vary. Send a message and we
            will tell you what is finished, what it costs, and how soon it could
            be ready. Seasonal pieces are marked with the months they are made
            in.
          </p>

          {/* Three sections and fifteen pieces is a long scroll on a phone, so
              the headings are reachable from the top. */}
          <nav className="mt-8 flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <a
                key={category.slug}
                href={`#${category.slug}`}
                className="inline-flex items-center rounded-full border border-linen-dark bg-cream/60 px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-berry hover:text-berry"
              >
                {category.label}
              </a>
            ))}
          </nav>
        </div>

        <WaveEdge className="absolute bottom-0 left-0 block h-4 w-full text-linen/60 sm:h-5" />
      </section>

      {categories.map((category, index) => {
        const products = getProductsByCategory(category.slug);

        return (
          <section
            key={category.slug}
            id={category.slug}
            // The wave above resolves to linen, so the first band has to be the
            // linen one; the rest alternate off that.
            className={`scroll-mt-28 ${index % 2 === 0 ? "bg-linen/60" : "bg-cream"}`}
          >
            <div className="mx-auto max-w-5xl px-5 py-14 lg:py-16">
              <div className="grid gap-4 sm:grid-cols-2 sm:items-end sm:gap-8">
                <div>
                  <p className="text-xs tracking-[0.2em] text-berry uppercase">
                    {category.short}
                  </p>
                  <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-ink">
                    {category.label}
                  </h2>
                </div>
                <p className="leading-relaxed text-muted">{category.blurb}</p>
              </div>

              {products.length > 0 ? (
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((product) => (
                    <ProductCard key={product.slug} product={product} />
                  ))}
                </div>
              ) : (
                <p className="mt-8 border border-linen-dark/60 bg-cream px-5 py-4 text-sm leading-relaxed text-muted">
                  Nothing listed here at the moment. These pieces are made to
                  order in the run-up to the festival, so send a message and we
                  will tell you what is planned this year.
                </p>
              )}
            </div>
          </section>
        );
      })}

      {/* The commission offer and the corporate hand-off used to be two boxes at
          the foot of the page. They are the same thought — this list is not all
          of it, come and ask — so they close the page together in the band the
          other pages end on. */}
      <section className="bg-maroon text-cream">
        <div className="mx-auto max-w-3xl px-5 py-14 text-center">
          <Squiggle className="mx-auto h-4 w-24 text-rose/60" />
          <h2 className="font-display mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
            Not quite what you had in mind?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-linen/80">
            Most pieces can be made in a different fabric or size, and
            commissions are welcome when the sewing pile allows. Tell us what
            you are picturing.
          </p>
          <div className="mt-8">
            <EnquireButton
              variant="onMaroon"
              label="Ask about a commission"
              message={COMMISSION_MESSAGE}
            />
          </div>
          <p className="mt-6 text-sm text-linen/80">
            Buying for a company?{" "}
            <Link
              href="/corporate"
              className="font-medium text-cream underline decoration-rose/60 underline-offset-4 hover:decoration-cream"
            >
              See corporate &amp; CSR collaborations
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
