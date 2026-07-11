import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { ROUTES } from "@/lib/links";

/**
 * Sitemap for every crawlable route. `ROUTES` is the single source of truth for
 * internal marketing pages, so new pages are picked up by adding them there.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = siteConfig.url.replace(/\/$/, "");

  const home: MetadataRoute.Sitemap[number] = {
    url: base,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 1,
  };

  // Prioritise the pages closest to conversion; everything else defaults lower.
  const priorityMap: Record<string, number> = {
    [ROUTES.pricing]: 0.9,
    [ROUTES.about]: 0.7,
    [ROUTES.contact]: 0.7,
    [ROUTES.security]: 0.7,
    [ROUTES.architecture]: 0.7,
    [ROUTES.faq]: 0.6,
  };

  const pages = Object.values(ROUTES)
    .filter((path) => path !== "/")
    .map((path) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: priorityMap[path] ?? 0.5,
    }));

  return [home, ...pages];
}
