'use client';

import React, { useState, useEffect, useCallback, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ChevronRight, Search, ChevronDown } from 'lucide-react';
import { Category, ProductWithDetails } from '@/types/database';
import { ProductCard } from '@/components/product/product-card';
import { ProductCardSkeleton } from '@/components/product/product-card-skeleton';
import { SIZE_CONFIG } from '@/components/product/size-selector';
import { SocialSection } from '@/components/home/social-section';
import { t } from '@/i18n';

interface ShopViewProps {
  categories: Category[];
  initialProducts: ProductWithDetails[];
  totalCount?: number;
  currentPage?: number;
  itemsPerPage?: number;
  selectedCategory?: string;
  selectedSize?: string;
  searchQuery?: string;
  sortBy?: 'featured' | 'price_asc' | 'price_desc' | 'newest';
  initialCategorySlug?: string;
}

export function ShopView({
  categories,
  initialProducts,
  totalCount = initialProducts.length,
  currentPage = 1,
  itemsPerPage = 9,
  selectedCategory: propCategory,
  selectedSize: propSize = 'all',
  searchQuery: propSearch = '',
  sortBy: propSort = 'featured',
  initialCategorySlug,
}: ShopViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Active filter states from backend / URL
  const activeCategory = propCategory || initialCategorySlug || 'all';
  const activeSize = propSize || 'all';
  const activeSort = propSort || 'featured';

  // Search input local state for instant responsive typing
  const [prevPropSearch, setPrevPropSearch] = useState<string>(propSearch);
  const [localSearch, setLocalSearch] = useState<string>(propSearch);

  if (prevPropSearch !== propSearch) {
    setPrevPropSearch(propSearch);
    setLocalSearch(propSearch);
  }

  // Push filter changes to backend via URL searchParams
  const updateFilters = useCallback(
    (newParams: Record<string, string | number | null>, customPath?: string) => {
      const current = new URLSearchParams(searchParams ? searchParams.toString() : '');

      Object.entries(newParams).forEach(([key, val]) => {
        if (val === null || val === undefined || val === '' || val === 'all') {
          current.delete(key);
        } else {
          current.set(key, String(val));
        }
      });

      // Reset page to 1 when changing filters (unless page itself is explicitly set)
      if (!('page' in newParams)) {
        current.delete('page');
      }

      const basePath = customPath ?? (pathname.startsWith('/category/') ? '/shop' : pathname);
      const qs = current.toString();
      const target = qs ? `${basePath}?${qs}` : basePath;

      startTransition(() => {
        router.push(target, { scroll: false });
      });
    },
    [pathname, router, searchParams]
  );

  // Debounced search sync to backend (350ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch.trim() !== (propSearch || '').trim()) {
        updateFilters({ search: localSearch.trim() || null });
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [localSearch, propSearch, updateFilters]);

  // Category change handler
  const handleCategorySelect = (catSlug: string) => {
    updateFilters({ category: catSlug === 'all' ? null : catSlug }, '/shop');
  };

  // Size change handler
  const handleSizeSelect = (size: string) => {
    updateFilters({ size: size === 'all' ? null : size });
  };

  // Sort change handler
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilters({ sort: e.target.value });
  };

  // Page change handler
  const handlePageSelect = (page: number) => {
    updateFilters({ page: String(page) });
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setLocalSearch('');
    startTransition(() => {
      router.push('/shop');
    });
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-8 md:py-12 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#71717A]">
        <Link href="/" className="hover:text-vintage-dark transition-colors">
          {t('shop.breadcrumbHome')}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#A1A1AA]" />
        <span className="text-vintage-red font-semibold">
          {t('shop.breadcrumbShop')}
        </span>
      </nav>

      {/* Main Title & Subtitle */}
      <div className="space-y-2">
        <h1 className="font-archivo font-black text-4xl sm:text-5xl md:text-6xl tracking-tight uppercase text-vintage-dark">
          <span className="block">{t('shop.title').split(' ')[0]}{' '}</span>
          <span className="text-vintage-red">
            {t('shop.title').split(' ').slice(1, 3).join(' ')}
          </span>{' '}
          {t('shop.title').split(' ').slice(3).join(' ')}
        </h1>
        <p className="text-sm md:text-base text-gray-500 max-w-3xl font-lato text-left">
          {t('shop.subtitle')}
        </p>
      </div>

      {/* Category Tabs (Backend filtered) */}
      <div className="flex items-center gap-6 overflow-x-auto border-b border-vintage-border scrollbar-none">
        <button
          type="button"
          onClick={() => handleCategorySelect('all')}
          className={`font-lato text-xs md:text-sm font-bold uppercase tracking-wider pb-3 transition-colors shrink-0 cursor-pointer ${
            activeCategory === 'all'
              ? 'text-vintage-red border-b-2 border-vintage-red'
              : 'text-[#71717A] hover:text-vintage-dark'
          }`}
        >
          {t('shop.allJerseysTab')}
        </button>

        {categories.map((cat) => {
          const isActive = activeCategory.toLowerCase() === cat.slug.toLowerCase();
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategorySelect(cat.slug)}
              className={`font-lato text-xs md:text-sm font-bold uppercase tracking-wider pb-3 transition-colors shrink-0 cursor-pointer ${
                isActive
                  ? 'text-vintage-red border-b-2 border-vintage-red'
                  : 'text-[#71717A] hover:text-vintage-dark'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Main Layout (Sidebar + Products Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Sidebar (Sizes Filter - Backend filtered) */}
        <aside className="lg:col-span-3 space-y-6">
          <div>
            <h3 className="tracking-[2px] uppercase font-medium font-lato text-gray-500 text-left mb-3">
              {t('shop.filterSize')}
            </h3>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSizeSelect('all')}
                className={`cursor-pointer rounded-lg border-2 p-1.5 box-border flex flex-col items-center justify-center text-center text-[0.75rem] font-lato transition-all ${
                  activeSize === 'all'
                    ? 'bg-vintage-red text-white border-vintage-red shadow-xs'
                    : 'bg-[#f1ede6] text-vintage-dark border-vintage-border/80 hover:border-vintage-dark'
                }`}
              >
                <span className="font-bold">ALL</span>
                <span className="text-[9px] opacity-[0.55]">Toutes</span>
              </button>

              {SIZE_CONFIG.map(({ size, weightRange }) => {
                const isSelected = activeSize.toUpperCase() === size.toUpperCase();
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeSelect(size)}
                    className={`cursor-pointer rounded-lg border-2 p-1.5 box-border flex flex-col items-center justify-center text-center text-[0.75rem] font-lato transition-all ${
                      isSelected
                        ? 'bg-vintage-red text-white border-vintage-red shadow-xs'
                        : 'bg-[#f1ede6] text-vintage-dark border-vintage-border/80 hover:border-vintage-dark'
                    }`}
                  >
                    <span className="font-bold">{size}</span>
                    <span className="text-[9px] opacity-75">{weightRange}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Right Area: Search, Sort & Products Grid */}
        <div className="lg:col-span-9 space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Search Input (Backend filtered with debouncing, no white fill) */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a877c]" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder={t('common.searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#f1ede6] border-2 border-vintage-border/80 text-sm text-vintage-dark placeholder:text-[#8a877c] focus:outline-hidden focus:border-vintage-dark focus:bg-[#FAF8F5] transition-colors"
              />
            </div>

            {/* Sort & Count */}
            <div className="flex items-center justify-between sm:justify-end gap-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#71717A]">
                {t('shop.productsCount', { count: totalCount })}
              </span>

              <div className="relative">
                <select
                  value={activeSort}
                  onChange={handleSortChange}
                  className="appearance-none bg-[#f1ede6] border-2 border-vintage-border/80 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold uppercase tracking-wider text-vintage-dark cursor-pointer hover:border-vintage-dark focus:outline-hidden focus:border-vintage-dark transition-colors"
                >
                  <option value="featured" className="bg-[#f1ede6] text-vintage-dark">{t('shop.sortFeatured')}</option>
                  <option value="price_asc" className="bg-[#f1ede6] text-vintage-dark">{t('shop.sortPriceAsc')}</option>
                  <option value="price_desc" className="bg-[#f1ede6] text-vintage-dark">{t('shop.sortPriceDesc')}</option>
                  <option value="newest" className="bg-[#f1ede6] text-vintage-dark">{t('shop.sortNewest')}</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#71717A] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Products Grid & Shimmer Loading State */}
          <div className="relative min-h-90">
            {isPending ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : initialProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="bg-[#f1ede6] rounded-xl border-2 border-vintage-border/80 p-12 text-center space-y-4">
                <p className="text-base text-[#71717A]">
                  {t('shop.noProductsFound')}
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-block bg-vintage-dark hover:bg-vintage-red text-white text-xs font-bold tracking-wider uppercase px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>

          {/* Backend Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-end gap-1.5 pt-6 border-t border-vintage-border">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                const isActive = currentPage === page;
                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handlePageSelect(page)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-vintage-red text-white shadow-xs'
                        : 'bg-[#f1ede6] border-2 border-vintage-border/80 text-vintage-dark hover:border-vintage-dark'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Social Section */}
      <SocialSection />
    </div>
  );
}
