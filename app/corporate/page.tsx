import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EnquireButton } from "@/components/enquire-button";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Corporate & CSR",
  description:
    "Handmade fabric gifts customised with your brand, for staff gifts, client gifts, event door gifts and CSR programmes. Every order is paid work for a single mother in Singapore.",
};

const ENQUIRY_MESSAGE = `Hi ${site.name}! I am writing on behalf of a company about corporate gifts / a CSR collaboration. Could we talk about what is possible?`;

const SAMPLES = [
  {
    client: "She Brilliance",
    title: "Your name on the piece itself",
    body: "For She Brilliance the name went directly onto the piece, here on a black cherry blossom brocade finished with a red trim and cord handles.",
    image: {
      src: "/corporate/brand-on-piece.jpg",
      alt: "A black cherry blossom brocade bag with a red trim, the name She Brilliance lettered across the front",
      width: 1153,
      height: 1178,
    },
  },
  {
    client: "Media Clubroom",
    title: "Your label sewn in beside ours",
    body: "For Media Clubroom a woven label carrying their name was sewn in next to the Sewing Mums label, across a run of pieces cut from three different cottons.",
    image: {
      src: "/corporate/co-branded-label.jpg",
      alt: "A coral cotton piece with a woven Media Clubroom label sewn on beside the Sewing Mums by Ultimate Balance label",
      width: 833,
      height: 832,
    },
  },
];

const WHY = [
  {
    title: "The spend is a wage",
    body: "Nothing here is a donation. The money reaches the mother who did the sewing, as payment for work she did.",
  },
  {
    title: "Made by hand, one at a time",
    body: "Nothing is stamped out of a mould. Cotton, brocade or whatever print suits your brand, cut and sewn individually.",
  },
  {
    title: "A gift with something to say",
    body: "Recipients can be told who made the thing they are holding, and what the order meant to her.",
  },
];

export default function CorporatePage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:py-16">
      <header className="max-w-2xl">
        <p className="text-xs tracking-[0.2em] text-berry uppercase">
          Corporate &amp; CSR
        </p>
        <h1 className="font-display mt-4 text-4xl leading-tight font-semibold tracking-tight text-ink">
          Gifts that carry your brand and pay a mother&rsquo;s wage
        </h1>
        <div className="mt-6 space-y-5 text-lg leading-relaxed text-muted">
          <p>
            We make handmade fabric goods that can be customised for your
            company &mdash; staff gifts, client gifts, event door gifts, and
            pieces made specifically for a CSR programme.
          </p>
          <p>
            The sewing is done at home by single mothers in Singapore who cannot
            take employment outside the home, either because of their own medical
            condition or because they are caring for a child with a chronic
            illness. A corporate order is the most useful thing that can arrive
            here: steady, paid work, at a scale a single customer cannot match.
          </p>
        </div>
        <div className="mt-8">
          <EnquireButton
            label="Talk to us about a collaboration"
            message={ENQUIRY_MESSAGE}
          />
        </div>
      </header>

      <section className="mt-16 border-t border-linen-dark/60 pt-10">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
          What we have done
        </h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted">
          Two ways a brand can sit on a handmade piece. Both of these were made
          for a client, and either can be applied to most things we sew.
        </p>

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          {SAMPLES.map((sample, index) => (
            <article key={sample.client}>
              <div className="aspect-square overflow-hidden bg-linen">
                <Image
                  src={sample.image.src}
                  alt={sample.image.alt}
                  width={sample.image.width}
                  height={sample.image.height}
                  sizes="(min-width: 640px) 360px, 90vw"
                  // The first sample reaches the fold on a laptop screen, so it
                  // is the page's largest contentful paint.
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="font-display mt-5 text-lg font-semibold text-ink">
                {sample.title}
              </h3>
              <p className="mt-1 text-xs tracking-wider text-spool uppercase">
                Made for {sample.client}
              </p>
              <p className="mt-3 leading-relaxed text-muted">{sample.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 border-t border-linen-dark/60 pt-10">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
          Why it suits a CSR programme
        </h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          {WHY.map((item) => (
            <div key={item.title}>
              <h3 className="font-display text-lg font-semibold text-ink">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 border-t border-linen-dark/60 pt-10">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
          Where to start
        </h2>
        <div className="mt-6 grid gap-10 lg:grid-cols-5 lg:gap-14">
          <div className="space-y-5 leading-relaxed text-muted lg:col-span-3">
            <p>
              Write in and we will work it out with you. It helps to know the
              occasion, roughly how many pieces you are thinking of, when you
              would need them, and anything you already have in mind for the
              branding. We will come back to you on what is possible, what it
              would cost and how long it would take.
            </p>
            <p>
              If you are not sure what to ask for yet, that is fine too &mdash;
              have a look at{" "}
              <Link href="/products" className="font-medium text-berry hover:text-berry-dark">
                what we make
              </Link>{" "}
              and tell us which direction appeals. Most of it can be made up in
              your fabric or carry your branding.
            </p>
          </div>

          <div className="rounded-card border border-linen-dark/60 bg-linen/50 p-6 lg:col-span-2">
            <p className="font-display text-lg font-semibold text-ink">
              Get in touch
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {site.founder} handles corporate enquiries directly.
            </p>
            <div className="mt-5">
              <EnquireButton
                size="sm"
                label="Enquire on WhatsApp"
                message={ENQUIRY_MESSAGE}
              />
            </div>
            <p className="mt-4 text-sm text-muted">
              or email{" "}
              <a
                href={`mailto:${site.email}?subject=${encodeURIComponent("Corporate / CSR enquiry")}`}
                className="font-medium text-berry hover:text-berry-dark"
              >
                {site.email}
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
