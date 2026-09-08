"use client";

import Link from "next/link";
import { useEffect, useState, type FocusEvent } from "react";
import type { CategoryInfo } from "@/lib/catalog";

/**
 * Opens on hover and on keyboard focus. The trigger stays a real link to
 * /products so that a click (or a tap, where hover does not exist) always
 * lands somewhere useful instead of toggling the panel shut again.
 */
export function ProductsMenu({
  categories,
}: {
  categories: readonly CategoryInfo[];
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const closeIfFocusLeft = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setOpen(false);
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={closeIfFocusLeft}
    >
      <Link
        href="/products"
        aria-expanded={open}
        className="flex items-center gap-1.5 text-muted transition-colors hover:text-berry"
      >
        Products
        <span
          aria-hidden="true"
          className={`text-[0.55em] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          &#9660;
        </span>
      </Link>

      {open ? (
        <div className="absolute top-full left-0 z-20 pt-3">
          <div className="w-68 overflow-hidden rounded-card border border-linen-dark bg-cream shadow-lg">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/products#${category.slug}`}
                onClick={() => setOpen(false)}
                className="block border-b border-linen-dark/60 px-4 py-3 transition-colors hover:bg-linen"
              >
                <span className="block text-sm font-medium text-ink">
                  {category.label}
                </span>
                <span className="mt-0.5 block text-xs leading-snug text-muted">
                  {category.short}
                </span>
              </Link>
            ))}
            <Link
              href="/products"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-berry transition-colors hover:bg-linen"
            >
              See everything &rarr;
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
