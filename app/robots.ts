import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Required so robots.txt can also be emitted by `output: "export"` builds.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
