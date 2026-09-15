import React from 'react';

export function ProductCardSkeleton() {
  return (
    <div className="relative aspect-3/4 w-full rounded-2xl overflow-hidden border border-vintage-border bg-[#E8E4DA] shimmer-effect shadow-xs select-none">
      {/* Top Category Badge Placeholder */}
      <div className="absolute top-3.5 left-3.5 z-20 pointer-events-none">
        <div className="h-4.5 w-20 bg-white/90 rounded-xs shadow-xs" />
      </div>

      {/* Bottom Information Bar Placeholder matching dark bar in ProductCard */}
      <div className="absolute inset-x-0 bottom-0 z-10 bg-[#262626]/95 backdrop-blur-xs p-3 sm:p-4 lg:p-4.5 flex flex-col justify-end gap-2 text-white">
        {/* Title & Price Row */}
        <div className="flex items-baseline justify-between gap-2">
          <div className="h-4 sm:h-5 w-3/5 bg-white/20 rounded" />
          <div className="h-5 sm:h-6 w-14 bg-white/20 rounded" />
        </div>

        {/* Subtitle & Sizes Row */}
        <div className="flex items-center justify-between pt-1">
          <div className="h-3 w-2/5 bg-white/15 rounded" />
          <div className="h-3 w-16 bg-white/15 rounded" />
        </div>
      </div>
    </div>
  );
}
