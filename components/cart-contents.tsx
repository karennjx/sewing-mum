"use client";

import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  cartTotal,
  clearCart,
  describeLines,
  money,
  removeFromCart,
  resolveCartLines,
  setQuantity,
  useCart,
  type CartProduct,
} from "@/lib/cart";
import { site, whatsappLink } from "@/lib/site";

const subscribe = () => () => {};
const onClient = () => true;
const onServer = () => false;

export function CartContents({
  products,
}: {
  products: readonly CartProduct[];
}) {
  // The cart lives in the browser, so the server renders it empty. Without
  // this the page would say "your cart is empty" for a beat before the real
  // contents appeared, to someone who knows perfectly well that it is not.
  const hydrated = useSyncExternalStore(subscribe, onClient, onServer);
  const cart = useCart();

  const lines = resolveCartLines(cart, products);
  const total = cartTotal(lines);

  if (!hydrated) {
    return <p className="mt-10 text-muted">Getting your cart…</p>;
  }

  if (lines.length === 0) {
    return (
      <div className="mt-10">
        <p className="leading-relaxed text-muted">
          Nothing in your cart yet.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-berry px-6 py-3 font-medium text-cream transition-colors hover:bg-berry-dark"
        >
          Have a look at what we make
        </Link>
      </div>
    );
  }

  const enquiryMessage = [
    `Hi ${site.name}! I would like to order:`,
    ...describeLines(lines),
    `Total: ${money(total)}`,
    "Could you confirm what is ready, and how we arrange delivery?",
  ].join("\n");

  return (
    <div className="mt-8">
      <ul className="divide-y divide-linen-dark/60 border-y border-linen-dark/60">
        {lines.map(({ line, product, price }) => (
          <li
            key={`${line.slug}-${line.print ?? ""}`}
            className="flex gap-4 py-5"
          >
            <Link
              href={`/products/${product.slug}`}
              className="h-24 w-24 shrink-0 overflow-hidden bg-linen"
            >
              <Image
                src={product.image.src}
                alt={product.image.alt}
                width={product.image.width}
                height={product.image.height}
                sizes="96px"
                className="h-full w-full object-cover"
              />
            </Link>

            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <Link
                  href={`/products/${product.slug}`}
                  className="font-display leading-snug font-semibold text-ink hover:text-berry"
                >
                  {product.name}
                </Link>
                <span className="font-medium text-ink tabular-nums">
                  {money(price * line.quantity)}
                </span>
              </div>

              {line.print ? (
                <p className="text-sm text-muted">{line.print}</p>
              ) : null}

              <div className="mt-1 flex flex-wrap items-center gap-4">
                <div className="flex items-center rounded-full border border-linen-dark">
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity(line.slug, line.print, line.quantity - 1)
                    }
                    aria-label={`One fewer ${product.name}`}
                    className="px-3 py-1.5 text-sm text-ink transition-colors hover:text-berry"
                  >
                    &minus;
                  </button>
                  <span className="min-w-7 text-center text-sm font-medium tabular-nums">
                    {line.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity(line.slug, line.print, line.quantity + 1)
                    }
                    aria-label={`One more ${product.name}`}
                    className="px-3 py-1.5 text-sm text-ink transition-colors hover:text-berry"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => removeFromCart(line.slug, line.print)}
                  className="text-sm text-muted transition-colors hover:text-berry"
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-baseline justify-between">
        <span className="font-display text-lg font-semibold text-ink">
          Total
        </span>
        <span className="font-display text-xl font-semibold text-ink tabular-nums">
          {money(total)}
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Pieces only. Delivery is worked out with you once we know where it is
        going.
      </p>

      <Link
        href="/checkout"
        className="mt-6 inline-flex items-center justify-center rounded-full bg-berry px-6 py-3 font-medium text-cream transition-colors hover:bg-berry-dark"
      >
        Checkout
      </Link>
      <p className="mt-3 text-xs leading-relaxed text-muted">
        Pay by PayNow. Nothing is charged automatically and no card details are
        taken.
      </p>

      {/* Kept for anyone who would rather just talk to a person, or cannot use
          PayNow. It is the route the shop ran on before there was a checkout. */}
      <p className="mt-6 text-sm text-muted">
        Or{" "}
        <a
          href={whatsappLink(enquiryMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-berry hover:underline"
        >
          send this order on WhatsApp
        </a>{" "}
        and we will take it from there.
      </p>

      <button
        type="button"
        onClick={clearCart}
        className="mt-8 text-sm text-muted transition-colors hover:text-berry"
      >
        Empty the cart
      </button>
    </div>
  );
}
