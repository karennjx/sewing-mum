import Image from "next/image";
import Link from "next/link";
import { AvailabilityBadge } from "@/components/availability-badge";
import { formatPrice, type Product } from "@/lib/catalog";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const image = product.images[0];

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-card border border-linen-dark/60 bg-white transition-shadow hover:shadow-md"
    >
      <div className="aspect-square overflow-hidden bg-linen">
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
          priority={priority}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg leading-snug font-semibold text-ink group-hover:text-berry">
            {product.name}
          </h3>
          <span className="mt-0.5 font-medium whitespace-nowrap text-ink">
            {formatPrice(product.price)}
          </span>
        </div>
        <p className="flex-1 text-sm leading-relaxed text-muted">
          {product.blurb}
        </p>
        <div className="pt-1">
          <AvailabilityBadge product={product} />
        </div>
      </div>
    </Link>
  );
}
