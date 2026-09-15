import React from 'react';
import { notFound } from 'next/navigation';
import { fetchAdminCategories, fetchAdminProductById } from '@/lib/queries/admin';
import { ProductForm } from '@/components/admin/product-form';

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
      <ProductForm initialData={product} categories={categories} />
    </div>
  );
}
