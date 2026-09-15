import React from 'react';
import { fetchAdminCategories } from '@/lib/queries/admin';
import { ProductForm } from '@/components/admin/product-form';

export default async function NewProductPage() {
  const categories = await fetchAdminCategories();

  return (
    <div className="space-y-6">
      <ProductForm categories={categories} />
    </div>
  );
}
