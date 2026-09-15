import React from 'react';
import { notFound } from 'next/navigation';
import { fetchAdminCategories, fetchAdminProductById } from '@/lib/queries/admin';
import { ProductForm } from '@/components/admin/product-form';
import { t } from '@/i18n';

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const [categories, product] = await Promise.all([
    fetchAdminCategories(),
    fetchAdminProductById(id),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight uppercase text-vintage-dark">
          {t('admin.editProduct')}: {product.name}
        </h1>
        <p className="text-xs text-[#71717A] mt-0.5">
          Modifiez les prix, les tailles disponibles, les photos et le statut
        </p>
      </div>

      <ProductForm initialData={product} categories={categories} />
    </div>
  );
}
