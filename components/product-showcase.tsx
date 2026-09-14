"use client";

import Image from "next/image";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AddToCart } from "@/components/add-to-cart";
import {
  EnquireButton,
  type EnquireButtonSize,
} from "@/components/enquire-button";
import type { Product, ProductImage, ProductVariant } from "@/lib/catalog";
import { site } from "@/lib/site";

/**
 * The interactive product gallery: thumbnails that swap the main photo, and
 * print tags that do the same and carry the choice into the WhatsApp message.
 *
 * The gallery sits in the left column and the tags in the right, so the two
 * cannot hold the state between them. Hence the context: the provider wraps
 * both columns, and the page's server-rendered content passes straight through
 * it untouched.
 */

type ShowcaseValue = {
  activeIndex: number;
  showImage: (index: number) => void;
  /** The chosen print's name, or null while the visitor has not picked one. */
  chosenPrint: string | null;
  choosePrint: (variant: ProductVariant) => void;
};

const ShowcaseContext = createContext<ShowcaseValue | null>(null);

function useShowcase(): ShowcaseValue {
  const value = useContext(ShowcaseContext);
  if (!value) {
    throw new Error(
      "Showcase parts must be rendered inside <ProductShowcase>. A product " +
        "without variants has no provider, so render the plain gallery instead.",
    );
  }
  return value;
}

export function ProductShowcase({
  images,
  children,
}: {
  images: readonly ProductImage[];
  children: ReactNode;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [chosenPrint, setChosenPrint] = useState<string | null>(null);

  const choosePrint = useCallback(
    (variant: ProductVariant) => {
      setChosenPrint(variant.name);
      const index = images.findIndex((image) => image.src === variant.image);
      if (index !== -1) {
        setActiveIndex(index);
      }
    },
    [images],
  );

  const value = useMemo(
    () => ({
      activeIndex,
      showImage: setActiveIndex,
      chosenPrint,
      choosePrint,
    }),
    [activeIndex, chosenPrint, choosePrint],
  );

  return (
    <ShowcaseContext.Provider value={value}>
      {children}
    </ShowcaseContext.Provider>
  );
}

function Chevron({ pointing }: { pointing: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <path d={pointing === "left" ? "M15 18 9 12l6-6" : "M9 18l6-6-6-6"} />
    </svg>
  );
}

export function ShowcaseGallery({
  images,
}: {
  images: readonly ProductImage[];
}) {
  const { activeIndex, showImage } = useShowcase();
  const strip = useRef<HTMLUListElement | null>(null);
  const activeThumbnail = useRef<HTMLLIElement | null>(null);
  // Whether the strip has anything left to scroll to, which decides if each
  // arrow is any use. Measured rather than assumed, since how many thumbnails
  // fit depends on the column width.
  const [edges, setEdges] = useState({ atStart: true, atEnd: true });

  const measureEdges = useCallback((el: HTMLUListElement) => {
    const atStart = el.scrollLeft <= 1;
    const atEnd = Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth - 1;
    setEdges((previous) =>
      previous.atStart === atStart && previous.atEnd === atEnd
        ? previous
        : { atStart, atEnd },
    );
  }, []);

  const attachStrip = useCallback(
    (el: HTMLUListElement | null) => {
      strip.current = el;
      if (el) {
        measureEdges(el);
      }
    },
    [measureEdges],
  );

  // The thumbnails are watched as well as the strip itself, not just because a
  // narrower window can turn a strip that fits into one that scrolls, but
  // because the measurement taken as the strip is attached runs before the
  // tiles have their real width. Watching the strip alone would never correct
  // it: its own size does not change when only the content inside it grows.
  useEffect(() => {
    const el = strip.current;
    if (!el) {
      return;
    }
    const observer = new ResizeObserver(() => measureEdges(el));
    observer.observe(el);
    for (const tile of el.children) {
      observer.observe(tile);
    }
    return () => observer.disconnect();
  }, [measureEdges]);

  // Choosing a print can select a photo that is scrolled out of sight, which
  // would leave nothing on screen marked as current. "nearest" so this never
  // scrolls the page itself, only the strip.
  useEffect(() => {
    activeThumbnail.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }, [activeIndex]);

  const scrollStrip = (towards: "left" | "right") => {
    const el = strip.current;
    if (!el) {
      return;
    }
    // Just under a full width, so the thumbnail at the edge stays in view as a
    // handhold between pages.
    const step = el.clientWidth * 0.8;
    el.scrollBy({
      left: towards === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  return (
    <div className="space-y-3">
      {/* Square frame so the main photo holds one size as it changes, and
          object-contain so none of these differently proportioned phone shots
          gets cropped to fit it.

          Every photo is rendered and faded between, rather than swapping one
          element's src: that leaves the frame blank while the next photo
          downloads, which on a click reads as something having broken. Hidden
          with opacity rather than display:none so the browser still fetches
          them, and each is only a few tens of kilobytes at this width. */}
      <div className="relative aspect-square overflow-hidden bg-linen">
        {images.map((image, index) => {
          const isActive = index === activeIndex;
          return (
            <Image
              key={image.src}
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="(min-width: 1024px) 480px, 92vw"
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
              aria-hidden={!isActive}
              className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-200 ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            />
          );
        })}
      </div>

      <div className="relative">
        <ul
          ref={attachStrip}
          onScroll={(event) => measureEdges(event.currentTarget)}
          className="flex gap-2 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((image, index) => {
            const isActive = index === activeIndex;
            return (
              <li
                key={image.src}
                ref={isActive ? activeThumbnail : null}
                className="shrink-0"
              >
                <button
                  type="button"
                  onClick={() => showImage(index)}
                  aria-label={`Show photo ${index + 1} of ${images.length}`}
                  // Omitted rather than set to "false" on the others: screen
                  // readers and tooling go by whether the attribute is there.
                  aria-current={isActive ? "true" : undefined}
                  className={`block aspect-square w-20 overflow-hidden border-2 transition-colors ${
                    isActive
                      ? "border-berry"
                      : "border-transparent hover:border-rose"
                  }`}
                >
                  {/* Cropped square here, unlike the main photo: a tidy row of
                      matching tiles matters more than seeing every edge, and a
                      click away is the whole picture. */}
                  <Image
                    src={image.src}
                    alt=""
                    width={image.width}
                    height={image.height}
                    sizes="80px"
                    className="h-full w-full object-cover"
                  />
                </button>
              </li>
            );
          })}
        </ul>

        {(
          [
            ["left", edges.atStart, "Show earlier photos", "left-0"],
            ["right", edges.atEnd, "Show later photos", "right-0"],
          ] as const
        ).map(([towards, atEdge, label, position]) => (
          <button
            key={towards}
            type="button"
            onClick={() => scrollStrip(towards)}
            disabled={atEdge}
            aria-label={label}
            className={`absolute top-1/2 ${position} -translate-y-1/2 rounded-full border border-linen-dark bg-cream/95 p-1.5 text-ink shadow-sm transition-opacity hover:bg-linen disabled:pointer-events-none disabled:opacity-0`}
          >
            <Chevron pointing={towards} />
          </button>
        ))}
      </div>
    </div>
  );
}

export function ShowcasePrintPicker({
  variants,
  images,
  buyable,
}: {
  variants: readonly ProductVariant[];
  images: readonly ProductImage[];
  /** A print on a priced piece rides along in the cart; on an enquiry-only
   *  piece it is just something we promise to mention. */
  buyable: boolean;
}) {
  const { chosenPrint, choosePrint } = useShowcase();

  const choice = chosenPrint?.toLowerCase() ?? null;
  let hint: string;
  if (choice === null) {
    hint = buyable
      ? "Pick a print before you add it to the cart."
      : "Pick a print and we will mention it when you message us.";
  } else {
    hint = buyable
      ? `Your order will say ${choice}.`
      : `We will mention the ${choice} print when you message us.`;
  }

  return (
    <div>
      <h2 className="text-xs tracking-wider text-muted uppercase">Print</h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {variants.map((variant) => {
          const isChosen = chosenPrint === variant.name;
          const swatch = images.find((image) => image.src === variant.image);
          return (
            <li key={variant.name}>
              <button
                type="button"
                onClick={() => choosePrint(variant)}
                aria-pressed={isChosen}
                className={`flex items-center gap-2 rounded-full border py-1.5 pr-4 pl-1.5 text-sm transition-colors ${
                  isChosen
                    ? "border-berry bg-berry/5 font-medium text-berry"
                    : "border-linen-dark text-ink hover:border-rose"
                }`}
              >
                {swatch ? (
                  <Image
                    src={swatch.src}
                    alt=""
                    width={swatch.width}
                    height={swatch.height}
                    sizes="28px"
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : null}
                {variant.name}
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-xs leading-relaxed text-muted">
        {hint} Prints change as fabric runs out, so we will confirm what is
        ready.
      </p>
    </div>
  );
}

/** Feeds the chosen print into the cart, so a line reads "in rainbow circles"
 *  rather than leaving Kim to ask which one they meant. */
export function ShowcaseAddToCart({ product }: { product: Product }) {
  const { chosenPrint } = useShowcase();

  return (
    <AddToCart
      slug={product.slug}
      print={chosenPrint}
      requiresPrint
      stock={product.stock}
    />
  );
}

export function ShowcaseEnquireButton({
  product,
  size,
  label,
}: {
  product: Product;
  size?: EnquireButtonSize;
  label?: string;
}) {
  const { chosenPrint } = useShowcase();

  return (
    <EnquireButton
      product={product}
      size={size}
      label={label}
      message={
        chosenPrint
          ? `Hi ${site.name}! I would like to enquire about the ${product.name} in the ${chosenPrint.toLowerCase()} print. Is that one ready?`
          : undefined
      }
    />
  );
}
