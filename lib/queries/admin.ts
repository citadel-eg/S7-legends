import { createClient } from '@/lib/supabase/client';
import { Category, ProductWithDetails } from '@/types/database';

export interface AdminProductFilterOptions {
  search?: string;
  categoryId?: string;
}

export async function fetchAdminProducts(options?: AdminProductFilterOptions): Promise<ProductWithDetails[]> {
  const supabase = createClient();
  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      variants:product_variants(*),
      images:product_images(*)
    `);

  if (options?.categoryId && options.categoryId !== 'all') {
    query = query.eq('category_id', options.categoryId);
  }

  if (options?.search && options.search.trim() !== '') {
    const q = options.search.trim();
    // ilike backend search across name, player, team, and description
    query = query.or(`name.ilike.%${q}%,player.ilike.%${q}%,team.ilike.%${q}%,description.ilike.%${q}%`);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map((p) => ({
    ...p,
    variants: (p.variants || []).sort((a: { size: string }, b: { size: string }) => a.size.localeCompare(b.size)),
    images: (p.images || []).sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order),
  }));
}

export async function fetchAdminProductById(id: string): Promise<ProductWithDetails | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      variants:product_variants(*),
      images:product_images(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    ...data,
    variants: (data.variants || []).sort((a: { size: string }, b: { size: string }) => a.size.localeCompare(b.size)),
    images: (data.images || []).sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order),
  };
}

export async function fetchAdminCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function fetchAdminMetrics() {
  const supabase = createClient();

  const [productsRes, categoriesRes, variantsRes] = await Promise.all([
    supabase.from('products').select('id, active, featured'),
    supabase.from('categories').select('id, active'),
    supabase.from('product_variants').select('id, stock, available'),
  ]);

  const products = productsRes.data || [];
  const categories = categoriesRes.data || [];
  const variants = variantsRes.data || [];

  return {
    totalProducts: products.length,
    activeProducts: products.filter((p) => p.active).length,
    featuredProducts: products.filter((p) => p.featured).length,
    totalCategories: categories.length,
    lowStockVariants: variants.filter((v) => v.stock === 0 || !v.available).length,
  };
}
