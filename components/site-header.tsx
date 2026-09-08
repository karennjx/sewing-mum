import Image from "next/image";
import Link from "next/link";
import { ProductsMenu } from "@/components/products-menu";
import { getCategories } from "@/lib/catalog";
import { site, whatsappLink } from "@/lib/site";

export function SiteHeader() {
  const categories = getCategories();

  return (
    <header className="sticky top-0 z-30 border-b border-linen-dark/60 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <Link href="/" className="flex items-center" aria-label={site.name}>
          <Image
            src="/brand/sewing-mums-wordmark.png"
            alt={site.name}
            width={799}
            height={359}
            loading="eager"
            className="h-12 w-auto sm:h-14"
          />
        </Link>

        <nav className="flex items-center gap-5 text-sm">
          <ProductsMenu categories={categories} />
          <Link
            href="/about"
            className="text-muted transition-colors hover:text-berry"
          >
            Our story
          </Link>
          <Link
            href="/reviews"
            className="text-muted transition-colors hover:text-berry"
          >
            Reviews
          </Link>
          <a
            href={whatsappLink(
              `Hi ${site.name}! I came from your website and would like to ask about your handmade pieces.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-berry px-4 py-2 font-medium text-cream transition-colors hover:bg-berry-dark"
          >
            Enquire
          </a>
        </nav>
      </div>
    </header>
  );
}
