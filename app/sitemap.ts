import type { MetadataRoute } from "next";

// Dynamic sitemap for localized routes
const baseUrl = process.env.NEXT_PUBLIC_DOMAIN;
const locales = ["ru", "kz"] as const;

// List only real, indexable paths
const localizedPaths = [
  "", // home
  "/(policies)/privacy",
  "/(policies)/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return locales.flatMap(locale =>
    localizedPaths.map(path => ({
      url: `${baseUrl}/${locale}${path.replace("/(policies)", "")}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: path === "" ? 1.0 : 0.7,
    }))
  );
}
