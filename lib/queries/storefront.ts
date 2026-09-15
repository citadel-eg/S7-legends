import { createClient } from '@/lib/supabase/server';
import { Category, ProductWithDetails } from '@/types/database';

export async function getActiveCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('active', true)
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  return data || [];
}

export interface FilterProductsOptions {
  categoryId?: string;
  categorySlug?: string;
  featuredOnly?: boolean;
  search?: string;
  size?: string;
  sortBy?: 'featured' | 'price_asc' | 'price_desc' | 'newest';
  page?: number;
  limit?: number;
}

export async function getFilteredProducts(options: FilterProductsOptions = {}): Promise<{
  products: ProductWithDetails[];
  totalCount: number;
}> {
  const supabase = await createClient();
  const page = options.page && options.page > 0 ? options.page : 1;
  const limit = options.limit || 9;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('products')
    .select(
      `
      *,
      category:categories(*),
      variants:product_variants(*),
      images:product_images(*)
    `,
      { count: 'exact' }
    )
    .eq('active', true);

  if (options.featuredOnly) {
    query = query.eq('featured', true);
  }

  // Backend Category filter
  if (options.categoryId) {
    query = query.eq('category_id', options.categoryId);
  } else if (options.categorySlug && options.categorySlug !== 'all') {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .ilike('slug', options.categorySlug)
      .maybeSingle();

    if (cat) {
      query = query.eq('category_id', cat.id);
    } else {
      return { products: [], totalCount: 0 };
    }
  }

  // Backend Size filter (via product_variants join lookup)
  if (options.size && options.size !== 'all') {
    const { data: variantMatches } = await supabase
      .from('product_variants')
      .select('product_id')
      .ilike('size', options.size)
      .eq('available', true)
      .gt('stock', 0);

    const productIds = Array.from(new Set(variantMatches?.map((v) => v.product_id) || []));
    if (productIds.length === 0) {
      return { products: [], totalCount: 0 };
    }
    query = query.in('id', productIds);
  }

  // Backend Search filter (search across name, player, team, year)
  if (options.search && options.search.trim()) {
    const s = options.search.trim();
    if (!isNaN(Number(s))) {
      query = query.or(`name.ilike.%${s}%,player.ilike.%${s}%,team.ilike.%${s}%,year.eq.${s}`);
    } else {
      query = query.or(`name.ilike.%${s}%,player.ilike.%${s}%,team.ilike.%${s}%`);
    }
  }

  // Backend Sorting
  if (options.sortBy === 'price_asc') {
    query = query.order('price', { ascending: true });
  } else if (options.sortBy === 'price_desc') {
    query = query.order('price', { ascending: false });
  } else if (options.sortBy === 'newest') {
    query = query.order('created_at', { ascending: false });
  } else {
    // Featured first, then newest
    query = query
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false });
  }

  // Backend Pagination
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching filtered products from backend:', error);
    return { products: [], totalCount: 0 };
  }

  const products: ProductWithDetails[] = (data || []).map((p) => {
    const availableVariants = (p.variants || []).filter(
      (v: { available: boolean; stock: number }) => v.available && v.stock > 0
    );

    let sortedImages = (p.images || []).sort(
      (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order
    );

    if (sortedImages.length === 0) {
      sortedImages = [
        {
          id: `img-${p.id}`,
          product_id: p.id,
          image_url: '/assets/hero-rack.png',
          alt_text: p.name,
          sort_order: 0,
          is_primary: true,
          created_at: new Date().toISOString(),
        },
      ];
    }

    return {
      ...p,
      variants: availableVariants,
      images: sortedImages,
    };
  });

  return {
    products,
    totalCount: count ?? products.length,
  };
}

export async function getActiveProducts(
  options?: FilterProductsOptions
): Promise<ProductWithDetails[]> {
  const result = await getFilteredProducts(options);
  return result.products;
}

export async function getProductBySlug(slug: string): Promise<ProductWithDetails | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      variants:product_variants(*),
      images:product_images(*)
    `)
    .eq('slug', slug)
    .eq('active', true)
    .single();

  if (error || !data) {
    return null;
  }

  const availableVariants = (data.variants || []).filter(
    (v: { available: boolean; stock: number }) => v.available && v.stock > 0
  );

  let sortedImages = (data.images || []).sort(
    (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order
  );

  if (sortedImages.length === 0) {
    sortedImages = [
      {
        id: `img-${data.id}-main`,
        product_id: data.id,
        image_url: '/assets/hero-rack.png',
        alt_text: data.name,
        sort_order: 0,
        is_primary: true,
        created_at: new Date().toISOString(),
      },
    ];
  }

  return {
    ...data,
    variants: availableVariants,
    images: sortedImages,
  };
}
