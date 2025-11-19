
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://vishwavidarshana.com';
  const lastModified = new Date().toISOString().split('T')[0];

  const routes = [
    // Main pages
    { url: '/', priority: 1.0, changeFrequency: 'daily' },
    { url: '/about', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/contact', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/esystemlk', priority: 0.9, changeFrequency: 'monthly' },
    { url: '/design-services', priority: 0.9, changeFrequency: 'monthly' },
    { url: '/design-studio', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/quotation-generator', priority: 0.8, changeFrequency: 'weekly' },
    { url: '/quotation', priority: 0.8, changeFrequency: 'weekly' },
    { url: '/marketplace', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/appointments', priority: 0.6, changeFrequency: 'monthly' },

    // E-commerce & Gaming
    { url: '/freefire-topup', priority: 1.0, changeFrequency: 'daily' },
    { url: '/games', priority: 0.9, changeFrequency: 'daily' },
    { url: '/tournaments', priority: 0.9, changeFrequency: 'daily' },
    { url: '/tournaments/submit', priority: 0.7, changeFrequency: 'weekly' },

    // Tools
    { url: '/tools', priority: 0.9, changeFrequency: 'weekly' },
    { url: '/tools/file-converter', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/tools/pdf-suite', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/tools/image-resizer', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/tools/image-cropper', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/tools/file-encryption', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/tools/password-generator', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/tools/jwt-decoder', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/tools/json-csv-converter', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/tools/code-minifier', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/tools/regex-tester', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/tools/api-tester', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/tools/markdown-converter', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/tools/qr-generator', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/tools/barcode-generator', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/tools/qr-scanner', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/tools/color-palette-generator', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/tools/video-converter', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/games/point-calculator', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/games/tournament-budget-calculator', priority: 0.8, changeFrequency: 'monthly' },

    // Legal
    { url: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
    { url: '/terms', priority: 0.3, changeFrequency: 'yearly' },
    { url: '/refund-policy', priority: 0.3, changeFrequency: 'yearly' },

    // Auth & User
    { url: '/auth', priority: 0.4, changeFrequency: 'monthly' },
    { url: '/dashboard', priority: 0.6, changeFrequency: 'weekly' },
    { url: '/my-orders', priority: 0.6, changeFrequency: 'weekly' },
    { url: '/dashboard/my-tournaments', priority: 0.6, changeFrequency: 'weekly' },
    { url: '/messages', priority: 0.5, changeFrequency: 'weekly' },
    { url: '/admin', priority: 0.1, changeFrequency: 'weekly' },
  ];

  return routes.map(({ url, priority, changeFrequency }) => ({
    url: `${baseUrl}${url}`,
    lastModified,
    changeFrequency: changeFrequency as MetadataRoute.Sitemap[0]['changeFrequency'],
    priority,
  }));
}
