'use client';

import React from 'react';
import { ProductVariant } from '@/types/database';

export const SIZE_CONFIG: Array<{ size: string; weightRange: string }> = [
  { size: 'XS', weightRange: '35 to 45' },
  { size: 'S', weightRange: '45 to 55' },
  { size: 'M', weightRange: '55 to 65' },
  { size: 'L', weightRange: '65 to 75' },
  { size: 'XL', weightRange: '75 to 85' },
  { size: 'XXL', weightRange: '85 to 100' },
];

interface SizeSelectorProps {
  variants: ProductVariant[];
  selectedSize: string;
  onSelectSize: (size: string) => void;
}

export function SizeSelector({ variants, selectedSize, onSelectSize }: SizeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      {SIZE_CONFIG.map(({ size, weightRange }) => {
        const variant = variants.find(
          (v) => v.size.toUpperCase() === size.toUpperCase()
        );
        const isAvailable = variant ? variant.available && variant.stock > 0 : false;
        const isSelected = selectedSize.toUpperCase() === size.toUpperCase();

        if (!isAvailable) {
          return (
            <div
              key={size}
              title="Taille indisponible"
              className="w-14 h-11 rounded-lg border-2 border-vintage-border/60 flex flex-col items-center justify-center opacity-50 select-none cursor-not-allowed bg-transparent"
            >
              <span className="font-lato text-[12px] font-bold text-vintage-dark line-through leading-tight">
                {size}
              </span>
              <span className="font-lato text-[10px] text-vintage-dark opacity-55 leading-tight">
                {weightRange}
              </span>
            </div>
          );
        }

        return (
          <button
            key={size}
            type="button"
            onClick={() => onSelectSize(size)}
            className={`w-14 h-11 rounded-lg flex flex-col items-center justify-center transition-all duration-150 cursor-pointer ${
              isSelected
                ? 'bg-vintage-red text-white border-2 border-vintage-red shadow-xs'
                : 'bg-transparent text-vintage-dark border-2 border-vintage-border/80 hover:border-vintage-dark hover:bg-vintage-dark/5'
            }`}
          >
            <span
              className={`font-lato text-[12px] font-bold leading-tight ${
                isSelected ? 'text-white' : 'text-vintage-dark'
              }`}
            >
              {size}
            </span>
            <span
              className={`font-lato text-[10px] leading-tight ${
                isSelected ? 'text-white/80' : 'text-vintage-dark opacity-55'
              }`}
            >
              {weightRange}
            </span>
          </button>
        );
      })}
    </div>
  );
}
