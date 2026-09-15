'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { ProductWithDetails } from '@/types/database';
import { getWhatsAppOrderUrl } from '@/lib/whatsapp';

export function WhatsAppIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.3948 11.7138C7.25129 11.7131 4.69326 9.06832 4.69257 5.81891C4.69396 4.99535 5.34169 4.32495 6.13753 4.32495C6.21928 4.32495 6.30033 4.33218 6.37719 4.34663C6.54768 4.37552 6.70907 4.43548 6.8586 4.52506C6.88026 4.53806 6.89494 4.55973 6.89843 4.58502L7.23032 6.7501C7.23452 6.77538 7.22683 6.80066 7.21076 6.81945C7.02699 7.02967 6.79293 7.18066 6.533 7.25651L6.40723 7.29334L6.45474 7.41905C6.88375 8.54674 7.75575 9.44903 8.84715 9.89259L8.96873 9.94171L9.00437 9.81168C9.07773 9.54222 9.22377 9.30021 9.4271 9.11094C9.44177 9.09721 9.46134 9.08927 9.4816 9.08927C9.48579 9.08927 9.49068 9.08926 9.49487 9.09071L11.5882 9.43385C11.6134 9.43819 11.6337 9.45264 11.6469 9.47504C11.7329 9.62963 11.7909 9.79723 11.8195 9.97278C11.8328 10.0515 11.8398 10.1339 11.8398 10.2206C11.8398 11.0434 11.1914 11.7131 10.3948 11.7145V11.7138Z"
        fill="white"
      />
      <path
        d="M15.9693 7.28626C15.7995 5.3054 14.9219 3.46831 13.4979 2.11378C12.0655 0.750588 10.2062 0 8.26237 0C3.99598 0 0.52474 3.58895 0.52474 8C0.52474 9.48022 0.919507 10.9229 1.66714 12.1792L0 15.9957L5.33962 15.4076C6.26822 15.8006 7.25132 16 8.26237 16C8.52858 16 8.80107 15.9856 9.07427 15.9567C9.31533 15.9299 9.5585 15.8909 9.79816 15.8411C13.3714 15.0948 15.9797 11.8158 16 8.04262V8C16 7.75944 15.9895 7.5196 15.9686 7.28698L15.9693 7.28626ZM5.54434 13.7323L2.59016 14.0574L3.47264 12.0368L3.29656 11.7919C3.28328 11.7739 3.2707 11.7558 3.25603 11.7356C2.49023 10.6426 2.08567 9.35091 2.08567 7.99928C2.08567 4.47751 4.85681 1.61314 8.26237 1.61314C11.4534 1.61314 14.1575 4.18711 14.4181 7.47264C14.4321 7.64891 14.4391 7.8259 14.4391 8C14.4391 8.04985 14.4384 8.09897 14.437 8.15098C14.3713 11.097 12.3806 13.5987 9.59623 14.2359C9.38382 14.285 9.16582 14.3218 8.94852 14.3464C8.72283 14.3731 8.49155 14.3861 8.26167 14.3861C7.44347 14.3861 6.64832 14.2221 5.89649 13.8985C5.81335 13.8638 5.7316 13.827 5.65474 13.7887L5.54296 13.7331L5.54434 13.7323Z"
        fill="white"
      />
    </svg>
  );
}

interface ProductCardProps {
  product: ProductWithDetails;
  className?: string;
  priority?: boolean;
  isCoverActive?: boolean;
}

export function ProductCard({
  product,
  className = '',
  priority = false,
  isCoverActive = true,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const canHover = isCoverActive !== false;

  // Fallback image matching Figma prototypes
  let primaryImage =
    product.images.find((img) => img.is_primary)?.image_url ||
    product.images[0]?.image_url;

  if (!primaryImage || primaryImage.includes('hero-rack')) {
    if (product.slug.includes('kaka')) {
      primaryImage = '/assets/kaka-milan-2007.png';
    } else if (product.slug.includes('zidane')) {
      primaryImage = '/assets/zidane-france-1998.png';
    } else if (product.slug.includes('messi')) {
      primaryImage = '/assets/messi-barca-2009.png';
    } else if (product.slug.includes('ronaldo')) {
      primaryImage = '/assets/ronaldo-large.png';
    } else {
      primaryImage = '/assets/hero-rack.png';
    }
  }

  const availableSizes = product.variants && product.variants.length > 0
    ? product.variants.filter((v) => v.available && v.stock > 0).map((v) => v.size)
    : [];

  const availableSizesText = availableSizes.length > 0
    ? availableSizes.join(' • ')
    : '';

  const defaultSize = availableSizes[0] || 'M';

  const whatsappUrl = getWhatsAppOrderUrl({
    productName: product.name,
    player: product.player,
    team: product.team,
    year: product.year,
    size: defaultSize,
    quantity: 1,
    price: product.price,
    productUrl: `/product/${product.slug}`,
  });

  // Direct category name from backend
  const badgeText = product.category?.name || 'ARCHIVE';

  return (
    <div
      onMouseEnter={() => canHover && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative aspect-3/4 w-full rounded-2xl overflow-hidden border border-vintage-border shadow-xs hover:shadow-xl transition-all duration-500 bg-[#E8E4DA] select-none ${className}`}
    >
      {/* Top Category Badge matching design: pure white tag with black bold text */}
      <div className="absolute top-3.5 left-3.5 z-20 pointer-events-none">
        <span className="inline-block bg-white text-black text-[10px] font-bold tracking-[1.4px] uppercase px-2.5 py-0.5 rounded-xs shadow-xs">
          {badgeText}
        </span>
      </div>

      {/* Main Product Image */}
      <Link href={`/product/${product.slug}`} className="absolute inset-0 z-0 block">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {/* Subtle dark gradient overlay at bottom for optimal contrast */}
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
      </Link>

      {/* Bottom Information & Interactive Actions Overlay */}
      <div className="absolute inset-x-0 bottom-0 z-10 bg-[#262626]/95 backdrop-blur-xs p-3 sm:p-4 lg:p-4.5 flex flex-col justify-end text-white transition-colors">
        {/* Top Row: Player — Year and Price */}
        <div className="flex items-baseline justify-between gap-2">
          <Link href={`/product/${product.slug}`} className="hover:underline truncate">
            <h3 className="font-sans text-sm sm:text-base lg:text-lg font-bold tracking-wide uppercase truncate text-white">
              {product.player.toUpperCase()} — {product.year}
            </h3>
          </Link>
          <span className="font-sans text-lg sm:text-xl lg:text-2xl font-bold text-white shrink-0">
            €{product.price}
          </span>
        </div>

        {/* Subtitle Row: Team - Shirt Type, and Available Sizes */}
        <div className="flex items-center justify-between text-[10px] sm:text-xs font-semibold tracking-wider text-white/80 pt-1.5 uppercase font-sans">
          <span className="truncate pr-2 text-white/80">
            {product.team} - {product.product_type}
          </span>
          <span className="text-white/90 font-bold tracking-widest shrink-0">
            {availableSizesText}
          </span>
        </div>

        {/* Smooth Hover Actions (Figma 52:159 & User Action Button) */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 10 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 sm:gap-2 pt-1">
                {/* WhatsApp Primary Order CTA */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (typeof window !== 'undefined') {
                      const fullUrl = getWhatsAppOrderUrl({
                        productName: product.name,
                        player: product.player,
                        team: product.team,
                        year: product.year,
                        size: defaultSize,
                        quantity: 1,
                        price: product.price,
                        productUrl: window.location.origin + `/product/${product.slug}`,
                      });
                      window.open(fullUrl, '_blank', 'noopener,noreferrer');
                      e.preventDefault();
                    }
                  }}
                  className="flex-1 min-w-30 bg-vintage-red hover:bg-[#a82e18] text-white font-bold h-9 sm:h-9.5 lg:h-10 px-2.5 sm:px-3.5 rounded-full flex items-center justify-center gap-1.5 sm:gap-2 shadow-md transition-all active:scale-95 group/btn"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span className="font-bold text-white text-[11px] sm:text-xs lg:text-[13px] whitespace-nowrap truncate">
                    Demandez le prix
                  </span>
                </a>

                {/* Details Button */}
                <Link
                  href={`/product/${product.slug}`}
                  onClick={(e) => e.stopPropagation()}
                  className="border border-white/80 hover:border-white hover:bg-white/20 text-white font-bold h-9 sm:h-9.5 lg:h-10 px-3 sm:px-3.5 rounded-full flex items-center justify-center shadow-sm transition-colors shrink-0 text-[11px] sm:text-xs lg:text-[13px] whitespace-nowrap"
                >
                  <span>Détails</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
