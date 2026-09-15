import type { MetadataRoute } from 'next';
import { getActiveProducts, getActiveCategories } from '@/lib/queries/storefront';

const SITE_URL = 'https://s7-legends.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Dynamic product pages
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const products = await getActiveProducts({});
    productPages = products.map((product) => ({
      url: `${SITE_URL}/product/${product.slug}`,
      lastModified: new Date(product.updated_at || product.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch {
    // If fetching fails, continue with static pages only
  }

  // Dynamic category pages
  let categoryPages: MetadataRoute.Sitemap = [];
  try {
    const categories = await getActiveCategories();
    categoryPages = categories.map((category) => ({
      url: `${SITE_URL}/category/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch {
    // If fetching fails, continue without category pages
  }

  return [...staticPages, ...productPages, ...categoryPages];
}
