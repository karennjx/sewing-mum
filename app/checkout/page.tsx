import type { Metadata } from "next";
import { Checkout } from "@/components/checkout";
import { getAllProducts, isOneOfAKind } from "@/lib/catalog";
import type { CartProduct } from "@/lib/cart";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Pay for your order by PayNow and send it over to us.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  const products: CartProduct[] = getAllProducts().map((product) => ({
    slug: product.slug,
    name: product.name,
    price: product.price,
    image: product.images[0],
    options: product.variants?.map((variant) => variant.name) ?? null,
    onePerChoice: isOneOfAKind(product),
  }));

  return (
    <div className="mx-auto max-w-2xl px-5 py-10 lg:py-14">
      <h1 className="font-display text-3xl leading-tight font-semibold tracking-tight text-ink sm:text-4xl">
        Checkout
      </h1>
      <Checkout products={products} />
    </div>
  );
}
