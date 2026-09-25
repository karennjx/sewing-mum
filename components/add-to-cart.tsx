"use client";

import Link from "next/link";
import { useState } from "react";
import { addToCart, useCart } from "@/lib/cart";

function Sign({ of }: { of: "minus" | "plus" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
      className="h-3.5 w-3.5"
    >
      <path d="M5 12h14" />
      {of === "plus" ? <path d="M12 5v14" /> : null}
    </svg>
  );
}

/**
 * The quantity stepper and Add to cart button.
 *
 * Every product keeps its Enquire button alongside this, so anything that
 * cannot be bought here — no price set, no photograph, none left — still has
 * a way through rather than a dead end.
 */
export function AddToCart({
  slug,
  print,
  requiresPrint,
  onePerChoice = false,
  stock,
}: {
  slug: string;
  /** The chosen print, or null for a piece that comes only one way. */
  print: string | null;
  /** True when the piece comes in prints, so one has to be picked first. */
  requiresPrint: boolean;
  /** Each choice is a single item, so there is no quantity to pick. */
  onePerChoice?: boolean;
  /** Caps the stepper, for the pieces Kim counts. */
  stock?: number;
}) {
  const [quantity, setQuantity] = useState(1);
  const cart = useCart();

  const linesHere = cart.filter(
    (line) => line.slug === slug && (print === null || line.print === print),
  );
  const inCart = linesHere.reduce((total, line) => total + line.quantity, 0);
  const piecesInCart = linesHere.map((line) => line.print).join(", ");

  // What is left once the cart is taken into account, so the stepper cannot
  // quietly offer a fourth of something we said there were three of. Stock is
  // Kim's hand-kept number and can be wrong either way, so this is a guard
  // against the obvious mistake, not a guarantee.
  const cap = onePerChoice ? 1 : stock;
  const remaining = cap === undefined ? undefined : Math.max(0, cap - inCart);
  const ceiling = remaining === undefined ? 99 : remaining;
  const pickedNone = requiresPrint && print === null;
  const noneLeft = remaining === 0;
  const canAdd = !pickedNone && !noneLeft;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        {onePerChoice ? null : (
        <div className="flex items-center rounded-full border border-linen-dark">
          <button
            type="button"
            onClick={() => setQuantity((n) => Math.max(1, n - 1))}
            disabled={quantity <= 1}
            aria-label="One fewer"
            className="px-3 py-2.5 text-ink transition-colors hover:text-berry disabled:opacity-30"
          >
            <Sign of="minus" />
          </button>
          <span
            aria-live="polite"
            className="min-w-8 text-center text-sm font-medium tabular-nums"
          >
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((n) => Math.min(ceiling, n + 1))}
            disabled={quantity >= ceiling}
            aria-label="One more"
            className="px-3 py-2.5 text-ink transition-colors hover:text-berry disabled:opacity-30"
          >
            <Sign of="plus" />
          </button>
        </div>
        )}

        <button
          type="button"
          onClick={() => {
            addToCart(slug, print, quantity);
            setQuantity(1);
          }}
          disabled={!canAdd}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-berry px-6 py-3 font-medium text-cream transition-colors hover:bg-berry-dark disabled:cursor-not-allowed disabled:bg-linen-dark disabled:text-muted"
        >
          Add to cart
        </button>
      </div>

      {pickedNone ? (
        <p className="mt-3 text-xs text-muted">
          {onePerChoice ? "Pick a number first." : "Pick a print first."}
        </p>
      ) : null}

      {inCart > 0 ? (
        <p className="mt-3 text-xs text-muted">
          {onePerChoice
            ? `${piecesInCart} ${linesHere.length === 1 ? "is" : "are"} in your cart.`
            : `${inCart} in your cart.`}{" "}
          <Link href="/cart" className="font-medium text-berry hover:underline">
            View cart
          </Link>
        </p>
      ) : null}

      {noneLeft && inCart > 0 && !onePerChoice ? (
        <p className="mt-1 text-xs text-muted">
          That is all we have ready. Enquire if you would like more made.
        </p>
      ) : null}
    </div>
  );
}
