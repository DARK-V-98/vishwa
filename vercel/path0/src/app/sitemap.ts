
import { MetadataRoute } from 'next';

const baseUrl = 'https://vishwavidarshana.com';

// This function tells Next.js which sitemaps to generate.
export async function generateSitemaps() {
  // In the future, you could generate sitemaps dynamically, e.g., for each year of blog posts.
  return [{ id: 'main' }, { id: 'tools' }];
}

// This function generates the sitemap for a given ID.
export default async function sitemap({
  id,
}: {
  id: 'main' | 'tools';
}): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date().toISOString().split('T')[0];

  if (id === 'tools') {
    const toolsRoutes = [
      '/tools',
      '/tools/file-converter',
      '/tools/pdf-suite',
      '/tools/image-resizer',
      '/tools/image-cropper',
      '/tools/file-encryption',
      '/tools/password-generator',
      '/tools/jwt-decoder',
      '/tools/json-csv-converter',
      '/tools/code-minifier',
      '/tools/regex-tester',
      '/tools/markdown-converter',
      '/tools/qr-generator',
      '/tools/barcode-generator',
      '/tools/qr-scanner',
      '/tools/color-palette-generator',
      '/tools/api-tester',
      '/games/point-calculator',
      '/games/tournament-budget-calculator',
    ];

    return toolsRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: lastModified,
      changeFrequency: route === '/tools' ? 'daily' : 'weekly',
      priority: route === '/tools' ? 1.0 : 0.8,
    }));
  }

  // Default to 'main' sitemap
  const mainRoutes = [
    { url: '/', changeFrequency: 'daily', priority: 1.0 },
    { url: '/about', changeFrequency: 'monthly', priority: 0.8 },
    { url: '/contact', changeFrequency: 'monthly', priority: 0.7 },
    { url: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
    { url: '/terms', changeFrequency: 'yearly', priority: 0.3 },
    { url: '/refund-policy', changeFrequency: 'yearly', priority: 0.3 },
    { url: '/esystemlk', changeFrequency: 'monthly', priority: 0.9 },
    { url: '/design-services', changeFrequency: 'monthly', priority: 0.9 },
    { url: '/design-studio', changeFrequency: 'monthly', priority: 0.8 },
    { url: '/quotation-generator', changeFrequency: 'weekly', priority: 0.8 },
    { url: '/quotation', changeFrequency: 'weekly', priority: 0.8 },
    { url: '/freefire-topup', changeFrequency: 'daily', priority: 1.0 },
    { url: '/games', changeFrequency: 'daily', priority: 0.9 },
    { url: '/tournaments', changeFrequency: 'daily', priority: 0.9 },
    { url: '/tournaments/submit', changeFrequency: 'weekly', priority: 0.7 },
    { url: '/dashboard', changeFrequency: 'weekly', priority: 0.6 },
    { url: '/dashboard/my-tournaments', changeFrequency: 'weekly', priority: 0.6 },
    { url: '/my-orders', changeFrequency: 'weekly', priority: 0.6 },
    { url: '/messages', changeFrequency: 'weekly', priority: 0.5 },
    { url: '/marketplace', changeFrequency: 'monthly', priority: 0.5 },
    { url: '/auth', changeFrequency: 'monthly', priority: 0.4 },
    { url: '/auth/complete-profile', changeFrequency: 'yearly', priority: 0.2 },
    { url: '/admin', changeFrequency: 'weekly', priority: 0.1 },
    { url: '/appointments', changeFrequency: 'monthly', priority: 0.6 },
  ];

  return mainRoutes.map((route) => ({
    url: `${baseUrl}${route.url}`,
    lastModified: lastModified,
    changeFrequency: route.changeFrequency as MetadataRoute.Sitemap[0]['changeFrequency'],
    priority: route.priority,
  }));
}
