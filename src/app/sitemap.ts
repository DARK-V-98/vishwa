import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://' + (process.env.NEXT_PUBLIC_VERCEL_URL || 'localhost:9002');

  const staticRoutes = [
    '/',
    '/about',
    '/appointments',
    '/auth',
    '/contact',
    '/dashboard',
    '/design-services',
    '/design-studio',
    '/esystemlk',
    '/freefire-topup',
    '/games',
    '/games/point-calculator',
    '/marketplace',
    '/messages',
    '/my-orders',
    '/privacy',
    '/quotation-generator',
    '/refund-policy',
    '/terms',
    '/tournaments',
    '/tournaments/submit',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '/' ? 1 : 0.8,
  }));
 
  // In the future, we can add dynamic routes here (e.g., for tournaments)
  // by fetching them from Firestore.

  return sitemapEntries;
}