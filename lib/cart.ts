"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import type { ProductImage } from "@/lib/catalog";
import { site } from "@/lib/site";

/**
 * The cart, held in the browser and nowhere else.
 *
 * Only what the shopper chose is stored: which piece, which print, how many.
 * Names, prices and photographs are looked up from the catalogue when the
 * cart is drawn, so a cart left open for a week cannot quote last week's
 * price back at us, and a product that gets renamed or withdrawn does not
 * leave a ghost behind.
 *
 * Nothing here reaches a server. Clearing site data empties the cart, and a
 * cart on a phone is not the cart on a laptop. That is a fair trade while
 * orders are confirmed by hand, but it does mean this must never be treated
 * as a record of an order.
 */

export type CartLine = {
  slug: string;
  /** The chosen print, or null for a piece that comes only one way. */
  print: string | null;
  quantity: number;
};

const STORAGE_KEY = "sewingmum.cart.v1";
/** Nobody is buying ninety of a handmade thing; this is a typo guard. */
const MAX_QUANTITY = 99;

// A single frozen empty array, not a fresh [] per call: useSyncExternalStore
// compares snapshots by identity and would re-render forever on a new one.
const EMPTY: readonly CartLine[] = Object.freeze([]);

let lines: readonly CartLine[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function isLine(value: unknown): value is CartLine {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const line = value as Record<string, unknown>;
  return (
    typeof line.slug === "string" &&
    (line.print === null || typeof line.print === "string") &&
    typeof line.quantity === "number" &&
    Number.isFinite(line.quantity) &&
    line.quantity > 0
  );
}

/** Anything unrecognisable is dropped rather than thrown: a shopper with a
 *  half-written cart from an older version should get an empty one, not a
 *  page that will not load. */
function readStored(): readonly CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return EMPTY;
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return EMPTY;
    }
    const valid = parsed.filter(isLine);
    return valid.length > 0 ? valid : EMPTY;
  } catch {
    return EMPTY;
  }
}

function commit(next: readonly CartLine[]) {
  lines = next.length > 0 ? next : EMPTY;
  loaded = true;
  try {
    if (lines.length > 0) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Private browsing and full quotas both throw here. The cart still works
    // for this visit; it just will not survive a reload.
  }
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): readonly CartLine[] {
  if (!loaded) {
    lines = readStored();
    loaded = true;
  }
  return lines;
}

function getServerSnapshot(): readonly CartLine[] {
  return EMPTY;
}

// Two tabs open on the same shop is common enough, and a cart that disagrees
// with itself between them is the kind of thing people report as lost items.
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key !== null && event.key !== STORAGE_KEY) {
      return;
    }
    lines = readStored();
    loaded = true;
    for (const listener of listeners) {
      listener();
    }
  });
}

function sameLine(line: CartLine, slug: string, print: string | null): boolean {
  return line.slug === slug && line.print === print;
}

function clamp(quantity: number): number {
  return Math.max(1, Math.min(MAX_QUANTITY, Math.round(quantity)));
}

export function useCart(): readonly CartLine[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Total pieces, not total lines: the header badge counts things, not rows. */
export function useCartCount(): number {
  const cart = useCart();
  return cart.reduce((total, line) => total + line.quantity, 0);
}

export function addToCart(
  slug: string,
  print: string | null,
  quantity = 1,
): void {
  const current = getSnapshot();
  const existing = current.find((line) => sameLine(line, slug, print));
  if (existing) {
    commit(
      current.map((line) =>
        sameLine(line, slug, print)
          ? { ...line, quantity: clamp(line.quantity + quantity) }
          : line,
      ),
    );
    return;
  }
  commit([...current, { slug, print, quantity: clamp(quantity) }]);
}

export function setQuantity(
  slug: string,
  print: string | null,
  quantity: number,
): void {
  if (quantity < 1) {
    removeFromCart(slug, print);
    return;
  }
  commit(
    getSnapshot().map((line) =>
      sameLine(line, slug, print) ? { ...line, quantity: clamp(quantity) } : line,
    ),
  );
}

export function removeFromCart(slug: string, print: string | null): void {
  commit(getSnapshot().filter((line) => !sameLine(line, slug, print)));
}

export function clearCart(): void {
  commit(EMPTY);
}

/**
 * What the cart needs to know about a product to show a line. Pages read this
 * out of the catalogue on the server and hand it down, so rendering three rows
 * does not mean shipping the whole catalogue to the browser.
 */
export type CartProduct = {
  slug: string;
  name: string;
  price: number | null;
  image: ProductImage;
  /** The variant names still on offer, or null for a piece with none. */
  options: readonly string[] | null;
  /** Each variant is a single item, so a line can never be more than one. */
  onePerChoice: boolean;
};

export type ResolvedLine = {
  line: CartLine;
  product: CartProduct;
  /** The product's price, narrowed to a number by resolving. */
  price: number;
};

/**
 * Pairs stored lines with their products, dropping any whose product has
 * since lost its price or left the catalogue, or whose print or numbered piece
 * is no longer listed — which for a one-off owl means someone else bought it.
 * Those are dropped rather than shown as unbuyable because it was Kim's
 * change, not the shopper's mistake, and there is nothing for them to do
 * about it.
 */
export function resolveCartLines(
  cart: readonly CartLine[],
  products: readonly CartProduct[],
): ResolvedLine[] {
  const bySlug = new Map(products.map((product) => [product.slug, product]));
  return cart.flatMap((line) => {
    const product = bySlug.get(line.slug);
    if (!product || product.price === null) {
      return [];
    }
    if (
      product.options !== null &&
      (line.print === null || !product.options.includes(line.print))
    ) {
      return [];
    }
    const resolved =
      product.onePerChoice && line.quantity !== 1 ? { ...line, quantity: 1 } : line;
    return [{ line: resolved, product, price: product.price }];
  });
}

/**
 * The cart resolved against the catalogue, with whatever was dropped or capped
 * written back to storage. Otherwise the header badge, which only sees the
 * stored lines, would go on counting an owl that has sold after the cart
 * itself stopped showing it.
 */
export function useResolvedCart(
  products: readonly CartProduct[],
): ResolvedLine[] {
  const cart = useCart();
  const resolved = useMemo(
    () => resolveCartLines(cart, products),
    [cart, products],
  );

  useEffect(() => {
    const changed =
      resolved.length !== cart.length ||
      resolved.some(({ line }, index) => line !== cart[index]);
    if (changed) {
      commit(resolved.map(({ line }) => line));
    }
  }, [cart, resolved]);

  return resolved;
}

export function cartTotal(lines: readonly ResolvedLine[]): number {
  return lines.reduce((sum, { line, price }) => sum + price * line.quantity, 0);
}

export function money(amount: number): string {
  return `${site.currencySymbol}${amount}`;
}

/** The order as lines of text, for pasting into a WhatsApp message. */
export function describeLines(lines: readonly ResolvedLine[]): string[] {
  return lines.map(
    ({ line, product, price }) =>
      `- ${line.quantity} x ${product.name}${
        line.print ? ` (${line.print.toLowerCase()})` : ""
      } - ${money(price * line.quantity)}`,
  );
}
