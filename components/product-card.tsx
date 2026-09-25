import Image from "next/image";
import Link from "next/link";
import { AvailabilityBadge } from "@/components/availability-badge";
import { Badge } from "@/components/badge";
import {
  priceLabel,
  stockLabel,
  stockState,
  type Product,
} from "@/lib/catalog";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0];
  const stockNote = stockLabel(product);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden border border-linen-dark/60 bg-white transition-shadow hover:shadow-md"
    >
      <div className="aspect-square overflow-hidden bg-linen">
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          // Wider than the card, because the box is square and about half the
          // catalogue is landscape. object-cover on a 4:3 photo in a square box
          // scales it until the height fits, so the width it needs is a third
          // more than the card is wide; asking for the card width fetched 320
          // for a 427px job and the photos came out soft. The portrait ones
          // over-fetch a little as a result, which is the cheaper mistake.
          sizes="(min-width: 1024px) 430px, (min-width: 640px) 67vw, 133vw"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        {/* Price sits under the name rather than beside it: "Price on
            enquiry" is far longer than a figure and overflows a card-width
            row. */}
        <div>
          <h3 className="font-display text-lg leading-snug font-semibold text-ink group-hover:text-berry">
            {product.name}
          </h3>
          <p className="mt-1 text-sm font-medium text-muted">
            {product.comingSoon ? "Photograph coming" : priceLabel(product)}
          </p>
        </div>
        <p className="flex-1 text-sm leading-relaxed text-muted">
          {product.blurb}
        </p>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <AvailabilityBadge product={product} />
          {stockNote ? (
            <Badge tone={stockState(product) === "sold-out" ? "neutral" : "spool"}>
              {stockNote}
            </Badge>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
