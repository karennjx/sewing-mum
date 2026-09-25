import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Heart, PromiseIcon, Squiggle, WaveEdge } from "@/components/ornaments";
import type { PromiseMark } from "@/components/ornaments";
import { StitchLine } from "@/components/stitch-line";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our story",
  description:
    "A Singapore social enterprise creating paid work for mothers with chronic illnesses and caregiving responsibilities, through handmade fabric crafts, toys and everyday goods.",
};

/**
 * Hands at the needle rather than a face, so this reads as the work and not as
 * a second portrait competing with the homepage's.
 *
 * Described loosely on purpose: the band crops roughly a quarter off the sides,
 * and how much of the table survives moves with the viewport, so the wording
 * has to stay true of every crop.
 */
const HERO_PHOTO = {
  src: "/about/sewing.jpg",
  alt: "A mother's hands guiding a length of floral cotton under the needle of a sewing machine, with folded print fabric and sewing tools on the table around her",
  width: 1024,
  height: 576,
};

const FOUNDER_PHOTO = {
  src: "/about/kim.jpg",
  alt: "Kim, in red glasses, sitting with one of the mothers behind stacks of folded print fabric, with a sewing machine, spools of thread and finished owl cushions around them",
  width: 1024,
  height: 768,
};

const HOW_IT_WORKS: readonly {
  mark: PromiseMark;
  title: string;
  body: string;
}[] = [
  {
    mark: "home",
    title: "Mothers who cannot leave home to work",
    body: "We support mothers with chronic illnesses or caregiving responsibilities who are unable to work outside the home.",
  },
  {
    mark: "sew",
    title: "Sewing projects they can take on at home",
    body: "They create fabric crafts, toys and good-to-haves from home, at their own pace, using their sewing skills and creativity.",
  },
  {
    mark: "ask",
    title: "Income, not charity",
    body: "They earn a fair income for their work, gaining financial independence, confidence and a sense of purpose.",
  },
];

/**
 * Where the pieces are sold in person. Descriptions rather than links: there is
 * no page behind any of these three, and an arrow that goes nowhere is worse
 * than no arrow.
 */
const COMMUNITY = [
  {
    src: "/about/community-fundraising.jpg",
    alt: "Kim holding up a pink patchwork owl behind a stall of cloud and star cushions and folded fabric, with printed signs asking shoppers to support Sewing Mums",
    title: "Fundraising and awareness",
    body: "We take part in community events to share our story and raise support for our mothers.",
  },
  {
    src: "/about/community-markets.jpg",
    alt: "A Sewing Mums stall of owl cushions, pouches and folded fabric laid out on a red cloth, in a function room looking out over the city",
    title: "Pop-up markets",
    body: "Our handmade creations reach new friends through markets and corporate events.",
  },
  {
    src: "/about/community-partners.jpg",
    alt: "A Sewing Mums stall in a shopping mall with a roll-up banner explaining the campaign, tote bags hanging on a rack and a table of owl cushions and folded fabric",
    title: "Corporate and community partners",
    body: "We collaborate with organisations that believe in fair opportunities and inclusive communities.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* The photograph runs off the right edge of the screen rather than
          stopping at the grid, which is the one thing this hero does that the
          homepage's does not. Taken out of the flow from lg up so it fills the
          band's full height; below that it drops under the text at 16:9, which
          is why it comes second here — the headline should be the first thing
          on a phone, as it is on the homepage.

          No wave at the bottom of this one. The gradient already resolves to
          cream and the section below is cream, so the join is invisible — and
          a wave here would cut a scalloped bite out of the photograph. */}
      <section className="relative overflow-hidden bg-gradient-to-b from-linen/70 via-linen/20 to-cream">
        {/* Half the container's content box, which is centred, so its right
            edge lands on the centre of the screen at every width — exactly
            where the photograph starts. The padding is then the gutter between
            the two, and stays 48px instead of collapsing to 13. */}
        <div className="mx-auto max-w-5xl px-5">
          <div className="animate-rise py-12 lg:w-1/2 lg:py-16 lg:pr-12">
            <p className="text-xs tracking-[0.2em] text-berry uppercase">
              Our story
            </p>
            <h1 className="font-display mt-4 text-4xl leading-[1.1] font-semibold tracking-tight text-ink sm:text-5xl">
              Work that fits{" "}
              <span className="relative inline-block">
                around real life.
                <Squiggle className="absolute -bottom-2.5 left-0 h-3 w-full text-rose" />
                <Heart className="absolute -right-7 -bottom-4 h-4 w-4 text-rose" />
              </span>
            </h1>
            <p className="mt-10 max-w-md text-lg leading-relaxed text-muted">
              {site.name} is a Singapore social enterprise creating paid work
              for mothers with chronic illnesses and caregiving
              responsibilities, through handmade fabric crafts, toys and
              everyday goods.
            </p>
            <div className="mt-8">
              <Link
                href="/products"
                className="inline-flex items-center rounded-full bg-berry px-6 py-3 font-medium text-cream transition-colors hover:bg-berry-dark"
              >
                See our products &rarr;
              </Link>
            </div>
          </div>
        </div>

        <div className="aspect-[16/9] overflow-hidden bg-linen lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-1/2">
          <Image
            src={HERO_PHOTO.src}
            alt={HERO_PHOTO.alt}
            width={HERO_PHOTO.width}
            height={HERO_PHOTO.height}
            // Not the half-viewport the box is wide. object-cover has to fill a
            // box taller than 16:9, so it scales the photograph up until the
            // height fits and the width it needs lands near 900px whatever the
            // viewport does. Asking for the box width fetched 665 and stretched
            // it half again. 1024 is the whole source, which is all there is to
            // ask for.
            sizes="(min-width: 1024px) 1024px, 100vw"
            loading="eager"
            fetchPriority="high"
            className="animate-settle h-full w-full object-cover"
          />
        </div>
      </section>

      <section className="relative bg-cream">
        <div className="mx-auto max-w-5xl px-5 py-16 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="aspect-[4/3] overflow-hidden bg-linen shadow-sm">
              <Image
                src={FOUNDER_PHOTO.src}
                alt={FOUNDER_PHOTO.alt}
                width={FOUNDER_PHOTO.width}
                height={FOUNDER_PHOTO.height}
                sizes="(min-width: 1024px) 470px, 92vw"
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <p className="text-xs tracking-[0.2em] text-berry uppercase">
                Our founder
              </p>
              <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Who is {site.founder}?
                <Heart className="ml-3 inline-block h-5 w-5 align-middle text-rose" />
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-muted">
                {site.name} began with a simple belief: every mother deserves
                the chance to contribute, no matter her circumstances.
              </p>
              <p className="mt-4 leading-relaxed text-muted">
                Our founder, {site.founder}, saw how difficult it was for
                mothers with chronic illnesses or caregiving responsibilities to
                find work that fits around home. So she created {site.name}{" "}
                &mdash; a social enterprise that turns sewing skills into
                flexible, meaningful, paid work.
              </p>

              {/* The kind of thing she would write on a tag, in the hand font
                  the homepage uses for the same purpose. Real text, not an
                  ornament, so it is left readable. */}
              <div className="mt-8 flex justify-end">
                <div className="relative">
                  <p className="font-hand -rotate-3 text-2xl leading-tight text-berry">
                    Mothers supporting
                    <br />
                    mothers
                  </p>
                  <Heart className="absolute -top-2 -right-5 h-4 w-4 text-rose" />
                </div>
              </div>
            </div>
          </div>

          {/* Her own account, kept at length. The section above says what she
              built; this says why she of all people built it, and no shorter
              version carries the same weight. */}
          <div className="mt-14 max-w-3xl border-t border-linen-dark/60 pt-10">
            <h3 className="font-display text-2xl font-semibold tracking-tight text-ink">
              Her own story
            </h3>
            <div className="mt-5 space-y-5 leading-relaxed text-muted">
              <p>
                Kim Underhill has been where these mothers are. She left school
                at fifteen to help with the family finances. At twenty-eight she
                found herself out of an abusive marriage with two children, aged
                five and one. At thirty-three she went back to school, and
                pushed through six years of night classes while raising them and
                holding a full-time job.
              </p>
              <p>
                She came out of it with a Masters in Industrial and
                Organisational Human Resource Psychology and more than
                twenty-five years in international business &mdash; managing
                Fortune 500 accounts, then senior roles leading organisational
                change. She now speaks, runs workshops and coaches through
                Ultimate Balance Consultancy, under a phrase she has built a
                career on: be the change, before change changes you.
              </p>
              <p>
                {site.name} grew out of that experience. {site.founder} knows
                first-hand what it costs to raise children alone with no way to
                earn, and what actually helps is not sympathy but paid work that
                fits around a sick child and a home you cannot leave.
              </p>
            </div>
            <p className="mt-6 text-sm">
              <a
                href="https://www.kimunderhill.com/about"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-berry hover:text-berry-dark"
              >
                More about {site.founder} &rarr;
              </a>
            </p>
          </div>
        </div>

        {/* The band below rising into this one, the same ornament and the same
            token pairing the homepage uses between its hero and promises. */}
        <WaveEdge className="absolute bottom-0 left-0 block h-4 w-full text-linen/60 sm:h-5" />
      </section>

      {/* Deliberately the same furniture as the promises band on the homepage —
          discs on a dashed line, drawn once on scroll — because it is the same
          three-step idea told at more length. */}
      <section className="bg-linen/60">
        <div className="mx-auto max-w-5xl px-5 py-14 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-4 lg:gap-8">
            <div>
              <p className="text-xs tracking-[0.2em] text-berry uppercase">
                A simple idea
              </p>
              <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight text-ink">
                How it works
              </h2>
              {/* The padding is what keeps the heart off the line. This
                  squiggle's dip reaches the very bottom of its own box, so a
                  heart tucked under it with a negative offset gets the line
                  drawn straight through it. */}
              <div className="relative mt-3 inline-block pb-5">
                <Squiggle className="h-4 w-28 text-rose" />
                <Heart className="absolute bottom-0 left-6 h-4 w-4 text-rose" />
              </div>
            </div>

            <div className="relative grid gap-8 sm:grid-cols-3 lg:col-span-3">
              <StitchLine className="absolute top-7 right-[16%] left-[16%] hidden border-t-2 border-dashed border-rose-soft sm:block" />
              {HOW_IT_WORKS.map((step) => (
                <div key={step.title} className="relative text-center">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-cream text-berry ring-1 ring-rose-soft">
                    <PromiseIcon mark={step.mark} className="h-7 w-7" />
                  </span>
                  <h3 className="font-display mt-3 text-lg font-semibold text-ink">
                    {step.title}
                  </h3>
                  <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-4 lg:gap-8">
          <div>
            <p className="text-xs tracking-[0.2em] text-berry uppercase">
              In the community
            </p>
            <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight text-ink">
              Together for brighter tomorrows.
            </h2>
            <div className="relative mt-3 inline-block pb-5">
              <Squiggle className="h-4 w-24 text-rose" />
              <Heart className="absolute bottom-0 left-5 h-4 w-4 text-rose" />
            </div>
            <p className="mt-5 leading-relaxed text-muted">
              We are grateful for the many individuals, organisations and
              communities who support {site.name} and help create more
              opportunities for our mothers.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3 lg:col-span-3">
            {COMMUNITY.map((item) => (
              <div
                key={item.title}
                className="flex flex-col border border-linen-dark/60 bg-white"
              >
                <div className="aspect-[4/3] overflow-hidden bg-linen">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={1024}
                    height={768}
                    sizes="(min-width: 1024px) 230px, (min-width: 640px) 30vw, 100vw"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-base font-semibold text-berry">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The same band that closes the homepage, pointing the other way: there
          it sends people here, here it sends them to the shelf. Split rather
          than centred so the two are not mistaken for the same block. */}
      <section className="bg-maroon text-cream">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-5 py-14 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <Squiggle className="mx-auto h-4 w-24 text-rose/60 sm:mx-0" />
            <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Small stitches. Brighter tomorrows.
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-linen/80">
              Every purchase supports a mother, a family and a more inclusive
              Singapore.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex shrink-0 items-center rounded-full border border-rose/50 px-6 py-3 font-medium text-cream transition-colors hover:border-cream hover:bg-cream/10"
          >
            See our products &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}
