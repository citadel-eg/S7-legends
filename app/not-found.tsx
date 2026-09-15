import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { VintageBadge } from '@/components/ui/vintage-badge';
import { t } from '@/i18n';
import { Search, Home, ShoppingBag, ArrowRight } from 'lucide-react';

export const metadata = {
  title: '404 - Page Hors-Jeu',
  description: 'Page introuvable sur S7 Légendes. Explorez nos maillots rares et archives de football vintage.',
};

export default function NotFound() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '33658898860';
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');

  const quickLinks = [
    { title: 'Maillots Rares', slug: 'maillots-rares', img: '/assets/cat-rare-figma.png' },
    { title: 'Authentique', slug: 'authentique', img: '/assets/cat-auth-figma.png' },
    { title: 'Coupe du Monde', slug: 'coupe-du-monde', img: '/assets/cat-wc-figma.png' },
    { title: 'UCL', slug: 'ucl', img: '/assets/cat-ucl-figma.png' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f3ec] text-vintage-dark">
      <Header />

      <main className="flex-1 flex flex-col justify-center items-center py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center">
          
          {/* Badge */}
          <div className="mb-4">
            <VintageBadge text={t('notFound.badge')} initialRotate={-2} />
          </div>

          {/* Big Stylized 404 Display */}
          <div className="relative select-none my-2">
            <span
              className="font-archivo font-black text-7xl sm:text-9xl md:text-[140px] lg:text-[160px] leading-none tracking-tighter text-vintage-dark/10 block"
              style={{ fontVariationSettings: '"wdth" 92' }}
            >
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="font-archivo font-black text-4xl sm:text-6xl md:text-7xl lg:text-[80px] uppercase leading-none tracking-tight text-vintage-red drop-shadow-xs"
                style={{ fontVariationSettings: '"wdth" 92' }}
              >
                HORS-JEU
              </span>
            </div>
          </div>

          {/* Heading and Description */}
          <h1
            className="font-archivo font-black text-2xl sm:text-3xl md:text-4xl uppercase text-vintage-dark tracking-tight mt-2"
            style={{ fontVariationSettings: '"wdth" 92' }}
          >
            {t('notFound.subtitle')}
          </h1>

          <p className="font-lato text-sm sm:text-base md:text-lg text-[#524848] max-w-lg mt-3 leading-relaxed">
            {t('notFound.description')}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-8 w-full sm:w-auto">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-vintage-dark hover:bg-[#383733] text-white font-archivo font-bold text-xs sm:text-sm uppercase px-6 py-3.5 sm:py-4 rounded-lg transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
            >
              <Home className="w-4 h-4" />
              <span>{t('notFound.backHome')}</span>
            </Link>

            <Link
              href="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-vintage-red hover:bg-[#a82e18] text-white font-archivo font-bold text-xs sm:text-sm uppercase px-6 py-3.5 sm:py-4 rounded-lg transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t('notFound.exploreShop')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Quick Category Explorations */}
          <div className="w-full max-w-3xl mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-vintage-border/70">
            <p className="font-archivo font-bold text-xs sm:text-sm uppercase tracking-wider text-[#562117] mb-4 text-center">
              {t('notFound.popularCategories')}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {quickLinks.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="group relative h-24 sm:h-28 rounded-xl overflow-hidden border border-vintage-border/80 flex items-end p-2.5 sm:p-3 bg-[#e8e4da] transition-transform hover:scale-[1.03]"
                >
                  <Image
                    src={cat.img}
                    alt={cat.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
                  <span className="relative z-10 font-archivo font-bold text-xs sm:text-sm uppercase text-white leading-tight">
                    {cat.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* WhatsApp Support Box */}
          <div className="mt-8 sm:mt-10 p-4 sm:p-5 rounded-xl bg-[#f1ede6] border border-vintage-border max-w-md w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div>
              <p className="font-archivo font-bold text-xs sm:text-sm text-vintage-dark uppercase">
                {t('notFound.needHelp')}
              </p>
              <p className="font-lato text-xs text-[#524848]">
                Notre équipe est à votre disposition 7j/7.
              </p>
            </div>
            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent('Bonjour S7 LÉGENDES, je cherche un maillot introuvable sur le site.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 bg-[#25d366] hover:bg-[#20ba5a] text-white px-3.5 py-2 rounded-lg text-xs font-archivo font-bold uppercase transition-transform hover:scale-105"
            >
              <span>WhatsApp</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
