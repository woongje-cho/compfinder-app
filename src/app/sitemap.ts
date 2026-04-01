import type { MetadataRoute } from "next";
import { getAllCompetitions, getAllSeries } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://compfinder.vercel.app";

  const competitions = getAllCompetitions().map((c) => ({
    url: `${baseUrl}/competitions/${c.slug}`,
    lastModified: new Date(c.lastUpdated),
    changeFrequency: "weekly" as const,
    priority: c.tier === "S" ? 0.9 : c.tier === "A" ? 0.8 : 0.6,
  }));

  const series = getAllSeries().map((s) => ({
    url: `${baseUrl}/series/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/competitions`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/series`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/timeline`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    ...competitions,
    ...series,
  ];
}
