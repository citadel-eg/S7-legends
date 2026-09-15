'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { productFormSchema, ProductFormValues } from '@/lib/validations/product';
import { verifyAdminSession } from '@/lib/actions/auth-actions';

export async function createProduct(values: ProductFormValues) {
  const { isAdmin } = await verifyAdminSession();
  if (!isAdmin) {
    return { success: false, error: 'Non autorisé' };
  }

  const validated = productFormSchema.safeParse(values);
  if (!validated.success) {
    return { success: false, error: validated.error.errors[0]?.message || 'Validation échouée' };
  }

  const { variants, images, ...productData } = validated.data;
  const adminClient = createAdminClient();

  // 1. Insert product
  const { data: newProduct, error: prodErr } = await adminClient
    .from('products')
    .insert([productData])
    .select()
    .single();

  if (prodErr || !newProduct) {
    return { success: false, error: prodErr?.message || 'Erreur création produit' };
  }

  // 2. Insert variants
  if (variants && variants.length > 0) {
    const variantsToInsert = variants.map((v) => ({
      product_id: newProduct.id,
      size: v.size,
      stock: v.stock,
      available: v.available,
    }));
    await adminClient.from('product_variants').insert(variantsToInsert);
  }

  // 3. Insert images
  if (images && images.length > 0) {
    const imagesToInsert = images.map((img, idx) => ({
      product_id: newProduct.id,
      image_url: img.image_url,
      alt_text: img.alt_text || newProduct.name,
      sort_order: img.sort_order ?? idx,
      is_primary: img.is_primary ?? (idx === 0),
    }));
    await adminClient.from('product_images').insert(imagesToInsert);
  }

  revalidatePath('/', 'layout');
  return { success: true, product: newProduct };
}

export async function updateProduct(id: string, values: ProductFormValues) {
  const { isAdmin } = await verifyAdminSession();
  if (!isAdmin) {
    return { success: false, error: 'Non autorisé' };
  }

  const validated = productFormSchema.safeParse(values);
  if (!validated.success) {
    return { success: false, error: validated.error.errors[0]?.message || 'Validation échouée' };
  }

  const { variants, images, ...productData } = validated.data;
  const adminClient = createAdminClient();

  // 1. Update product details
  const { error: prodErr } = await adminClient
    .from('products')
    .update({ ...productData, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (prodErr) {
    return { success: false, error: prodErr.message };
  }

  // 2. Upsert / update variants
  if (variants) {
    // Delete existing variants and re-insert
    await adminClient.from('product_variants').delete().eq('product_id', id);
    const variantsToInsert = variants.map((v) => ({
      product_id: id,
      size: v.size,
      stock: v.stock,
      available: v.available,
    }));
    await adminClient.from('product_variants').insert(variantsToInsert);
  }

  // 3. Update images
  if (images) {
    await adminClient.from('product_images').delete().eq('product_id', id);
    const imagesToInsert = images.map((img, idx) => ({
      product_id: id,
      image_url: img.image_url,
      alt_text: img.alt_text || productData.name,
      sort_order: img.sort_order ?? idx,
      is_primary: img.is_primary ?? (idx === 0),
    }));
    await adminClient.from('product_images').insert(imagesToInsert);
  }

  revalidatePath('/', 'layout');
  return { success: true };
}

export async function toggleProductActive(id: string, active: boolean) {
  const { isAdmin } = await verifyAdminSession();
  if (!isAdmin) return { success: false, error: 'Non autorisé' };

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from('products')
    .update({ active, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/', 'layout');
  return { success: true };
}

export async function toggleProductFeatured(id: string, featured: boolean) {
  const { isAdmin } = await verifyAdminSession();
  if (!isAdmin) return { success: false, error: 'Non autorisé' };

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from('products')
    .update({ featured, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/', 'layout');
  return { success: true };
}

export async function deleteProduct(id: string) {
  const { isAdmin } = await verifyAdminSession();
  if (!isAdmin) return { success: false, error: 'Non autorisé' };

  const adminClient = createAdminClient();

  // Cascade delete relations
  await adminClient.from('product_images').delete().eq('product_id', id);
  await adminClient.from('product_variants').delete().eq('product_id', id);

  const { error } = await adminClient.from('products').delete().eq('id', id);
  if (error) return { success: false, error: error.message };

  revalidatePath('/', 'layout');
  return { success: true };
}
