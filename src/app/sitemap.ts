import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://example.com';
  return [
    { url: `${base}/`, priority: 1.0 },
    { url: `${base}/apply`, priority: 0.9 },
    { url: `${base}/portfolio/new`, priority: 0.7 },
    { url: `${base}/teacher`, priority: 0.6 },
    { url: `${base}/about`, priority: 0.4 },
    { url: `${base}/contact`, priority: 0.4 },
  ];
}

