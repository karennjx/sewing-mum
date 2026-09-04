import Link from "next/link";
import { site, whatsappLink } from "@/lib/site";

const NAV_LINKS = [
  { href: "/products", label: "Products" },
  { href: "/about", label: "Our story" },
  { href: "/reviews", label: "Reviews" },
] as const;

export function SiteHeader() {
  return (
    <header className="border-b border-linen-dark/60 bg-cream/95 sticky top-0 z-10 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <Link href="/" className="group flex flex-col">
          <span className="font-display text-2xl leading-none font-semibold tracking-tight text-ink group-hover:text-berry">
            {site.name}
          </span>
          <span className="text-xs tracking-wide text-muted uppercase">
            {site.tagline}
          </span>
        </Link>

        <nav className="flex items-center gap-5 text-sm">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted transition-colors hover:text-berry"
            >
              {link.label}
            </Link>
          ))}
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
