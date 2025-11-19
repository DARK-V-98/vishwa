
import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.vishwavidarshana.com';

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
    '/tools',
    '/tools/jwt-decoder',
    '/tools/password-generator',
    '/tools/qr-generator',
    '/tools/qr-scanner',
    '/tools/barcode-generator',
    '/tools/file-encryption',
    '/tools/image-resizer',
    '/tools/image-cropper',
    '/tools/file-converter',
    '/tools/pdf-suite',
    '/tools/code-minifier',
    '/tools/regex-tester'
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

