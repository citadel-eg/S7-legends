'use client';
 
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, Trash2, Star, ArrowLeft, ArrowRight, Loader2, Shirt, User, Shield, Calendar, Tag, Truck, FileText, FolderTree, ChevronDown, Check, Sparkles, Plus, X } from 'lucide-react';
import { productFormSchema, ProductFormValues } from '@/lib/validations/product';
import { Category, ProductWithDetails } from '@/types/database';
import { createProduct, updateProduct } from '@/lib/actions/product-actions';
import { createCategory } from '@/lib/actions/category-actions';
import { createClient } from '@/lib/supabase/client';
import { useAdminI18n } from '@/lib/i18n/admin-i18n';

interface ProductFormProps {
  initialData?: ProductWithDetails | null;
  categories: Category[];
}

const DEFAULT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export function ProductForm({ initialData, categories }: ProductFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { tAdmin, isArabic } = useAdminI18n();
  const [uploading, setUploading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
  const [createdCategories, setCreatedCategories] = useState<Category[]>([]);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [isSubmittingCat, setIsSubmittingCat] = useState(false);
  const [catCreateError, setCatCreateError] = useState<string | null>(null);
  const catDropdownRef = useRef<HTMLDivElement>(null);

  // Derive combined categories: prop + any created inline (deduped)
  const allCategories = [
    ...categories,
    ...createdCategories.filter((nc) => !categories.some((c) => c.id === nc.id)),
  ];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (catDropdownRef.current && !catDropdownRef.current.contains(event.target as Node)) {
        setIsCatDropdownOpen(false);
        setIsCreatingCategory(false);
        setCatCreateError(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          product_type: 'Home Jersey',
          condition: 'Excellent',
          description: '',
          shipping_text: "Shipped from France within 2 business days. Tracked shipping across Europe.",
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
  const currentCategoryId = useWatch({ control, name: 'category_id' }) || (categories[0]?.id || '');

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

  // Quick Create Category Handler
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!newCatName.trim()) return;

    setIsSubmittingCat(true);
    setCatCreateError(null);

    const slugToUse =
      newCatSlug.trim() ||
      newCatName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    try {
      const res = await createCategory({
        name: newCatName.trim(),
        slug: slugToUse,
        active: true,
      });

      if (res.success && res.category) {
        setCreatedCategories((prev) => [...prev, res.category]);
        setValue('category_id', res.category.id, { shouldValidate: true });
        setNewCatName('');
        setNewCatSlug('');
        setIsCreatingCategory(false);
        setIsCatDropdownOpen(false);
      } else {
        setCatCreateError(res.error || (isArabic ? 'فشل إنشاء القسم' : 'Failed to create category'));
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : (isArabic ? 'خطأ في إنشاء القسم' : 'Error creating category');
      setCatCreateError(message);
    } finally {
      setIsSubmittingCat(false);
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
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);

        appendImage({
          image_url: publicUrlData.publicUrl,
          alt_text: file.name,
          sort_order: currentImages.length + i,
          is_primary: currentImages.length === 0 && i === 0,
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error uploading images';
      setServerError(msg);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: ProductFormValues) => {
    setServerError(null);

    try {
      if (initialData) {
        const res = await updateProduct(initialData.id, values);
        if (res.success) {
          await queryClient.invalidateQueries({ queryKey: ['admin-products'] });
          await queryClient.invalidateQueries({ queryKey: ['admin-metrics'] });
          router.push('/admin/products');
          router.refresh();
        } else {
          setServerError(res.error || 'Error saving product');
        }
      } else {
        const res = await createProduct(values);
        if (res.success) {
          await queryClient.invalidateQueries({ queryKey: ['admin-products'] });
          await queryClient.invalidateQueries({ queryKey: ['admin-metrics'] });
          router.push('/admin/products');
          router.refresh();
        } else {
          setServerError(res.error || 'Error creating product');
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error during operation';
      setServerError(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Top action bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#71717A] hover:text-vintage-dark transition-colors cursor-pointer"
        >
          {isArabic ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{tAdmin('backToJerseys')}</span>
        </button>

        <button
          type="submit"
          disabled={isSubmitting || uploading}
          className="inline-flex items-center gap-2 bg-vintage-red hover:bg-[#A82E18] text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-lg transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{tAdmin('btnSaving')}</span>
            </>
          ) : (
            <span>{initialData ? tAdmin('btnSave') : tAdmin('btnCreate')}</span>
          )}
        </button>
      </div>

      {serverError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
          {serverError}
        </div>
      )}

      {/* 1. Basic Information */}
      {/* 1. Basic Information (المعلومات العامة) */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-vintage-border space-y-6 shadow-2xs">
        <div className="flex items-center justify-between border-b border-vintage-border/70 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-vintage-red/10 border border-vintage-red/20 flex items-center justify-center shrink-0">
              <Shirt className="w-5 h-5 text-vintage-red" />
            </div>
            <div>
              <h2 className="text-base font-bold text-vintage-dark">
                {tAdmin('secGeneral')}
              </h2>
              <p className="text-xs text-[#71717A] mt-0.5">
                {isArabic ? 'البيانات الأساسية وهوية القميص والتسعير والتصنيف' : 'Core jersey identity, heritage, pricing and taxonomy'}
              </p>
            </div>
          </div>
        </div>

        {/* Primary Identity: Name & Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center justify-between">
              <span>{tAdmin('labelName')} <span className="text-vintage-red">*</span></span>
            </label>
            <input
              {...register('name')}
              onChange={handleNameChange}
              placeholder={isArabic ? 'مثال: مانشستر يونايتد 2007/08 رونالدو نهائي دوري الأبطال' : 'e.g. Manchester United 2007/08 Ronaldo UCL Final'}
              className="w-full px-3.5 py-2.5 text-xs font-medium rounded-lg border border-vintage-border bg-[#FAF8F5]/40 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-vintage-red/20 focus:border-vintage-red/50 transition-all text-vintage-dark"
            />
            {errors.name && <p className="text-red-500 text-[11px] font-semibold">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#52525B]">
              {tAdmin('labelSlug')} <span className="text-vintage-red">*</span>
            </label>
            <div className="relative flex items-center" dir="ltr">
              <span className="absolute left-3 text-[11px] text-[#A1A1AA] font-mono pointer-events-none select-none">
                /product/
              </span>
              <input
                {...register('slug')}
                placeholder="manchester-united-2008-ronaldo"
                className="w-full pl-20 pr-3.5 py-2.5 text-xs font-mono text-left rounded-lg border border-vintage-border bg-[#FAF8F5]/40 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-vintage-red/20 focus:border-vintage-red/50 transition-all text-vintage-dark"
              />
            </div>
            {errors.slug && <p className="text-red-500 text-[11px] font-semibold">{errors.slug.message}</p>}
          </div>
        </div>

        {/* Heritage Details: Player, Team, Year, Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {/* Player */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-vintage-red" />
              <span>{tAdmin('labelPlayer')} <span className="text-vintage-red">*</span></span>
            </label>
            <input
              {...register('player')}
              placeholder={isArabic ? 'مثال: رونالدو، زيدان، ميسي' : 'e.g. Ronaldo, Zidane, Messi'}
              className="w-full px-3.5 py-2.5 text-xs font-medium rounded-lg border border-vintage-border bg-[#FAF8F5]/40 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-vintage-red/20 focus:border-vintage-red/50 transition-all text-vintage-dark"
            />
            {errors.player && <p className="text-red-500 text-[11px] font-semibold">{errors.player.message}</p>}
          </div>

          {/* Team / Club */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-vintage-red" />
              <span>{tAdmin('labelTeam')} <span className="text-vintage-red">*</span></span>
            </label>
            <input
              {...register('team')}
              placeholder={isArabic ? 'مثال: مانشستر يونايتد، فرنسا، ميلان' : 'e.g. Manchester United, France, AC Milan'}
              className="w-full px-3.5 py-2.5 text-xs font-medium rounded-lg border border-vintage-border bg-[#FAF8F5]/40 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-vintage-red/20 focus:border-vintage-red/50 transition-all text-vintage-dark"
            />
            {errors.team && <p className="text-red-500 text-[11px] font-semibold">{errors.team.message}</p>}
          </div>

          {/* Year */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-vintage-red" />
              <span>{tAdmin('labelYear')} <span className="text-vintage-red">*</span></span>
            </label>
            <input
              type="number"
              {...register('year')}
              placeholder="2008"
              className="w-full px-3.5 py-2.5 text-xs font-medium rounded-lg border border-vintage-border bg-[#FAF8F5]/40 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-vintage-red/20 focus:border-vintage-red/50 transition-all text-vintage-dark"
            />
            {errors.year && <p className="text-red-500 text-[11px] font-semibold">{errors.year.message}</p>}
          </div>

          {/* Price */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-vintage-red" />
              <span>{tAdmin('labelPrice')} (€) <span className="text-vintage-red">*</span></span>
            </label>
            <div className="relative flex items-center">
              <span className={`absolute ${isArabic ? 'right-3' : 'left-3'} text-xs font-bold text-[#71717A] pointer-events-none select-none`}>
                €
              </span>
              <input
                type="number"
                step="0.01"
                {...register('price')}
                placeholder="49"
                className={`w-full ${isArabic ? 'pr-8 pl-3.5' : 'pl-8 pr-3.5'} py-2.5 text-xs font-bold rounded-lg border border-vintage-border bg-[#FAF8F5]/40 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-vintage-red/20 focus:border-vintage-red/50 transition-all text-vintage-dark`}
              />
            </div>
            {errors.price && <p className="text-red-500 text-[11px] font-semibold">{errors.price.message}</p>}
          </div>
        </div>

        {/* Classification & Specifications: Category, Product Type, Condition */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {/* Custom Category Dropdown */}
          <div className="space-y-1.5 relative" ref={catDropdownRef}>
            <label className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
              <FolderTree className="w-3.5 h-3.5 text-vintage-red" />
              <span>{tAdmin('labelCategory')} <span className="text-vintage-red">*</span></span>
            </label>
            
            {/* Hidden Input for Form Registration */}
            <input type="hidden" {...register('category_id')} />

            {/* Custom Dropdown Trigger */}
            <button
              type="button"
              onClick={() => setIsCatDropdownOpen((prev) => !prev)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer shadow-2xs ${
                isCatDropdownOpen
                  ? 'bg-white border-vintage-red/60 ring-2 ring-vintage-red/20'
                  : 'border-vintage-border bg-[#FAF8F5]/40 hover:bg-white hover:border-vintage-border text-vintage-dark'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="w-2 h-2 rounded-full bg-vintage-red shrink-0" />
                <span className="truncate text-vintage-dark">
                  {allCategories.find((c) => c.id === currentCategoryId)?.name || (isArabic ? 'اختر القسم' : 'Select Category')}
                </span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-[#A1A1AA] shrink-0 transition-transform duration-200 ${isCatDropdownOpen ? 'rotate-180 text-vintage-red' : ''}`} />
            </button>

            {/* Floating Options Menu */}
            {isCatDropdownOpen && (
              <div
                className={`absolute z-30 mt-1.5 w-full min-w-60 bg-white rounded-xl border border-vintage-border shadow-xl p-2 space-y-2 ${
                  isArabic ? 'right-0' : 'left-0'
                }`}
              >
                {!isCreatingCategory ? (
                  <>
                    <div className="px-1.5 py-0.5 text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider">
                      {isArabic ? 'أقسام المتجر المتاحة' : 'Available Collections'}
                    </div>

                    <div className="max-h-52 overflow-y-auto space-y-0.5">
                      {allCategories.map((cat) => {
                        const isSelected = (currentCategoryId || allCategories[0]?.id) === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              setValue('category_id', cat.id, { shouldValidate: true });
                              setIsCatDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-vintage-red text-white shadow-xs'
                                : 'text-vintage-dark hover:bg-[#FAF8F5] hover:text-vintage-red'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSelected ? 'bg-white' : 'bg-vintage-border'}`} />
                              <span className="truncate">{cat.name}</span>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Quick Create Action Button */}
                    <div className="pt-1.5 border-t border-vintage-border/70">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsCreatingCategory(true);
                          setCatCreateError(null);
                        }}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-vintage-red hover:bg-vintage-red/10 border border-dashed border-vintage-red/30 transition-all cursor-pointer shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{tAdmin('quickCreateCategory')}</span>
                      </button>
                    </div>
                  </>
                ) : (
                  /* Inline Quick Category Creation Mini-Form */
                  <div className="p-2 space-y-2.5 bg-[#FAF8F5]/80 rounded-lg border border-vintage-border/80">
                    <div className="flex items-center justify-between pb-1 border-b border-vintage-border/60">
                      <span className="text-[11px] font-bold text-vintage-dark uppercase flex items-center gap-1">
                        <Plus className="w-3.5 h-3.5 text-vintage-red" />
                        {tAdmin('addCategory')}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsCreatingCategory(false);
                        }}
                        className="text-[#71717A] hover:text-vintage-dark p-0.5 rounded cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {catCreateError && (
                      <p className="text-red-500 text-[10px] font-semibold">{catCreateError}</p>
                    )}

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#52525B] uppercase block">
                        {tAdmin('catName')} *
                      </label>
                      <input
                        type="text"
                        value={newCatName}
                        onChange={(e) => {
                          setNewCatName(e.target.value);
                          setNewCatSlug(
                            e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, '-')
                              .replace(/(^-|-$)+/g, '')
                          );
                        }}
                        placeholder={isArabic ? 'مثال: الدوري الإنجليزي الممتاز' : 'e.g. Premier League'}
                        className="w-full px-2.5 py-1.5 text-xs rounded-md border border-vintage-border bg-white focus:outline-hidden focus:ring-1 focus:ring-vintage-red/30 text-vintage-dark font-medium"
                        autoFocus
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#52525B] uppercase block">
                        {tAdmin('catSlug')}
                      </label>
                      <div className="relative flex items-center" dir="ltr">
                        <span className="absolute left-2 text-[10px] text-[#A1A1AA] font-mono select-none">/</span>
                        <input
                          type="text"
                          value={newCatSlug}
                          onChange={(e) => setNewCatSlug(e.target.value)}
                          placeholder="premier-league"
                          className="w-full pl-5 pr-2 py-1.5 text-xs font-mono text-left rounded-md border border-vintage-border bg-white focus:outline-hidden focus:ring-1 focus:ring-vintage-red/30 text-vintage-dark"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsCreatingCategory(false);
                        }}
                        className="flex-1 py-1.5 text-[11px] font-semibold text-[#71717A] hover:bg-white rounded-md border border-transparent hover:border-vintage-border transition-colors cursor-pointer"
                      >
                        {tAdmin('btnCancel')}
                      </button>
                      <button
                        type="button"
                        disabled={isSubmittingCat || !newCatName.trim()}
                        onClick={handleCreateCategory}
                        className="flex-1 py-1.5 text-[11px] font-bold uppercase bg-vintage-red hover:bg-[#A82E18] text-white rounded-md shadow-2xs transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1"
                      >
                        {isSubmittingCat && <Loader2 className="w-3 h-3 animate-spin" />}
                        <span>{isSubmittingCat ? tAdmin('btnSaving') : tAdmin('createAndSelect')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {errors.category_id && <p className="text-red-500 text-[11px] font-semibold">{errors.category_id.message}</p>}
          </div>

          {/* Product Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
              <Shirt className="w-3.5 h-3.5 text-vintage-red" />
              <span>{tAdmin('labelProductType')} <span className="text-vintage-red">*</span></span>
            </label>
            <input
              {...register('product_type')}
              placeholder={isArabic ? 'مثال: قميص أساسي، قميص احتياطي، إصدار خاص' : 'e.g. Home Jersey, Away Kit, Special Edition'}
              className="w-full px-3.5 py-2.5 text-xs font-medium rounded-lg border border-vintage-border bg-[#FAF8F5]/40 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-vintage-red/20 focus:border-vintage-red/50 transition-all text-vintage-dark"
            />
            {errors.product_type && <p className="text-red-500 text-[11px] font-semibold">{errors.product_type.message}</p>}
          </div>

          {/* Condition */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-vintage-red" />
              <span>{tAdmin('labelCondition')} <span className="text-vintage-red">*</span></span>
            </label>
            <input
              {...register('condition')}
              placeholder={isArabic ? 'مثال: جديد بالملصقات، حالة ممتازة، كلاسيكي أصلي' : 'e.g. Mint Condition, Brand New with Tags'}
              className="w-full px-3.5 py-2.5 text-xs font-medium rounded-lg border border-vintage-border bg-[#FAF8F5]/40 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-vintage-red/20 focus:border-vintage-red/50 transition-all text-vintage-dark"
            />
            {errors.condition && <p className="text-red-500 text-[11px] font-semibold">{errors.condition.message}</p>}
          </div>
        </div>

        {/* Description & Shipping */}
        <div className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-vintage-red" />
              <span>{tAdmin('labelDescription')} <span className="text-vintage-red">*</span></span>
            </label>
            <textarea
              rows={3}
              {...register('description')}
              placeholder={isArabic ? 'وصف تاريخي موجز للقميص والنهائي أو الموسم المميز...' : 'Historical context, match details and collector specifications...'}
              className="w-full px-3.5 py-2.5 text-xs font-medium rounded-lg border border-vintage-border bg-[#FAF8F5]/40 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-vintage-red/20 focus:border-vintage-red/50 transition-all text-vintage-dark"
            />
            {errors.description && <p className="text-red-500 text-[11px] font-semibold">{errors.description.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-vintage-red" />
              <span>{tAdmin('labelShipping')}</span>
            </label>
            <input
              {...register('shipping_text')}
              placeholder={isArabic ? 'تفاصيل التوصيل والشحن الخاصة (اترك فارغاً للافتراضي)' : 'Custom delivery specifications (leave blank for store standard)'}
              className="w-full px-3.5 py-2.5 text-xs font-medium rounded-lg border border-vintage-border bg-[#FAF8F5]/40 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-vintage-red/20 focus:border-vintage-red/50 transition-all text-vintage-dark"
            />
          </div>
        </div>

        {/* Visibility & Status Cards */}
        <div className="pt-2 border-t border-vintage-border/70">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Active Toggle Card */}
            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-vintage-border bg-[#FAF8F5]/50 hover:bg-[#FAF8F5] transition-colors cursor-pointer select-none">
              <input
                type="checkbox"
                {...register('active')}
                className="mt-0.5 w-4 h-4 rounded text-vintage-red focus:ring-vintage-red cursor-pointer"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-vintage-dark block">
                  {tAdmin('labelActive')}
                </span>
                <span className="text-[11px] text-[#71717A] block">
                  {isArabic ? 'عرض القميص بالمتجر وإتاحته للعملاء' : 'Make this jersey visible and purchasable in the storefront'}
                </span>
              </div>
            </label>

            {/* Featured Toggle Card */}
            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-vintage-border bg-[#FAF8F5]/50 hover:bg-[#FAF8F5] transition-colors cursor-pointer select-none">
              <input
                type="checkbox"
                {...register('featured')}
                className="mt-0.5 w-4 h-4 rounded text-vintage-red focus:ring-vintage-red cursor-pointer"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-vintage-dark block">
                  {tAdmin('labelFeatured')}
                </span>
                <span className="text-[11px] text-[#71717A] block">
                  {isArabic ? 'إبراز القميص في السلايدر الرئيسي بالصفحة الأولى' : 'Feature this jersey on the homepage 3D carousel showcase'}
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* 2. Sizes & Stock Matrix */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-vintage-border space-y-6 shadow-2xs">
        <h2 className="text-base font-bold uppercase tracking-wide text-vintage-dark border-b border-vintage-border/70 pb-3">
          {tAdmin('secStock')}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {DEFAULT_SIZES.map((size, idx) => (
            <div key={size} className="p-3 bg-[#FAF8F5]/60 border border-vintage-border rounded-xl space-y-2.5">
              <div className="text-center font-extrabold text-xs text-vintage-dark">
                {tAdmin('labelSize')} {size}
              </div>
              <input type="hidden" {...register(`variants.${idx}.size`)} value={size} />

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#71717A] uppercase block text-center">
                  {tAdmin('labelStock')}
                </label>
                <input
                  type="number"
                  {...register(`variants.${idx}.stock`)}
                  className="w-full text-center px-2 py-1.5 text-xs font-bold border border-vintage-border rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-vintage-red/20"
                />
              </div>

              <label className="flex items-center justify-center gap-1.5 cursor-pointer pt-1 select-none">
                <input
                  type="checkbox"
                  {...register(`variants.${idx}.available`)}
                  className="rounded text-vintage-red focus:ring-vintage-red cursor-pointer"
                />
                <span className="text-[10px] font-semibold text-[#52525B]">{tAdmin('labelAvailable')}</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Product Images (Storage bucket 'products') */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-vintage-border space-y-6 shadow-2xs">
        <div className="flex items-center justify-between border-b border-vintage-border/70 pb-3">
          <h2 className="text-base font-bold uppercase tracking-wide text-vintage-dark">
            {tAdmin('secPhotos')}
          </h2>
          <span className="text-xs font-semibold text-[#71717A]">
            {currentImages.length} image(s)
          </span>
        </div>

        {/* Upload Button */}
        <div className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors bg-[#FAF8F5] ${errors.images ? 'border-red-400 bg-red-50/30' : 'border-[#D5CEBF] hover:border-vintage-red'}`}>
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
              {uploading ? tAdmin('btnSaving') : tAdmin('labelUploadPrompt')}
            </div>
            <p className="text-[11px] text-[#71717A]">
              {tAdmin('labelUploadInfo')}
            </p>
          </label>
        </div>
        {errors.images && <p className="text-red-500 text-[11px] font-semibold">{errors.images.message}</p>}

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
                  alt={img.alt_text || 'Jersey Photo'}
                  fill
                  className="object-cover"
                />

                {img.is_primary && (
                  <span className={`absolute top-2 ${isArabic ? 'right-2' : 'left-2'} bg-vintage-red text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded shadow-xs`}>
                    {tAdmin('labelPrimaryBadge')}
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
                    className="p-1.5 bg-white text-vintage-dark hover:text-vintage-red rounded shadow-xs cursor-pointer"
                    title={tAdmin('labelSetPrimary')}
                  >
                    <Star className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="p-1.5 bg-red-600 text-white hover:bg-red-700 rounded shadow-xs cursor-pointer"
                    title={tAdmin('actionDelete')}
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
      <div className={`flex ${isArabic ? 'justify-start' : 'justify-end'}`}>
        <button
          type="submit"
          disabled={isSubmitting || uploading}
          className="bg-vintage-red hover:bg-[#A82E18] text-white text-xs font-bold uppercase tracking-wider px-8 py-3 rounded-lg transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? tAdmin('btnSaving') : (initialData ? tAdmin('btnSave') : tAdmin('btnCreate'))}
        </button>
      </div>
    </form>
  );
}
