import React from 'react';

export default function ProductLoading() {
  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-6 md:py-10 space-y-12 lg:space-y-16">
      {/* Breadcrumb Navigation Skeleton */}
      <div className="flex items-center gap-3">
        <div className="h-4 w-4 bg-vintage-border/70 rounded-full shimmer-effect" />
        <div className="h-3 w-48 bg-vintage-border/60 rounded shimmer-effect" />
      </div>

      {/* Main Product Layout (Gallery + Details) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        {/* Left Column: Gallery Skeleton */}
        <div className="lg:col-span-6 xl:col-span-6 w-full space-y-4">
          <div className="aspect-3/4 sm:aspect-331/419 w-full rounded-2xl bg-[#E8E4DA] border border-vintage-border shimmer-effect shadow-xs" />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl bg-[#E8E4DA] border border-vintage-border/80 shimmer-effect"
              />
            ))}
          </div>
        </div>

        {/* Right Column: Details & Purchasing Skeleton */}
        <div className="lg:col-span-6 xl:col-span-6 flex flex-col space-y-6 lg:pl-2">
          {/* Category Badge Skeleton */}
          <div className="h-6 w-28 bg-vintage-border/70 rounded shimmer-effect" />

          {/* Product Name (H1) & Subtitle Skeleton */}
          <div className="space-y-2">
            <div className="h-9 sm:h-12 w-4/5 bg-vintage-border/80 rounded-lg shimmer-effect" />
            <div className="h-4 w-1/2 bg-vintage-border/50 rounded shimmer-effect" />
          </div>

          {/* Price Skeleton */}
          <div className="h-10 sm:h-12 w-28 bg-vintage-border/80 rounded-lg shimmer-effect" />

          {/* Intro Description Skeleton */}
          <div className="space-y-2 max-w-lg">
            <div className="h-4 w-full bg-vintage-border/50 rounded shimmer-effect" />
            <div className="h-4 w-5/6 bg-vintage-border/50 rounded shimmer-effect" />
            <div className="h-4 w-3/4 bg-vintage-border/50 rounded shimmer-effect" />
          </div>

          {/* Sizes & Quantity Section */}
          <div className="space-y-3 pt-2">
            <div className="h-3.5 w-36 bg-vintage-border/60 rounded shimmer-effect" />
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-14 h-11 rounded-lg border-2 border-vintage-border/80 bg-transparent shimmer-effect"
                  />
                ))}
              </div>
              <div className="w-28 h-11 rounded-lg border-2 border-vintage-border/80 bg-transparent shimmer-effect" />
            </div>
          </div>

          {/* WhatsApp CTA Button Skeleton */}
          <div className="w-full h-14 rounded-lg bg-vintage-red/70 shimmer-effect" />

          {/* Accordion Skeletons */}
          <div className="border-t border-vintage-dark/10 divide-y divide-vintage-dark/10 pt-2">
            <div className="py-4 flex justify-between items-center">
              <div className="h-4 w-28 bg-vintage-border/60 rounded shimmer-effect" />
              <div className="h-4 w-4 bg-vintage-border/60 rounded shimmer-effect" />
            </div>
            <div className="py-4 flex justify-between items-center">
              <div className="h-4 w-36 bg-vintage-border/60 rounded shimmer-effect" />
              <div className="h-4 w-4 bg-vintage-border/60 rounded shimmer-effect" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
