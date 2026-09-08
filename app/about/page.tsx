import type { Metadata } from "next";
import Image from "next/image";
import { EnquireButton } from "@/components/enquire-button";
import { getFeaturedProducts } from "@/lib/catalog";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our story",
  description:
    "Sewing Mums is a social enterprise run by Kim, helping single mothers in Singapore earn a livelihood through sewing.",
};

const HOW_IT_WORKS = [
  {
    title: "Mothers who cannot leave home to work",
    body: "Single mothers with medical conditions, or caring for a child with chronic illness, for whom employment outside the home is not possible.",
  },
  {
    title: "Sewing projects they can take on at home",
    body: "Fabric crafts, toys, games and good-to-haves, made in their own time and at their own pace.",
  },
  {
    title: "Income, not charity",
    body: "Through these projects they earn a livelihood as independent contributors, and with it the confidence that financial independence brings.",
  },
];

export default function AboutPage() {
  const featured = getFeaturedProducts();
  const image = featured[0].images[0];

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:py-16">
      <header className="max-w-2xl">
        <p className="text-xs tracking-[0.2em] text-berry uppercase">
          Our story
        </p>
        <h1 className="font-display mt-4 text-4xl leading-tight font-semibold tracking-tight text-ink">
          A social enterprise, not a shop
        </h1>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-5 lg:gap-14">
        <div className="space-y-5 text-lg leading-relaxed text-muted lg:col-span-3">
          <p>
            {site.name} is a Social Enterprise run by {site.founder} to help
            single mothers in Singapore with challenges most of us cannot begin
            to imagine.
          </p>
          <p>
            {site.name} helps single mothers with medical conditions or looking
            after a child with chronic illness, who are unable to seek
            employment outside their homes. Through sewing projects, they are
            able to earn a livelihood as independent contributors.
          </p>
          <p>
            What better way to build confidence and empower these women to
            attain financial independence.
          </p>
          <p>
            Their stories of struggle and sacrifice are stories that should be
            shared and {site.founder} has done just that.
          </p>
          <p>
            With our line-up of fabric crafts, toys, games and good-to-haves,
            everyone can help shed some light on these forgotten members of our
            society and provide these incredible mothers the support they so
            desire and need.
          </p>
        </div>

        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-card bg-linen">
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="(min-width: 1024px) 380px, 92vw"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      <section className="mt-16 border-t border-linen-dark/60 pt-10">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
          How it works
        </h2>
        <ol className="mt-8 grid gap-8 sm:grid-cols-3">
          {HOW_IT_WORKS.map((step, index) => (
            <li key={step.title}>
              <span className="font-display text-3xl font-semibold text-rose-soft">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display mt-2 text-lg font-semibold text-ink">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16 rounded-card border border-linen-dark/60 bg-linen/50 p-8 text-center">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
          Corporate gifts and one-offs
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted">
          Bulk orders for corporate gifting, event favours and Christmas
          presents are some of the most useful work we can pass on to the
          mothers. Tell us what you need and by when.
        </p>
        <div className="mt-6">
          <EnquireButton size="sm" label="Talk to us about an order" />
        </div>
      </section>
    </div>
  );
}
