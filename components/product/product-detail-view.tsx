'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { ProductWithDetails } from '@/types/database';
import { Gallery } from '@/components/product/gallery';
import { SizeSelector } from '@/components/product/size-selector';
import { QuantitySelector } from '@/components/product/quantity-selector';
import { WhatsAppButton } from '@/components/product/whatsapp-button';
import { ProductCard } from '@/components/product/product-card';
import { SocialSection } from '@/components/home/social-section';
import { VintageBadge } from '@/components/ui/vintage-badge';

interface ProductDetailViewProps {
  product: ProductWithDetails;
  relatedProducts: ProductWithDetails[];
}

export function ProductDetailView({ product, relatedProducts }: ProductDetailViewProps) {
  const [selectedSize, setSelectedSize] = useState<string>(
    product.variants.find((v) => v.available && v.stock > 0)?.size || 'M'
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [descriptionOpen, setDescriptionOpen] = useState<boolean>(true);
  const [shippingOpen, setShippingOpen] = useState<boolean>(true);

  const selectedVariant = product.variants.find(
    (v) => v.size.toUpperCase() === selectedSize.toUpperCase()
  );
  const maxStock = selectedVariant ? selectedVariant.stock : 10;

  const orderParams = {
    productName: product.name,
    player: product.player,
    team: product.team,
    year: product.year,
    size: selectedSize,
    quantity,
    price: product.price,
    productUrl: `/product/${product.slug}`,
  };

  const categoryName = product.category?.name;
  const shippingText =
    product.shipping_text ||
    'Expédié depuis la France sous 2 jours ouvrés. Livraison standard en France sous 3 à 5 jours, avec expédition suivie dans toute l’Europe.';

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-6 md:py-10 space-y-12 lg:space-y-16">
      {/* Breadcrumb Navigation (Figma node 25:1281) */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-3">
        <Link
          href="/shop"
          className="p-1 -ml-1 text-[#562117] hover:text-vintage-red transition-colors"
          aria-label="Retour à la boutique"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <p className="font-lato text-[13px] sm:text-[14px] uppercase tracking-wide">
          <Link href="/" className="text-[#8a877c] hover:text-vintage-dark transition-colors">
            Accueil
          </Link>
          <span className="text-[#8a877c]"> / </span>
          <Link href="/shop" className="text-[#8a877c] hover:text-vintage-dark transition-colors">
            Boutique
          </Link>
          <span className="text-[#562117] font-bold"> / {product.name.toUpperCase()}</span>
        </p>
      </nav>

      {/* Main Product Layout (Figma node 26:1601) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        {/* Left Column: Gallery (Figma node 26:1602) */}
        <div className="lg:col-span-6 xl:col-span-6 w-full">
          <Gallery images={product.images} productName={product.name} />
        </div>

        {/* Right Column: Details & Purchasing (Figma node 26:1614) */}
        <div className="lg:col-span-6 xl:col-span-6 flex flex-col space-y-5 lg:pl-2">
          {/* Top Animated Category Badge (Figma node 26:1707) */}
          {categoryName && (
            <div className="h-7 flex items-center">
              <VintageBadge text={`(${categoryName})`} initialRotate={-3} />
            </div>
          )}

          {/* Product Name (H1) */}
          <div>
            <h1
              className="font-archivo font-black text-3xl sm:text-4xl lg:text-[52px] text-vintage-dark tracking-[-0.96px] uppercase leading-tight"
              style={{ fontVariationSettings: '"wdth" 100' }}
            >
              {product.name}
            </h1>
            <p className="font-lato text-[15px] sm:text-[16px] text-[#562117] tracking-[1px] uppercase pt-1.5 font-medium">
              {product.team} · {product.product_type}
            </p>
          </div>

          {/* Price */}
          <div>
            <p
              className="font-archivo font-bold text-3xl sm:text-4xl lg:text-[52px] text-vintage-dark leading-none"
              style={{ fontVariationSettings: '"wdth" 100' }}
            >
              €{product.price}
            </p>
          </div>

          {/* Intro Description from server (Figma node 26:1625) */}
          <p className="font-lato text-[15px] sm:text-[16px] text-[#524848] leading-relaxed">
            {product.description ||
              'Un maillot qui a marqué toute une génération. Une pièce issue d’un stock authentique, choisie pour les passionnés qui portent l’histoire du football avec fierté.'}
          </p>

          {/* Sizes & Quantity Section (Figma node 26:1626) */}
          <div className="space-y-3 pt-2">
            <p className="font-lato text-[13px] sm:text-[14px] text-[#8a877c] tracking-[1.68px] uppercase font-medium">
              Choisissez votre taille :
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Sizes (Figma node 42:70) */}
              <SizeSelector
                variants={product.variants}
                selectedSize={selectedSize}
                onSelectSize={(size) => {
                  setSelectedSize(size);
                  setQuantity(1);
                }}
              />

              {/* Quantity (Figma node 26:1886) */}
              <QuantitySelector
                quantity={quantity}
                max={maxStock}
                onChange={setQuantity}
              />
            </div>
          </div>

          {/* Main WhatsApp CTA Button (Figma node 42:89 & 26:1901) */}
          <div className="pt-2">
            <WhatsAppButton
              orderParams={orderParams}
              disabled={!selectedSize}
            />
          </div>

          {/* Collapsible Accordions: Description & Expédition from server (Figma node 26:1671) */}
          <div className="border-t border-vintage-dark/10 divide-y divide-vintage-dark/10 pt-2">
            {/* Description Accordion */}
            <div>
              <button
                type="button"
                onClick={() => setDescriptionOpen(!descriptionOpen)}
                className="w-full flex items-center justify-between py-4 text-left cursor-pointer group"
              >
                <span className="font-lato text-[16px] text-[#562117] uppercase tracking-wide group-hover:text-vintage-red transition-colors font-medium">
                  Description
                </span>
                <span className="font-lato text-[20px] text-[#562117] font-medium select-none">
                  {descriptionOpen ? '−' : '+'}
                </span>
              </button>
              {descriptionOpen && (
                <div className="pb-5 font-lato text-[15px] sm:text-[16px] text-[#524848] leading-relaxed space-y-2">
                  <p>
                    {product.description ||
                      'Sélectionné avec soin et contrôlé pièce par pièce. Ce maillot a été choisi pour son caractère — un maillot fait pour être porté, pas oublié au fond d’un tiroir.'}
                  </p>
                  {product.condition && (
                    <p className="text-xs text-[#71717A] uppercase tracking-wider font-semibold pt-1">
                      État : <span className="text-vintage-dark">{product.condition}</span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Expédition & Livraison Accordion */}
            <div>
              <button
                type="button"
                onClick={() => setShippingOpen(!shippingOpen)}
                className="w-full flex items-center justify-between py-4 text-left cursor-pointer group"
              >
                <span className="font-lato text-[16px] text-[#562117] uppercase tracking-wide group-hover:text-vintage-red transition-colors font-medium">
                  Expédition & Livraison
                </span>
                <span className="font-lato text-[20px] text-[#562117] font-medium select-none">
                  {shippingOpen ? '−' : '+'}
                </span>
              </button>
              {shippingOpen && (
                <div className="pb-5 font-lato text-[15px] sm:text-[16px] text-[#524848] leading-relaxed">
                  <p>{shippingText}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section (Figma node 26:2468) */}
      {relatedProducts.length > 0 && (
        <section className="pt-16 border-t border-vintage-border space-y-8">
          <div>
            <p className="font-lato text-[16px] sm:text-[18px] text-[#562117] uppercase font-normal">
              Plus de maillots
            </p>
            <h2
              className="font-archivo font-black text-3xl sm:text-5xl lg:text-[60px] text-vintage-dark uppercase tracking-tight leading-tight pt-1"
              style={{ fontVariationSettings: '"wdth" 92' }}
            >
              Vous aimerez peut-être aussi.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Social Section */}
      <SocialSection />
    </div>
  );
}
