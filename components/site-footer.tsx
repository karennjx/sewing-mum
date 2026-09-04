import Link from "next/link";
import { getCategories } from "@/lib/catalog";
import { site, whatsappLink } from "@/lib/site";

export function SiteFooter() {
  const categories = getCategories();

  return (
    <footer className="mt-20 border-t border-linen-dark/60 bg-linen/50">
      <div className="mx-auto grid max-w-5xl gap-10 px-5 py-12 sm:grid-cols-3">
        <div>
          <p className="font-display text-xl font-semibold text-ink">
            {site.name}
          </p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">
            {site.description}
          </p>
        </div>

        <div>
          <p className="text-xs tracking-wider text-muted uppercase">Browse</p>
          <ul className="mt-3 space-y-2 text-sm">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/products#${category.slug}`}
                  className="text-ink transition-colors hover:text-berry"
                >
                  {category.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/about"
                className="text-ink transition-colors hover:text-berry"
              >
                Our story
              </Link>
            </li>
            <li>
              <Link
                href="/reviews"
                className="text-ink transition-colors hover:text-berry"
              >
                Reviews
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs tracking-wider text-muted uppercase">
            Get in touch
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a
                href={whatsappLink(`Hi ${site.name}! I have a question.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink transition-colors hover:text-berry"
              >
                WhatsApp us
              </a>
            </li>
            <li>
              <a
                href={site.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink transition-colors hover:text-berry"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                className="text-ink transition-colors hover:text-berry"
              >
                {site.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-linen-dark/60 px-5 py-5">
        <p className="mx-auto max-w-5xl text-xs text-muted">
          Every piece is made by hand, so no two are exactly alike.
        </p>
      </div>
    </footer>
  );
}
