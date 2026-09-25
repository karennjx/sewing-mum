import type { Metadata } from "next";
import Image from "next/image";
import { EnquireButton } from "@/components/enquire-button";
import { Heart, PromiseIcon, Squiggle, WaveEdge } from "@/components/ornaments";
import type { PromiseMark } from "@/components/ornaments";
import { StitchLine } from "@/components/stitch-line";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Corporate & CSR",
  description:
    "Handmade fabric gifts customised with your brand, plus CSR programmes and team bonding workshops. Every order is paid work for a single mother in Singapore.",
};

const ENQUIRY_MESSAGE = `Hi ${site.name}! I am writing on behalf of a company about corporate gifts / a CSR collaboration. Could we talk about what is possible?`;

const HERO_PHOTO = {
  src: "/corporate/team-bonding.jpg",
  alt: "A long office table lined with people sewing patchwork owl pieces by hand, with spools of thread, pincushions and folded print fabric laid out between them",
  width: 1024,
  height: 576,
};

/**
 * Two real jobs, named. The client names are the whole point of this section —
 * a brand wants to see that another brand has done it — and both already carry
 * their own name in the photograph.
 */
const SAMPLES: readonly {
  kind: string;
  client: string;
  title: string;
  body: string;
  points: readonly { mark: PromiseMark; label: string }[];
  image: { src: string; alt: string; width: number; height: number };
}[] = [
  {
    kind: "Customised corporate gifts",
    client: "She Brilliance",
    title: "Branded gifts with a story",
    body: "The name goes directly onto the piece. Here on a black cherry blossom brocade finished with a red trim and cord handles.",
    points: [
      { mark: "label", label: "Branded design on the product itself" },
      { mark: "ask", label: "Unique, memorable gift" },
      { mark: "wage", label: "Popular for events and staff gifts" },
    ],
    image: {
      src: "/corporate/brand-on-piece.jpg",
      alt: "A black cherry blossom brocade bag with a red trim and red cord handles, the name She Brilliance lettered across the front",
      width: 819,
      height: 1024,
    },
  },
  {
    kind: "Co-branded merchandise",
    client: "Media Clubroom",
    title: "Co-branded items for your brand",
    body: "A woven label carrying your name, sewn in beside the Sewing Mums label. This run was cut from three different cottons.",
    points: [
      { mark: "label", label: "Co-branded label option" },
      { mark: "swatch", label: "A subtle and elegant approach" },
      {
        mark: "wage",
        label: "Suits corporate gifts, media kits and CSR programmes",
      },
    ],
    image: {
      src: "/corporate/co-branded-label.jpg",
      alt: "Three folded cotton pieces — cream with birds, coral with birds, and a red and white stripe — each with a woven Media Clubroom label sewn beside the Sewing Mums by Ultimate Balance label",
      width: 819,
      height: 1024,
    },
  },
];

/**
 * The first three keep the wording this page has always used, which is blunter
 * than the mockup's and says the same thing: the money is a wage, not a
 * donation. Only the fourth is new.
 */
const WHY: readonly { mark: PromiseMark; title: string; body: string }[] = [
  {
    mark: "wage",
    title: "The spend is a wage",
    body: "Nothing here is a donation. The money reaches the mother who did the sewing, as payment for work she did.",
  },
  {
    mark: "sew",
    title: "Made by hand, one at a time",
    body: "Nothing is stamped out of a mould. Cotton, brocade or whatever print suits your brand, cut and sewn individually.",
  },
  {
    mark: "ask",
    title: "A gift with something to say",
    body: "Recipients can be told who made the thing they are holding, and what the order meant to her.",
  },
  {
    mark: "swatch",
    title: "Flexible customisation",
    body: "A wide range of fabrics, styles and branding options, to suit what you need and what you have to spend.",
  },
];

const PROCESS: readonly { mark: PromiseMark; title: string; body: string }[] = [
  {
    mark: "brief",
    title: "Share your brief",
    body: "Tell us the occasion, roughly how many pieces, when you need them and what you have to spend.",
  },
  {
    mark: "label",
    title: "Choose fabrics and branding",
    body: "We come back with suitable styles and fabrics, and how the branding can go on — printed on the piece or sewn in on a label.",
  },
  {
    mark: "home",
    title: "Sewn by mothers at home",
    body: "The run is shared out and sewn by hand, at home, at a pace that fits around the rest of their day.",
  },
  {
    mark: "parcel",
    title: "Packed and delivered",
    body: "We handle the packing and get the order to wherever you need it.",
  },
];

export default function CorporatePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-linen/70 via-linen/20 to-cream">
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-5 py-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:gap-12 lg:py-16">
          <div className="animate-rise">
            <p className="text-xs tracking-[0.2em] text-berry uppercase">
              Corporate &amp; CSR
            </p>
            <h1 className="font-display mt-4 text-4xl leading-[1.1] font-semibold tracking-tight text-ink sm:text-5xl">
              Meaningful gifts and experiences for{" "}
              <span className="relative inline-block">
                your brand.
                <Squiggle className="absolute -bottom-2.5 left-0 h-3 w-full text-rose" />
              </span>
            </h1>
            <p className="mt-9 max-w-md text-lg leading-relaxed text-muted">
              From handmade branded gifts to CSR programmes and team bonding
              workshops, we make thoughtful fabric pieces sewn with purpose by
              mothers in Singapore.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <EnquireButton
                label="Talk to us about a collaboration"
                message={ENQUIRY_MESSAGE}
              />
              <a
                href="#past-collaborations"
                className="inline-flex items-center rounded-full border border-linen-dark bg-cream/60 px-6 py-3 font-medium text-ink transition-colors hover:border-berry hover:text-berry"
              >
                See past projects
              </a>
            </div>
          </div>

          {/* Propped in a white frame and turned a degree, the same device the
              homepage uses for the pieces over its hero photograph. The padding
              at the top is for the aside, which sits in the space the tilt
              leaves rather than over the photograph: the top right of this
              frame is a bank of bright windows and nothing legible survives
              there. */}
          <div className="relative lg:pt-14">
            <div className="absolute top-0 right-3 z-10 hidden lg:block">
              <div className="relative animate-rise [animation-delay:520ms]">
                <p className="font-hand rotate-2 text-right text-2xl leading-tight text-berry">
                  Team bonding
                  <br />
                  with a purpose
                </p>
                <Heart className="absolute -bottom-2 -left-6 h-4 w-4 text-rose" />
              </div>
            </div>

            <div className="rotate-[1.5deg] bg-white p-2 shadow-lg">
              {/* Cropped to 3:2 on desktop. At its own 16:9 the frame comes out
                  a third shorter than the column of text beside it and reads as
                  an afterthought; the trim comes off the ends of the table and
                  costs 8% a side. On a phone it keeps the whole frame, where
                  there is no column to balance against.

                  sizes is the ~600px object-cover needs to fill that crop, not
                  the 504 the box is wide. */}
              <div className="aspect-[16/9] overflow-hidden bg-linen lg:aspect-[3/2]">
                <Image
                  src={HERO_PHOTO.src}
                  alt={HERO_PHOTO.alt}
                  width={HERO_PHOTO.width}
                  height={HERO_PHOTO.height}
                  sizes="(min-width: 1024px) 620px, 92vw"
                  loading="eager"
                  fetchPriority="high"
                  className="animate-settle h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <WaveEdge className="absolute bottom-0 left-0 block h-4 w-full text-linen/60 sm:h-5" />
      </section>

      {/* The anchor the hero's second button points at, so that button has a
          real destination rather than a page that does not exist. */}
      <section id="past-collaborations" className="scroll-mt-4 bg-linen/60">
        <div className="mx-auto max-w-5xl px-5 py-14 lg:py-16">
          <div className="grid gap-4 sm:grid-cols-2 sm:items-end sm:gap-8">
            <div>
              <p className="text-xs tracking-[0.2em] text-berry uppercase">
                What we have done
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-ink">
                Past collaborations
              </h2>
            </div>
            <p className="leading-relaxed text-muted">
              From corporate gifts to event merchandise, we work with companies
              and organisations on fabric pieces that carry their brand and
              support the mothers who sew them.
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {SAMPLES.map((sample, index) => (
              <article
                key={sample.client}
                className="grid gap-5 border border-linen-dark/60 bg-cream p-5 sm:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] sm:gap-6"
              >
                <div className="aspect-[4/5] overflow-hidden bg-linen">
                  <Image
                    src={sample.image.src}
                    alt={sample.image.alt}
                    width={sample.image.width}
                    height={sample.image.height}
                    sizes="(min-width: 1024px) 180px, (min-width: 640px) 290px, 85vw"
                    // The first sample reaches the fold on a laptop, so it is
                    // the page's largest contentful paint after the hero.
                    loading={index === 0 ? "eager" : "lazy"}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div>
                  <p className="text-xs tracking-[0.15em] text-spool uppercase">
                    {sample.kind}
                  </p>
                  <h3 className="font-display mt-2 text-xl font-semibold text-berry">
                    {sample.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {sample.body}
                  </p>
                  <p className="mt-3 text-sm font-medium text-ink">
                    Made for {sample.client}
                  </p>
                  <ul className="mt-4 space-y-2.5 border-t border-linen-dark/60 pt-4">
                    {sample.points.map((point) => (
                      <li
                        key={point.label}
                        className="flex items-start gap-2.5 text-sm leading-snug text-muted"
                      >
                        <PromiseIcon
                          mark={point.mark}
                          className="mt-px h-4 w-4 shrink-0 text-berry"
                        />
                        <span>{point.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-14 lg:py-16">
        <div className="grid gap-4 sm:grid-cols-2 sm:items-end sm:gap-8">
          <div>
            <p className="text-xs tracking-[0.2em] text-berry uppercase">
              Why it suits a CSR programme
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-ink">
              More than just a gift
            </h2>
          </div>
          <p className="leading-relaxed text-muted">
            The support goes past a nice object. It is work for a mother who
            cannot leave the house to earn, at a scale no single customer can
            match.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map((item) => (
            <div
              key={item.title}
              className="border border-linen-dark/60 bg-linen/50 p-6 text-center"
            >
              <PromiseIcon
                mark={item.mark}
                className="mx-auto h-8 w-8 text-berry"
              />
              <h3 className="font-display mt-4 text-lg font-semibold text-berry">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* The same discs on the same dashed line as the homepage and the about
          page, numbered here because these four are a sequence rather than
          three things that happen to be true at once. */}
      <section className="bg-linen/60">
        <div className="mx-auto max-w-5xl px-5 py-14 lg:py-16">
          <p className="text-xs tracking-[0.2em] text-berry uppercase">
            How it works
          </p>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-ink">
            A simple and meaningful process
          </h2>

          <div className="relative mt-10 grid gap-9 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {/* Spans disc centre to disc centre: four columns put those at
                12.5% and 87.5% of the row. */}
            <StitchLine className="absolute top-7 right-[12.5%] left-[12.5%] hidden border-t-2 border-dashed border-rose-soft lg:block" />
            <Heart className="absolute top-3 left-[75%] hidden h-4 w-4 -translate-x-1/2 text-rose lg:block" />

            {PROCESS.map((step, index) => (
              <div key={step.title} className="relative text-center">
                <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-cream text-berry ring-1 ring-rose-soft">
                  <PromiseIcon mark={step.mark} className="h-7 w-7" />
                  <span className="absolute -bottom-2 left-1/2 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full bg-berry text-[10px] font-semibold text-cream">
                    {index + 1}
                  </span>
                </span>
                <h3 className="font-display mt-4 text-lg font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-maroon text-cream">
        <div className="mx-auto max-w-3xl px-5 py-14 text-center">
          <Squiggle className="mx-auto h-4 w-24 text-rose/60" />
          {/* Narrower than the band so the two lines come out near even. At the
              full width the break falls after "with" and leaves "meaning."
              alone. */}
          <h2 className="font-display mx-auto mt-6 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Let&rsquo;s create gifts and experiences with meaning.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-linen/80">
            We would love to hear about your ideas and work out how we can do it
            together.
          </p>
          <div className="mt-8">
            <EnquireButton
              variant="onMaroon"
              label="Enquire on WhatsApp"
              message={ENQUIRY_MESSAGE}
            />
          </div>
          {/* Companies often want this in writing rather than on WhatsApp, and
              it is the only place on the page that offers them the choice. */}
          <p className="mt-5 text-sm text-linen/80">
            or email{" "}
            <a
              href={`mailto:${site.email}?subject=${encodeURIComponent("Corporate / CSR enquiry")}`}
              className="font-medium text-cream underline decoration-rose/60 underline-offset-4 hover:decoration-cream"
            >
              {site.email}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
