import type { Metadata } from "next";
import { CartContents } from "@/components/cart-contents";
import type { CartProduct } from "@/lib/cart";
import { getAllProducts, isOneOfAKind } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Your cart",
  description:
    "The pieces you have picked out, ready to send over to us as an order.",
  // Nothing here is worth indexing, and a cart in search results is only ever
  // an empty one.
  robots: { index: false, follow: true },
};

export default function CartPage() {
  // Read on the server so the whole catalogue is not shipped to the browser
  // for the sake of three lines: only what a line needs to be drawn crosses
  // over, and it goes through the catalogue module like everything else.
  const products: CartProduct[] = getAllProducts().map((product) => ({
    slug: product.slug,
    name: product.name,
    price: product.price,
    image: product.images[0],
    options: product.variants?.map((variant) => variant.name) ?? null,
    onePerChoice: isOneOfAKind(product),
  }));

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 lg:py-14">
      <h1 className="font-display text-3xl leading-tight font-semibold tracking-tight text-ink sm:text-4xl">
        Your cart
      </h1>
      <CartContents products={products} />
    </div>
  );
}
