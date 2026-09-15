import { Metadata } from 'next';
import { getActiveCategories, getFilteredProducts } from '@/lib/queries/storefront';
import { ShopView } from '@/components/shop/shop-view';

export const metadata: Metadata = {
  title: 'Boutique — Achetez des Maillots Rares',
  description: 'Découvrez notre collection complète de maillots de football vintage, pièces rares, éditions de Ligue des Champions et Coupe du Monde.',
  openGraph: {
    title: 'Boutique — Maillots Rares | S7 LÉGENDES',
    description: 'Découvrez notre collection complète de maillots de football vintage, pièces rares, éditions de Ligue des Champions et Coupe du Monde.',
  },
};

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    size?: string;
    search?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const categorySlug = typeof params.category === 'string' ? params.category : undefined;
  const size = typeof params.size === 'string' ? params.size : undefined;
  const search = typeof params.search === 'string' ? params.search : undefined;
  const sortBy = (typeof params.sort === 'string' ? params.sort : 'featured') as
    | 'featured'
    | 'price_asc'
    | 'price_desc'
    | 'newest';
  const page = typeof params.page === 'string' ? parseInt(params.page, 10) || 1 : 1;
  const itemsPerPage = 9;

  const [categories, { products, totalCount }] = await Promise.all([
    getActiveCategories(),
    getFilteredProducts({
      categorySlug,
      size,
      search,
      sortBy,
      page,
      limit: itemsPerPage,
    }),
  ]);

  return (
    <ShopView
      categories={categories}
      initialProducts={products}
      totalCount={totalCount}
      currentPage={page}
      itemsPerPage={itemsPerPage}
      selectedCategory={categorySlug || 'all'}
      selectedSize={size || 'all'}
      searchQuery={search || ''}
      sortBy={sortBy}
    />
  );
}
