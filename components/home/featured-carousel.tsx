'use client';

import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductWithDetails } from '@/types/database';
import { ProductCard } from '@/components/product/product-card';

import 'swiper/css';
import 'swiper/css/effect-coverflow';

interface FeaturedCarouselProps {
  products: ProductWithDetails[];
}

export function FeaturedCarousel({ products }: FeaturedCarouselProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  // Take the 3 base products directly from props
  const baseProducts = React.useMemo(() => {
    return products && products.length > 0 ? products.slice(0, 3) : [];
  }, [products]);

  // Buffer repeated items (e.g. 12 slides) so Swiper loop has pre-rendered
  // upcoming slides on the right at all times, without waiting to drag or grab.
  const slideItems = React.useMemo(() => {
    if (baseProducts.length === 0) return [];
    const repeatCount = Math.max(4, Math.ceil(12 / baseProducts.length));
    const items: ProductWithDetails[] = [];
    for (let i = 0; i < repeatCount; i++) {
      items.push(...baseProducts);
    }
    return items;
  }, [baseProducts]);

  if (baseProducts.length === 0) {
    return null;
  }

  return (
    <div className="featured-carousel-wrapper relative w-full min-w-0 py-2 sm:py-4 overflow-hidden">
      {/* Viewport is strictly contained to prevent spilling onto left text */}
      <div className="featured-carousel-viewport overflow-hidden py-3 sm:py-5">
        <Swiper
          modules={[EffectCoverflow, Autoplay]}
          effect="coverflow"
          grabCursor
          centeredSlides
          loop
          loopAdditionalSlides={3}
          watchSlidesProgress
          speed={650}
          slidesPerView={1.15}
          spaceBetween={10}
          breakpoints={{
            480: {
              slidesPerView: 1.5,
              spaceBetween: 12,
            },
            640: {
              slidesPerView: 2.1,
              spaceBetween: 14,
            },
            768: {
              slidesPerView: 2.4,
              spaceBetween: 16,
            },
            1024: {
              slidesPerView: 1.8,
              spaceBetween: 16,
            },
            1280: {
              slidesPerView: 2.3,
              spaceBetween: 18,
            },
            1536: {
              slidesPerView: 2.8,
              spaceBetween: 20,
            },
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          autoplay={{
            delay: 3600,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          coverflowEffect={{
            rotate: 22, // Angle side slides in 3D so they face the active center slide
            stretch: 0,
            depth: 85,
            modifier: 1,
            scale: 0.84,
            slideShadows: false,
          }}
          className="featured-swiper w-full"
        >
          {slideItems.map((product, index) => (
            <SwiperSlide
              key={`${product.id}-${index}`}
              className="h-auto! shrink-0 select-none"
            >
              {({ isActive }) => (
                <div
                  className={`group relative h-full w-full transition-opacity duration-300 will-change-transform ${
                    isActive
                      ? 'opacity-100 z-20 cursor-default'
                      : 'opacity-75 hover:opacity-95 z-10 cursor-pointer'
                  }`}
                  onClick={() => {
                    if (!isActive) {
                      swiperRef.current?.slideTo(index);
                    }
                  }}
                >
                  <ProductCard
                    product={product}
                    priority={isActive}
                    isCoverActive={isActive}
                    className={`w-full transition-shadow duration-300 ${
                      isActive
                        ? 'shadow-[0_16px_36px_rgba(31,30,27,0.2)] ring-1 ring-black/5'
                        : 'shadow-md hover:shadow-lg'
                    }`}
                  />
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Navigation Controls (Aligned to end, styled with design system vintage red) */}
      <div className="mt-4 sm:mt-6 flex items-center justify-end gap-2.5 sm:gap-3 px-1 sm:px-2">
        <button
          type="button"
          onClick={() => swiperRef.current?.slidePrev()}
          className="
            flex h-10 w-10 sm:h-11 sm:w-11 cursor-pointer items-center justify-center
            rounded-lg sm:rounded-xl border-2 border-vintage-red bg-vintage-red text-white
            shadow-xs transition-all duration-200
            hover:bg-[#a82e18] hover:border-[#a82e18]
            active:scale-95
          "
          aria-label="Précédent"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={() => swiperRef.current?.slideNext()}
          className="
            flex h-10 w-10 sm:h-11 sm:w-11 cursor-pointer items-center justify-center
            rounded-lg sm:rounded-xl border-2 border-vintage-red bg-vintage-red text-white
            shadow-xs transition-all duration-200
            hover:bg-[#a82e18] hover:border-[#a82e18]
            active:scale-95
          "
          aria-label="Suivant"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}