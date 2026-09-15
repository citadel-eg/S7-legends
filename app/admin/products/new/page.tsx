import React from 'react';
import { fetchAdminCategories } from '@/lib/queries/admin';
import { ProductForm } from '@/components/admin/product-form';
import { t } from '@/i18n';

export default async function NewProductPage() {
  const categories = await fetchAdminCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight uppercase text-vintage-dark">
          {t('admin.addProduct')}
        </h1>
        <p className="text-xs text-[#71717A] mt-0.5">
          Ajoutez un nouveau maillot vintage avec ses tailles et ses photos
        </p>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
