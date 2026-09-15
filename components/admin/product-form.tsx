'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, Trash2, Star, ArrowLeft, Loader2 } from 'lucide-react';
import { productFormSchema, ProductFormValues } from '@/lib/validations/product';
import { Category, ProductWithDetails } from '@/types/database';
import { createProduct, updateProduct } from '@/lib/actions/product-actions';
import { createClient } from '@/lib/supabase/client';
import { t } from '@/i18n';

interface ProductFormProps {
  initialData?: ProductWithDetails | null;
  categories: Category[];
}

const DEFAULT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export function ProductForm({ initialData, categories }: ProductFormProps) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Initialize variants
  const defaultVariants = DEFAULT_SIZES.map((size) => {
    const existing = initialData?.variants?.find((v) => v.size.toUpperCase() === size);
    return {
      id: existing?.id,
      size,
      stock: existing ? existing.stock : 5,
      available: existing ? existing.available : true,
    };
  });

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          slug: initialData.slug,
          player: initialData.player,
          team: initialData.team,
          year: Number(initialData.year),
          price: Number(initialData.price),
          category_id: initialData.category_id,
          product_type: initialData.product_type,
          condition: initialData.condition,
          description: initialData.description,
          shipping_text: initialData.shipping_text || '',
          featured: initialData.featured,
          active: initialData.active,
          variants: defaultVariants,
          images: initialData.images || [],
        }
      : {
          name: '',
          slug: '',
          player: '',
          team: '',
          year: 2008,
          price: 49,
          category_id: categories[0]?.id || '',
          product_type: 'Maillot Domicile',
          condition: 'Excellent',
          description: '',
          shipping_text: "Expédié depuis la France sous 2 jours ouvrés. Livraison standard en France sous 3 à 5 jours, avec suivi dans toute l'Europe.",
          featured: false,
          active: true,
          variants: defaultVariants,
          images: [],
        },
  });

  const { append: appendImage, remove: removeImage } = useFieldArray({
    control,
    name: 'images',
  });

  const currentImages = useWatch({ control, name: 'images' }) || [];

  // Auto-slugify
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue('name', val);
    if (!initialData) {
      const autoSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setValue('slug', autoSlug);
    }
  };

  // Upload to Supabase Storage 'products' bucket
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setServerError(null);
    const supabase = createClient();

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `jerseys/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);

        const newImage = {
          image_url: publicUrlData.publicUrl,
          alt_text: file.name,
          sort_order: currentImages.length,
          is_primary: currentImages.length === 0,
        };

        appendImage(newImage);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur lors de l’upload d’image';
      setServerError(message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const onSubmit = async (values: ProductFormValues) => {
    setServerError(null);
    try {
      if (initialData) {
        const res = await updateProduct(initialData.id, values);
        if (res.success) {
          router.push('/admin/products');
          router.refresh();
        } else {
          setServerError(res.error || 'Erreur lors de la mise à jour');
        }
      } else {
        const res = await createProduct(values);
        if (res.success) {
          router.push('/admin/products');
          router.refresh();
        } else {
          setServerError(res.error || 'Erreur lors de la création');
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Une erreur inattendue est survenue';
      setServerError(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#71717A] hover:text-vintage-dark"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('common.back')}</span>
        </button>

        <button
          type="submit"
          disabled={isSubmitting || uploading}
          className="inline-flex items-center gap-2 bg-vintage-red hover:bg-[#A82E18] text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-lg transition-colors shadow-2xs disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Enregistrement...</span>
            </>
          ) : (
            <span>{initialData ? t('common.save') : t('admin.addProduct')}</span>
          )}
        </button>
      </div>

      {serverError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
          {serverError}
        </div>
      )}

      {/* 1. Basic Information */}
      <div className="bg-white p-6 rounded-xl border border-vintage-border space-y-4 shadow-2xs">
        <h2 className="font-display text-base font-bold uppercase tracking-wide text-vintage-dark border-b border-vintage-border pb-2">
          Informations Générales
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#52525B]">
              {t('admin.name')} *
            </label>
            <input
              {...register('name')}
              onChange={handleNameChange}
              placeholder="Ex: Manchester United 2007/08 Ronaldo"
              className="w-full px-3 py-2 text-xs rounded-lg border border-vintage-border focus:outline-hidden focus:ring-2 focus:ring-vintage-red/20"
            />
            {errors.name && <p className="text-red-500 text-[10px]">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#52525B]">
              {t('admin.slug')} *
            </label>
            <input
              {...register('slug')}
              placeholder="ronaldo-2008"
              className="w-full px-3 py-2 text-xs rounded-lg border border-vintage-border focus:outline-hidden focus:ring-2 focus:ring-vintage-red/20"
            />
            {errors.slug && <p className="text-red-500 text-[10px]">{errors.slug.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#52525B]">
              {t('admin.player')} *
            </label>
            <input
              {...register('player')}
              placeholder="Ex: Ronaldo, Zidane, Messi, Kaka"
              className="w-full px-3 py-2 text-xs rounded-lg border border-vintage-border focus:outline-hidden focus:ring-2 focus:ring-vintage-red/20"
            />
            {errors.player && <p className="text-red-500 text-[10px]">{errors.player.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#52525B]">
              {t('admin.team')} *
            </label>
            <input
              {...register('team')}
              placeholder="Ex: Manchester United, France, AC Milan"
              className="w-full px-3 py-2 text-xs rounded-lg border border-vintage-border focus:outline-hidden focus:ring-2 focus:ring-vintage-red/20"
            />
            {errors.team && <p className="text-red-500 text-[10px]">{errors.team.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#52525B]">
              {t('admin.year')} *
            </label>
            <input
              type="number"
              {...register('year')}
              placeholder="2008"
              className="w-full px-3 py-2 text-xs rounded-lg border border-vintage-border focus:outline-hidden focus:ring-2 focus:ring-vintage-red/20"
            />
            {errors.year && <p className="text-red-500 text-[10px]">{errors.year.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#52525B]">
              {t('admin.price')} *
            </label>
            <input
              type="number"
              {...register('price')}
              placeholder="49"
              className="w-full px-3 py-2 text-xs rounded-lg border border-vintage-border focus:outline-hidden focus:ring-2 focus:ring-vintage-red/20"
            />
            {errors.price && <p className="text-red-500 text-[10px]">{errors.price.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#52525B]">
              {t('admin.category')} *
            </label>
            <select
              {...register('category_id')}
              className="w-full px-3 py-2 text-xs rounded-lg border border-vintage-border focus:outline-hidden focus:ring-2 focus:ring-vintage-red/20 bg-white"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category_id && <p className="text-red-500 text-[10px]">{errors.category_id.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#52525B]">
              {t('admin.productType')} *
            </label>
            <input
              {...register('product_type')}
              placeholder="Ex: Maillot Domicile, Maillot Extérieur"
              className="w-full px-3 py-2 text-xs rounded-lg border border-vintage-border focus:outline-hidden focus:ring-2 focus:ring-vintage-red/20"
            />
            {errors.product_type && <p className="text-red-500 text-[10px]">{errors.product_type.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#52525B]">
              {t('admin.condition')} *
            </label>
            <input
              {...register('condition')}
              placeholder="Ex: Excellent état, Neuf avec étiquette"
              className="w-full px-3 py-2 text-xs rounded-lg border border-vintage-border focus:outline-hidden focus:ring-2 focus:ring-vintage-red/20"
            />
            {errors.condition && <p className="text-red-500 text-[10px]">{errors.condition.message}</p>}
          </div>
        </div>

        <div className="space-y-1 pt-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#52525B]">
            {t('admin.descriptionLabel')} *
          </label>
          <textarea
            rows={3}
            {...register('description')}
            placeholder="Histoire et détails du maillot..."
            className="w-full px-3 py-2 text-xs rounded-lg border border-vintage-border focus:outline-hidden focus:ring-2 focus:ring-vintage-red/20"
          />
          {errors.description && <p className="text-red-500 text-[10px]">{errors.description.message}</p>}
        </div>

        <div className="space-y-1 pt-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#52525B]">
            {t('admin.shippingTextLabel')}
          </label>
          <input
            {...register('shipping_text')}
            placeholder="Texte de livraison personnalisé (laisser vide pour la valeur par défaut)"
            className="w-full px-3 py-2 text-xs rounded-lg border border-vintage-border focus:outline-hidden focus:ring-2 focus:ring-vintage-red/20"
          />
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('active')}
              className="rounded border-vintage-border text-vintage-red focus:ring-vintage-red"
            />
            <span className="text-xs font-semibold text-vintage-dark">
              {t('admin.isActive')}
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('featured')}
              className="rounded border-vintage-border text-vintage-red focus:ring-vintage-red"
            />
            <span className="text-xs font-semibold text-vintage-dark">
              {t('admin.isFeatured')}
            </span>
          </label>
        </div>
      </div>

      {/* 2. Sizes & Stock Matrix */}
      <div className="bg-white p-6 rounded-xl border border-vintage-border space-y-4 shadow-2xs">
        <h2 className="font-display text-base font-bold uppercase tracking-wide text-vintage-dark border-b border-vintage-border pb-2">
          Tailles et Stock
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {DEFAULT_SIZES.map((size, idx) => (
            <div key={size} className="p-3 bg-[#FAF8F5] border border-vintage-border rounded-lg space-y-2">
              <div className="text-center font-bold text-xs text-vintage-dark">
                Taille {size}
              </div>
              <input type="hidden" {...register(`variants.${idx}.size`)} value={size} />

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-[#71717A] uppercase block">
                  Stock
                </label>
                <input
                  type="number"
                  {...register(`variants.${idx}.stock`)}
                  className="w-full text-center px-2 py-1 text-xs border border-vintage-border rounded bg-white"
                />
              </div>

              <label className="flex items-center justify-center gap-1.5 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  {...register(`variants.${idx}.available`)}
                  className="rounded text-vintage-red focus:ring-vintage-red"
                />
                <span className="text-[10px] text-[#52525B]">Dispo</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Product Images (Storage bucket 'products') */}
      <div className="bg-white p-6 rounded-xl border border-vintage-border space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-vintage-border pb-2">
          <h2 className="font-display text-base font-bold uppercase tracking-wide text-vintage-dark">
            Photos du Maillot (Bucket `products`)
          </h2>
          <span className="text-xs text-[#71717A]">
            {currentImages.length} image(s)
          </span>
        </div>

        {/* Upload Button */}
        <div className="border-2 border-dashed border-[#D5CEBF] hover:border-vintage-red rounded-xl p-6 text-center cursor-pointer transition-colors bg-[#FAF8F5]">
          <input
            type="file"
            id="image-upload"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="hidden"
          />
          <label htmlFor="image-upload" className="cursor-pointer space-y-2 block">
            <Upload className="w-8 h-8 mx-auto text-[#71717A]" />
            <div className="text-xs font-semibold text-vintage-dark">
              {uploading ? 'Upload en cours...' : 'Cliquez pour sélectionner des photos de maillots'}
            </div>
            <p className="text-[11px] text-[#71717A]">
              Les images sont uploadées directement dans le bucket Supabase `products`
            </p>
          </label>
        </div>

        {/* Uploaded Images List */}
        {currentImages.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3">
            {currentImages.map((img, idx) => (
              <div
                key={idx}
                className="relative group aspect-3/4 rounded-lg overflow-hidden border border-vintage-border bg-[#FAF8F5]"
              >
                <Image
                  src={img.image_url}
                  alt={img.alt_text || 'Photo maillot'}
                  fill
                  className="object-cover"
                />

                {img.is_primary && (
                  <span className="absolute top-2 left-2 bg-vintage-red text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded shadow-xs">
                    Principale
                  </span>
                )}

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                  <button
                    type="button"
                    onClick={() => {
                      currentImages.forEach((_, i) => {
                        setValue(`images.${i}.is_primary`, i === idx);
                      });
                    }}
                    className="p-1.5 bg-white text-vintage-dark hover:text-vintage-red rounded shadow-xs"
                    title="Définir comme photo principale"
                  >
                    <Star className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="p-1.5 bg-red-600 text-white hover:bg-red-700 rounded shadow-xs"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || uploading}
          className="bg-vintage-red hover:bg-[#A82E18] text-white text-xs font-bold uppercase tracking-wider px-8 py-3 rounded-lg transition-colors shadow-2xs disabled:opacity-50"
        >
          {isSubmitting ? 'Enregistrement...' : t('common.save')}
        </button>
      </div>
    </form>
  );
}
