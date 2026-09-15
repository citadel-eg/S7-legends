'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAdminSession } from '@/lib/actions/auth-actions';

export async function createCategory(data: {
  name: string;
  slug: string;
  description?: string | null;
  active?: boolean;
}) {
  const { isAdmin } = await verifyAdminSession();
  if (!isAdmin) return { success: false, error: 'Non autorisé' };

  const adminClient = createAdminClient();
  const { data: newCat, error } = await adminClient
    .from('categories')
    .insert([{
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      active: data.active ?? true,
    }])
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  revalidatePath('/', 'layout');
  return { success: true, category: newCat };
}

export async function updateCategory(
  id: string,
  data: {
    name: string;
    slug: string;
    description?: string | null;
    active?: boolean;
  }
) {
  const { isAdmin } = await verifyAdminSession();
  if (!isAdmin) return { success: false, error: 'Non autorisé' };

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from('categories')
    .update({
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      active: data.active ?? true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/', 'layout');
  return { success: true };
}

export async function deleteCategory(id: string) {
  const { isAdmin } = await verifyAdminSession();
  if (!isAdmin) return { success: false, error: 'Non autorisé' };

  const adminClient = createAdminClient();

  // Check if category has products
  const { data: products } = await adminClient
    .from('products')
    .select('id')
    .eq('category_id', id)
    .limit(1);

  if (products && products.length > 0) {
    return {
      success: false,
      error: 'Impossible de supprimer cette catégorie car des maillots y sont rattachés.',
    };
  }

  const { error } = await adminClient.from('categories').delete().eq('id', id);
  if (error) return { success: false, error: error.message };

  revalidatePath('/', 'layout');
  return { success: true };
}
