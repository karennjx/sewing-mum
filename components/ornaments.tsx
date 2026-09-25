/**
 * Decorative marks for the homepage: a drawn underline, a soft section edge,
 * and the three small icons on the promises band.
 *
 * All of them are inline SVG rather than images so they take their colour from
 * a token class on the parent (`currentColor`) and cost no extra request. They
 * carry no meaning a screen reader needs, so every one is aria-hidden.
 */

type MarkProps = {
  className?: string;
};

/** The wavy line that runs under the end of the headline. */
export function Squiggle({ className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 220 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M4 14C28 4 52 4 76 14s48 10 72 0 44-10 68-2"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Heart({ className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M12 20.3l-1.1-1C6.1 15 3 12.2 3 8.8 3 6.1 5.1 4 7.8 4c1.5 0 3 .7 4.2 2.1C13.2 4.7 14.7 4 16.2 4 18.9 4 21 6.1 21 8.8c0 3.4-3.1 6.2-7.9 10.5l-1.1 1z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * The line running from the handwritten aside across the photograph towards her
 * hands at the needle. Shallow rather than steep, because the sewing sits well
 * to the right of the aside and only a little below it. One uneven arc with a
 * small open head rather than a drawn triangle, so it reads as pen on paper.
 */
export function PointerLine({ className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 100 72"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M4 8c14 24 40 38 72 44"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M76 52l-13 2M76 52l-6-12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * The soft edge between the hero and the band below it. Filled with
 * currentColor, so the parent sets it to the same token as the band it belongs
 * to and the shape reads as the band rising into the hero.
 */
export function WaveEdge({ className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 1440 40"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M0 17c210 22 420-7 630 1s360 23 570 7c90-7 180-12 240-14v29H0V17z"
        fill="currentColor"
      />
    </svg>
  );
}

export type PromiseMark =
  | "home"
  | "wage"
  | "ask"
  | "sew"
  | "swatch"
  | "brief"
  | "label"
  | "parcel";

const PATHS: Record<PromiseMark, string> = {
  // A house, for work that happens at home.
  home: "M4 11.6 12 4.5l8 7.1V20a1 1 0 0 1-1 1h-4.5v-5.5h-5V21H5a1 1 0 0 1-1-1v-8.4Z",
  // A heart, for the wage the order pays.
  wage: "M12 20.1l-1-.9C6.3 15 3.4 12.4 3.4 9.2 3.4 6.7 5.4 4.7 7.9 4.7c1.4 0 2.8.7 3.9 1.9 1.1-1.2 2.5-1.9 3.9-1.9 2.5 0 4.5 2 4.5 4.5 0 3.2-2.9 5.8-7.6 10l-1 .9Z",
  // A spool of thread, for the sewing itself. A machine was drawn here first
  // and did not survive the size: the arm, the needle and the gap beneath it
  // all fall under 4px at the 28px these render at, and it closed up into a
  // shape that read as a lamp. The spool is also the mark in the logo, so the
  // simpler icon is the more particular one.
  sew: "M6 5.6h12M6 18.4h12M7.9 5.6v12.8M16.1 5.6v12.8M16.1 11.4c2.5.3 3.8 1.5 4 3.6",
  // A gift, for the piece that arrives.
  ask: "M4.5 11h15v9a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1v-9ZM3.5 7.8h17V11h-17V7.8ZM12 7.8V21M12 7.8C10.6 7.8 7.6 7.4 7.6 5.6S9.3 3.7 10.2 4.5 12 7.8 12 7.8s.9-2.5 1.8-3.3 2.6-.3 2.6 1.4-3 2.2-4.4 2.2Z",
  // Two swatches laid over each other, for a choice of fabrics. Squares rather
  // than the pinked-edge swatch the mockup drew: a zigzag border closes up into
  // a grey fuzz well before these reach the size they render at.
  swatch: "M4.6 9.4h10v10h-10zM9.4 4.6h10v10h-10z",
  // A page of notes, for the brief a company sends in.
  brief: "M6 4h12v16H6zM9 9h6M9 12.5h6M9 16h3.5",
  // A label, for the branding sewn into the piece. No punched hole: a hole big
  // enough to read at 28px would be most of the width of the tag's point, and
  // anything in proportion blobs shut under a 1.6 stroke.
  label: "M9 5.5h8.4a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9L4.6 12z",
  // A box, for the finished order going out.
  parcel:
    "M12 4.6 4.8 8.4v7.2L12 19.4l7.2-3.8V8.4zM4.8 8.4 12 12.2l7.2-3.8M12 12.2v7.2",
};

export function PromiseIcon({
  mark,
  className,
}: MarkProps & { mark: PromiseMark }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d={PATHS[mark]}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
