import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/usluge/uvoz", priority: 0.9 },
    { path: "/usluge/prijevoz", priority: 0.9 },
    { path: "/o-nama", priority: 0.6 },
    { path: "/kontakt", priority: 0.7 },
  ];
  return pages.map(({ path, priority }) => ({
    url: `${SITE.url}${path}`,
    changeFrequency: "monthly",
    priority,
  }));
}
