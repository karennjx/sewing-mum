import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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
          Who is {site.founder}?
        </h2>
        <div className="mt-6 max-w-3xl space-y-5 leading-relaxed text-muted">
          <p>
            Kim Underhill has been where these mothers are. She left school at
            fifteen to help with the family finances. At twenty-eight she found
            herself out of an abusive marriage with two children, aged five and
            one. At thirty-three she went back to school, and pushed through six
            years of night classes while raising them and holding a full-time
            job.
          </p>
          <p>
            She came out of it with a Masters in Industrial and Organisational
            Human Resource Psychology and more than twenty-five years in
            international business &mdash; managing Fortune 500 accounts, then
            senior roles leading organisational change. She now speaks, runs
            workshops and coaches through Ultimate Balance Consultancy, under a
            phrase she has built a career on: be the change, before change
            changes you.
          </p>
          <p>
            Sewing Mums grew out of that experience. Kim knows first-hand what
            it costs to raise children alone with no way to earn, and what
            actually helps is not sympathy but paid work that fits around a sick
            child and a home you cannot leave.
          </p>
        </div>
        <p className="mt-5 text-sm">
          <a
            href="https://www.kimunderhill.com/about"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-berry hover:text-berry-dark"
          >
            More about Kim &rarr;
          </a>
        </p>
      </section>

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
          Working with companies
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted">
          Bulk orders for corporate gifting, event door gifts and CSR programmes
          are some of the most useful work we can pass on to the mothers, and we
          can put your branding on the pieces.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/corporate"
            className="inline-flex items-center rounded-full bg-berry px-4 py-2 text-sm font-medium text-cream transition-colors hover:bg-berry-dark"
          >
            Corporate &amp; CSR
          </Link>
          <EnquireButton size="sm" label="Talk to us about an order" />
        </div>
      </section>
    </div>
  );
}
