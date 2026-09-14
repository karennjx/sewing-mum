import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/catalog";
import { site } from "@/lib/site";

// Required so the sitemap can also be emitted by `output: "export"` builds.
export const dynamic = "force-static";

const STATIC_ROUTES = [
  "",
  "/products",
  "/corporate",
  "/about",
  "/reviews",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...STATIC_ROUTES.map((route) => ({
      url: `${site.url}${route}`,
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.8,
    })),
    ...getAllProducts().map((product) => ({
      url: `${site.url}/products/${product.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
