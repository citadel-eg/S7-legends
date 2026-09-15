import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getActiveProducts, getActiveCategories } from '@/lib/queries/storefront';
import { FeaturedCarousel } from '@/components/home/featured-carousel';
import { SocialSection } from '@/components/home/social-section';
import { VintageBadge } from '@/components/ui/vintage-badge';
import { t } from '@/i18n';

export default async function HomePage() {
  const [featuredProducts, dbCategories] = await Promise.all([
    getActiveProducts({ featuredOnly: true, limit: 3 }),
    getActiveCategories(),
  ]);

  const categoryImages: Record<string, string> = {
    'maillots-rares': '/assets/cat-rare-figma.png',
    'authentique': '/assets/cat-auth-figma.png',
    'coupe-du-monde': '/assets/cat-wc-figma.png',
    'ucl': '/assets/cat-ucl-figma.png',
  };

  const categoryCards = dbCategories.length > 0
    ? dbCategories.slice(0, 4).map((cat, idx) => ({
        num: `0${idx + 1}`,
        title: cat.name,
        slug: cat.slug,
        img: categoryImages[cat.slug] || '/assets/cat-rare-figma.png',
      }))
    : [
        { num: '01', title: 'Maillots rares', slug: 'maillots-rares', img: '/assets/cat-rare-figma.png' },
        { num: '02', title: 'Authentique', slug: 'authentique', img: '/assets/cat-auth-figma.png' },
        { num: '03', title: 'Coupe du Monde', slug: 'coupe-du-monde', img: '/assets/cat-wc-figma.png' },
        { num: '04', title: 'UCL', slug: 'ucl', img: '/assets/cat-ucl-figma.png' },
      ];

  return (
    <div className="bg-[#f7f3ec] flex flex-col w-full overflow-x-hidden">

      {/* ═══════ 1. HERO ═══════ */}
      <section className="w-full flex justify-center">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 pt-3 sm:pt-6 pb-6 sm:pb-8">
          <div className="bg-[#f1ede6] rounded-2xl overflow-hidden flex flex-col lg:flex-row items-stretch border border-vintage-border/70 shadow-xs">

            {/* Left copy */}
            <div className="w-full lg:w-fit lg:min-w-85 xl:min-w-100 shrink-0 p-6 sm:p-8 md:p-10 lg:p-10 xl:p-12 flex flex-col justify-between">
              <div className="flex items-center justify-between w-full gap-2">
                <VintageBadge text={t('home.releaseBadge')} initialRotate={-3} />
                <span className="font-lato text-xs sm:text-[12px] text-[#562117] font-semibold">
                  {t('home.originBadge')}
                </span>
              </div>

              <div className="pt-4 sm:pt-6">
                <p className="font-lato text-xs sm:text-base lg:text-[17px] text-[#562117] font-medium">
                  {t('home.heroSubtitle')}
                </p>
                <div className="pt-2 sm:pt-3">
                  <h1
                    className="font-archivo font-black text-3xl sm:text-5xl md:text-6xl lg:text-[44px] xl:text-[56px] 2xl:text-[66px] uppercase leading-[0.92] tracking-tight text-vintage-dark"
                    style={{ fontVariationSettings: '"wdth" 90' }}
                  >
                    <span className="block whitespace-nowrap">MAILLOTS</span>
                    <span className="block whitespace-nowrap">RARES.</span>
                    <span className="block whitespace-nowrap text-vintage-red">MEILLEURS</span>
                    <span className="block whitespace-nowrap">PRIX.</span>
                  </h1>
                </div>
              </div>

              <p className="font-lato text-xs sm:text-sm md:text-base lg:text-[17px] text-[#524848] pt-3 sm:pt-4 max-w-sm sm:max-w-md leading-relaxed">
                {t('home.heroDescription')}
              </p>

              <div className="pt-5 sm:pt-7 mt-2 lg:mt-auto">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-vintage-red hover:bg-[#a82e18] text-white font-archivo font-bold text-xs sm:text-sm uppercase px-5 sm:px-6 py-3.5 sm:py-4 h-11 sm:h-12 rounded-lg transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
                >
                  <span>{t('home.browseStore')}</span>
                  <span className="text-sm sm:text-base tracking-[1.54px]">→</span>
                </Link>
              </div>
            </div>

            {/* Right image (Expands to fill all remaining space) */}
            <div className="flex-1 w-full relative min-h-75 sm:min-h-95 md:min-h-110 lg:min-h-full self-stretch p-3 sm:p-5 lg:p-6 flex items-center justify-center">
              <Image
                src="/assets/hero-rack-figma.png"
                alt="Vintage Football Shirts Archive"
                fill
                priority
                className="object-contain object-center"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ 2. CATEGORIES ═══════ */}
      <section className="w-full flex justify-center">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-8 sm:py-12 lg:py-16">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
            <div>
              <p className="font-lato text-xs sm:text-sm lg:text-[16px] uppercase text-[#562117] font-semibold tracking-wider">
                {t('home.choosePlayer')}
              </p>
              <h2
                className="font-archivo font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase text-vintage-dark leading-tight pt-1"
                style={{ fontVariationSettings: '"wdth" 92' }}
              >
                {t('home.whatAreYouLookingFor')}
              </h2>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 font-archivo font-semibold text-xs sm:text-[13px] uppercase text-[#562117] hover:text-vintage-red transition-colors shrink-0 self-start sm:self-auto"
            >
              <span>{t('home.allJerseys')}</span>
              <span className="font-lato font-bold text-sm sm:text-[16px] tracking-[1.43px]">→</span>
            </Link>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 pt-5 sm:pt-8">
            {categoryCards.map((cat) => (
              <Link
                key={cat.num}
                href={`/category/${cat.slug}`}
                className="group relative overflow-hidden rounded-xl block bg-[#d9dfcd] border border-vintage-border/60 shadow-xs aspect-3/4 sm:aspect-331/419"
              >
                <Image
                  src={cat.img}
                  alt={cat.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                />

                {/* Number badge */}
                <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10 flex items-center justify-center bg-vintage-cream px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-xs shadow-xs">
                  <span className="font-archivo text-[9px] sm:text-[10px] font-bold leading-none tracking-normal text-[#562117]">
                    {cat.num}
                  </span>
                </div>

                {/* Bottom overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-[rgba(21,21,21,0.7)] backdrop-blur-[2px] p-3 sm:p-4 z-10 transition-colors group-hover:bg-[rgba(21,21,21,0.8)]">
                  <h3
                    className="font-archivo font-black text-sm sm:text-lg lg:text-[20px] uppercase text-white leading-snug"
                    style={{ fontVariationSettings: '"wdth" 92' }}
                  >
                    {cat.title}
                  </h3>
                  <p className="font-lato font-bold text-[10px] sm:text-[12px] tracking-[1px] uppercase text-[#eae5d5] pt-0.5 sm:pt-1 group-hover:translate-x-1 transition-transform">
                    {t('home.viewCategory')} →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ 3. FEATURED / ICONIQUE ═══════ */}
      <section className="w-full bg-[#f4eddf] overflow-hidden py-10 sm:py-14 lg:py-18 border-y border-vintage-border/60">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 sm:gap-8 lg:gap-10 xl:gap-12">
            {/* Left title */}
            <div className="shrink-0 flex flex-col gap-3 sm:gap-5 w-full lg:w-[320px] xl:w-95">
              <div
                className="font-archivo font-black text-2xl sm:text-4xl md:text-5xl lg:text-[46px] xl:text-[54px] uppercase leading-none tracking-tight text-vintage-dark"
                style={{ fontVariationSettings: '"wdth" 92' }}
              >
                <p>ICONIQUE.</p>
                <p>
                  <span className="text-vintage-red">RARE. </span>
                  <span>BOUTIQUE.</span>
                </p>
              </div>

              <Link
                href="/shop"
                className="inline-flex items-center gap-2 sm:gap-3 border-2 border-vintage-red bg-[#f4eddf] hover:bg-vintage-red text-vintage-red hover:text-white font-archivo font-bold text-xs sm:text-sm uppercase px-4 sm:px-6 py-3 sm:py-3.5 rounded-lg transition-all group self-start active:scale-95 shadow-xs"
              >
                <span>{t('home.browseAllJerseys')}</span>
                <span className="text-sm sm:text-base tracking-[1.65px] group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>

            {/* Right carousel */}
            <div className="w-full lg:flex-1 min-w-0 overflow-hidden">
              <FeaturedCarousel products={featuredProducts} />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ 4. LEGENDS BANNER ═══════ */}
      <section className="w-full flex justify-center">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-8 sm:py-12 lg:py-16">
          <div className="bg-[#f5ece3] border-2 border-[#562117] rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
            {/* Left copy */}
            <div className="flex flex-col gap-3 justify-center px-5 sm:px-8 md:px-10 lg:px-10 xl:px-12 py-6 sm:py-8 lg:py-10">
              <p className="font-lato text-xs sm:text-sm lg:text-[16px] uppercase text-[#562117] font-semibold tracking-wider">
                {t('home.legendsBadge')}
              </p>

              <div
                className="font-archivo font-black text-2xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl 2xl:text-[64px] uppercase leading-none tracking-tight text-vintage-dark pt-1"
                style={{ fontVariationSettings: '"wdth" 92' }}
              >
                <p>LÉGENDES</p>
                <p>
                  <span>JAMAIS </span>
                  <span className="text-vintage-red">OUBLIÉES.</span>
                </p>
              </div>

              <p className="font-lato text-xs sm:text-sm md:text-base lg:text-[17px] text-[#524848] leading-relaxed max-w-md pt-1">
                {t('home.legendsDescription')}
              </p>

              <div className="pt-4 sm:pt-6">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-vintage-red hover:bg-[#a82e18] text-white font-archivo font-bold text-xs sm:text-sm uppercase px-5 sm:px-6 py-3.5 sm:py-4 rounded-lg transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
                >
                  <span>{t('home.discoverLegends')}</span>
                  <span className="text-sm sm:text-base tracking-[1.54px]">→</span>
                </Link>
              </div>
            </div>

            {/* Right image */}
            <div className="relative min-h-65 sm:min-h-85 md:min-h-100 lg:min-h-full self-stretch w-full min-w-0 p-3 sm:p-5 flex items-center justify-center">
              <Image
                src="/assets/banner-legends-figma.png"
                alt="Football Legends: Maradona, Messi, Zidane, Ronaldo"
                fill
                className="object-contain object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ 5. EDITORIAL SPLIT ═══════ */}
      <section className="w-full flex justify-center">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-6 sm:py-8 lg:py-10">
          <div className="bg-white rounded-2xl overflow-hidden flex flex-col lg:flex-row items-stretch border border-vintage-border/70 shadow-xs">
            {/* Left photo */}
            <div className="relative w-full lg:w-[48%] shrink-0 min-h-60 sm:min-h-80 md:min-h-95 lg:min-h-105 self-stretch overflow-hidden">
              <Image
                src="/assets/editorial-street-figma.png"
                alt="Street Style Vintage Football Shirts"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-[rgba(69,28,20,0.2)]" />
              <div className="absolute bottom-4 left-4 sm:bottom-5 sm:left-5">
                <VintageBadge
                  text="Trouvaille rare"
                  initialRotate={-3}
                  className="bg-white text-vintage-red! border-vintage-red shadow-xs"
                />
              </div>
            </div>

            {/* Right copy */}
            <div className="flex-1 flex flex-col justify-center gap-3 sm:gap-4 p-5 sm:p-8 lg:p-10 xl:p-12">
              <p className="font-lato text-xs sm:text-sm lg:text-[16px] uppercase text-[#562117] font-semibold tracking-wider">
                {t('home.unforgettableBadge')}
              </p>

              <div className="flex flex-col gap-1.5 sm:gap-2">
                <div
                  className="font-archivo font-black uppercase leading-tight text-black text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-[48px]"
                  style={{ fontVariationSettings: '"wdth" 92' }}
                >
                  <p>AFFICHEZ-VOUS</p>
                  <p>EN STYLE</p>
                  <p className="text-vintage-red">INOUBLIABLE.</p>
                </div>

                <div className="font-lato text-xs sm:text-sm md:text-base lg:text-[17px] text-[#524848] leading-relaxed pt-1">
                  <p>Saisons oubliées, sponsors improbables</p>
                  <p>et maillots que vous ne verrez pas partout.</p>
                </div>
              </div>

              <div className="pt-3 sm:pt-4">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-vintage-red bg-white hover:bg-vintage-red text-vintage-red hover:text-white font-archivo font-bold text-xs sm:text-sm uppercase px-5 sm:px-6 py-3 sm:py-3.5 rounded-lg transition-all group active:scale-95 shadow-xs"
                >
                  <span>{t('home.discoverRare')}</span>
                  <span className="text-sm sm:text-base tracking-[1.54px] group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ 6. SOCIAL ═══════ */}
      <section className="w-full flex justify-center">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
          <SocialSection />
        </div>
      </section>
    </div>
  );
}
