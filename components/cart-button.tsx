"use client";

import Link from "next/link";
import { useCartCount } from "@/lib/cart";

/**
 * The cart link in the header. Renders with no count on the server and during
 * hydration, since the cart only exists in the browser — so the badge appears
 * a moment after the rest of the header, rather than flickering a wrong number.
 */
export function CartButton() {
  const count = useCartCount();

  return (
    <Link
      href="/cart"
      aria-label={count > 0 ? `Cart, ${count} in it` : "Cart, empty"}
      className="relative text-muted transition-colors hover:text-berry"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-6 w-6"
      >
        <path d="M6 8h12l-1 12H7L6 8Z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </svg>
      {count > 0 ? (
        <span
          aria-hidden="true"
          className="absolute -top-1.5 -right-2 min-w-[1.15rem] rounded-full bg-berry px-1 text-center text-[0.7rem] leading-[1.15rem] font-medium text-cream"
        >
          {count}
        </span>
      ) : null}
    </Link>
  );
}
