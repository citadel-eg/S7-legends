'use client';

import React from 'react';

interface QuantitySelectorProps {
  quantity: number;
  max: number;
  onChange: (qty: number) => void;
}

export function QuantitySelector({ quantity, max, onChange }: QuantitySelectorProps) {
  const handleDecrease = () => {
    if (quantity > 1) {
      onChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  return (
    <div className="border-2 border-vintage-border/80 bg-transparent rounded-lg flex items-center h-11 shrink-0 overflow-hidden select-none">
      <button
        type="button"
        onClick={handleDecrease}
        disabled={quantity <= 1}
        className="w-11 h-11 bg-transparent border-r-2 border-vintage-border/80 flex items-center justify-center font-lato text-[18px] text-vintage-dark hover:bg-vintage-dark/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        aria-label="Decrease quantity"
      >
        −
      </button>

      <span className="w-10 text-center font-lato text-[14px] text-vintage-dark font-bold bg-transparent">
        {quantity}
      </span>

      <button
        type="button"
        onClick={handleIncrease}
        disabled={quantity >= max}
        className="w-11 h-11 bg-transparent border-l-2 border-vintage-border/80 flex items-center justify-center font-lato text-[18px] text-vintage-dark hover:bg-vintage-dark/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
