import type { Metadata } from "next";
import Image from "next/image";
import { EnquireButton } from "@/components/enquire-button";
import { getFeaturedProducts } from "@/lib/catalog";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our story",
  description:
    "How Sewing Mum started, how each piece is made, and why there is no checkout button on this website.",
};

const STEPS = [
  {
    title: "Fabric first",
    body: "Most pieces start with a length of fabric rather than a plan. Offcuts from a bag become a bunny; a batik panel too good to cut up decides what bag it wants to be.",
  },
  {
    title: "Cut and pieced by hand",
    body: "Patchwork is laid out on the table and rearranged until it looks right. This is the slow part, and the reason no two pieces come out identical.",
  },
  {
    title: "Sewn to be used",
    body: "Seams are doubled, handles are bar-tacked, faces are embroidered rather than glued. The test is whether it survives a toddler or a year of commuting.",
  },
  {
    title: "Finished and photographed",
    body: "Each piece is pressed, checked over, and photographed as it actually is, so what arrives is what you saw.",
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
          A sewing machine, a box of offcuts, and too many ideas
        </h1>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-5 lg:gap-14">
        <div className="space-y-5 text-lg leading-relaxed text-muted lg:col-span-3">
          <p>
            {site.name} started the way these things usually do: with a bag made
            for myself, then one for a friend, then one for her sister, until
            the requests outgrew the evenings I had free. What began as a way to
            use up a growing pile of fabric offcuts turned into something
            people were willing to wait a fortnight for.
          </p>
          <p>
            The initiative is deliberately small. I make in ones and twos rather
            than dozens, which means I can take on a request for a different
            fabric, a longer strap, or a name embroidered on the foot of an
            elephant. It also means some things sell out and take a while to
            come back.
          </p>
          <p>
            A few pieces are seasonal by nature. Mid-Autumn rabbits, Christmas
            bundles and the like are made for a few weeks and then put away
            until the following year. They are still listed here all year round,
            so you know what to look forward to, with the months they are made
            in marked on each one.
          </p>
          <p>
            There is no checkout on this site, and that is a choice rather than
            an oversight. Half of the messages I get are questions about sizing,
            fabric or timing, and those are much better answered in a
            conversation than guessed at in a shopping cart.
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
          How a piece gets made
        </h2>
        <ol className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.title}>
              <span className="font-display text-3xl font-semibold text-linen-dark">
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
          Questions are welcome
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted">
          Whether it is about a fabric, a delivery date or a commission you have
          been thinking about, the fastest way to an answer is a message.
        </p>
        <div className="mt-6">
          <EnquireButton size="sm" />
        </div>
      </section>
    </div>
  );
}
