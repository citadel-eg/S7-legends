import React from 'react';
import { ProductCardSkeleton } from '@/components/product/product-card-skeleton';

export default function CategoryLoading() {
  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-8 md:py-12 space-y-12">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-3 w-16 bg-vintage-border/70 rounded shimmer-effect" />
        <div className="h-3 w-3 bg-vintage-border/50 rounded shimmer-effect" />
        <div className="h-3 w-20 bg-vintage-red/50 rounded shimmer-effect" />
      </div>

      {/* Main Title & Subtitle Skeleton */}
      <div className="space-y-3">
        <div className="h-10 sm:h-12 md:h-14 w-72 sm:w-96 bg-vintage-border/80 rounded-lg shimmer-effect" />
        <div className="h-4 sm:h-5 w-full max-w-2xl bg-vintage-border/50 rounded shimmer-effect" />
      </div>

      {/* Category Tabs Skeleton */}
      <div className="flex items-center gap-6 overflow-x-auto border-b border-vintage-border pb-3 scrollbar-none">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-4 bg-vintage-border/60 rounded shimmer-effect shrink-0"
            style={{ width: i === 0 ? '80px' : '110px' }}
          />
        ))}
      </div>

      {/* Main Layout (Sidebar + Products Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Sidebar (Sizes Filter) */}
        <aside className="lg:col-span-3 space-y-6">
          <div>
            <div className="h-4 w-32 bg-vintage-border/70 rounded shimmer-effect mb-3" />
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 rounded-lg border-2 border-vintage-border/80 bg-[#f1ede6] shimmer-effect"
                />
              ))}
            </div>
          </div>
        </aside>

        {/* Right Area: Search, Sort & Products Grid */}
        <div className="lg:col-span-9 space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="w-full max-w-md h-10 rounded-lg bg-[#f1ede6] border-2 border-vintage-border/80 shimmer-effect" />
            <div className="flex items-center justify-between sm:justify-end gap-4">
              <div className="h-4 w-24 bg-vintage-border/70 rounded shimmer-effect" />
              <div className="h-9 w-36 rounded-lg bg-[#f1ede6] border-2 border-vintage-border/80 shimmer-effect" />
            </div>
          </div>

          {/* Products Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
