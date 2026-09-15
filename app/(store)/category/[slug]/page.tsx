import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getActiveCategories, getFilteredProducts } from '@/lib/queries/storefront';
import { ShopView } from '@/components/shop/shop-view';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    size?: string;
    search?: string;
    sort?: string;
    page?: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getActiveCategories();
  const category = categories.find((c) => c.slug.toLowerCase() === slug.toLowerCase());

  if (!category) {
    return {
      title: 'Catégorie non trouvée — S7 LÉGENDES',
    };
  }

  return {
    title: `${category.name} — Maillots Rares | S7 LÉGENDES`,
    description: category.description || `Découvrez nos maillots de football vintage dans la catégorie ${category.name}.`,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const sParams = await searchParams;
  const size = typeof sParams.size === 'string' ? sParams.size : undefined;
  const search = typeof sParams.search === 'string' ? sParams.search : undefined;
  const sortBy = (typeof sParams.sort === 'string' ? sParams.sort : 'featured') as
    | 'featured'
    | 'price_asc'
    | 'price_desc'
    | 'newest';
  const page = typeof sParams.page === 'string' ? parseInt(sParams.page, 10) || 1 : 1;
  const itemsPerPage = 9;

  const [categories, { products, totalCount }] = await Promise.all([
    getActiveCategories(),
    getFilteredProducts({
      categorySlug: slug,
      size,
      search,
      sortBy,
      page,
      limit: itemsPerPage,
    }),
  ]);

  const category = categories.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
  if (!category) {
    notFound();
  }

  return (
    <ShopView
      categories={categories}
      initialProducts={products}
      totalCount={totalCount}
      currentPage={page}
      itemsPerPage={itemsPerPage}
      selectedCategory={category.slug}
      selectedSize={size || 'all'}
      searchQuery={search || ''}
      sortBy={sortBy}
    />
  );
}
