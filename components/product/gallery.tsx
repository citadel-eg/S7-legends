'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ProductImage } from '@/types/database';

interface GalleryProps {
  images: ProductImage[];
  productName: string;
}

export function Gallery({ images, productName }: GalleryProps) {
  const displayImages = images.length > 0
    ? images
    : [
        { id: '1', product_id: '', image_url: '/assets/ronaldo-large.png', alt_text: 'Front', sort_order: 0, is_primary: true, created_at: '' },
        { id: '2', product_id: '', image_url: '/assets/ronaldo-back.png', alt_text: 'Back', sort_order: 1, is_primary: false, created_at: '' },
        { id: '3', product_id: '', image_url: '/assets/ronaldo-detail.png', alt_text: 'Detail', sort_order: 2, is_primary: false, created_at: '' },
        { id: '4', product_id: '', image_url: '/assets/ronaldo-label.png', alt_text: 'Label', sort_order: 3, is_primary: false, created_at: '' },
      ];

  const [activeImage, setActiveImage] = useState(displayImages[0]?.image_url);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-4 w-full items-start">
      {/* Thumbnails (Figma node 26:1603: 80px width, 97.5px height) */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto shrink-0 py-1 w-full md:w-auto">
        {displayImages.map((img, idx) => {
          const isSelected = activeImage === img.image_url;
          return (
            <button
              key={img.id || idx}
              onClick={() => setActiveImage(img.image_url)}
              type="button"
              className={`relative w-16 h-20 md:w-20 md:h-[97.5px] rounded-sm overflow-hidden shrink-0 bg-[#e6ebe0] transition-all cursor-pointer ${
                isSelected
                  ? 'shadow-[0px_0px_0px_1px_#1f1e1b] opacity-100'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={img.image_url}
                alt={img.alt_text || productName}
                fill
                className="object-cover object-center"
              />
            </button>
          );
        })}
      </div>

      {/* Large Main Display (Figma node 26:1612: rounded-2xl) */}
      <div className="relative flex-1 w-full aspect-3/4 md:min-h-125 lg:min-h-155 rounded-2xl overflow-hidden bg-[#e6ebe0] border border-vintage-border/60">
        <Image
          src={activeImage}
          alt={productName}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center"
        />
      </div>
    </div>
  );
}
