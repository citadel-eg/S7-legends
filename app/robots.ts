import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/admin'],
      },
    ],
    sitemap: 'https://s7-legends.vercel.app/sitemap.xml',
  };
}
