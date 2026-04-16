import type { MetadataRoute } from 'next';
import { TURFS } from '@/lib/data/turfs';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://turfbook.in';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/turfs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/auth/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/auth/signup`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  const turfRoutes: MetadataRoute.Sitemap = TURFS.map(turf => ({
    url: `${base}/turfs/${turf.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...turfRoutes];
}
