import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, ShieldCheck, MessageCircle, Truck, Sparkles, Users, CheckCircle2 } from 'lucide-react';
import { VintageBadge } from '@/components/ui/vintage-badge';
import { SocialSection } from '@/components/home/social-section';
import { getActiveProducts } from '@/lib/queries/storefront';
import { ProductCard, WhatsAppIcon } from '@/components/product/product-card';

export const metadata: Metadata = {
  title: 'À Propos — Histoire & Communauté | S7 LÉGENDES',
  description:
    'Découvrez l’histoire de S7 LÉGENDES, notre passion pour les maillots rares de football et notre communauté de plus de 9 750 passionnés sur Facebook, Instagram, TikTok et WhatsApp.',
};

export default async function AboutPage() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '33658898860';
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');

  const featured = await getActiveProducts({ featuredOnly: true, limit: 4 });
  const products = featured.length >= 4 ? featured : await getActiveProducts({ limit: 4 });

  const pillars = [
    {
      icon: ShieldCheck,
      title: 'Authenticité & Expertise',
      description:
        'Chaque pièce vintage est inspectée avec minutie : étiquettes, textures, badges de compétition et flocages officiels.',
    },
    {
      icon: MessageCircle,
      title: 'Contact Humain par WhatsApp',
      description:
        'Pas de bot impersonnel. Vous échangez directement avec un connaisseur passionné pour trouver le maillot parfait.',
    },
    {
      icon: Truck,
      title: 'Envoi Soigné & Suivi',
      description:
        'Expédition rapide depuis la France, colis protégés et numéro de suivi transmis immédiatement après préparation.',
    },
    {
      icon: Sparkles,
      title: 'Pièces Rares & Introuvables',
      description:
        'Des finales de Ligue des Champions aux Coupes du Monde légendaires, nous dénichons des maillots que l’on ne trouve nulle part ailleurs.',
    },
  ];

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-8 sm:py-12 space-y-16 lg:space-y-24">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#71717A]">
        <Link href="/" className="hover:text-vintage-red transition-colors">
          Accueil
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#A1A1AA]" />
        <span className="text-vintage-dark font-bold">À propos</span>
      </nav>

      {/* Hero Section */}
      <section className="space-y-6">
        <div className="space-y-3">
          <VintageBadge text="L'HISTOIRE & LA PASSION" initialRotate={-2} />
          <h1
            className="font-archivo font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl uppercase text-vintage-dark tracking-tight sm:tracking-[-2px] leading-tight pt-2 wrap-break-word"
            style={{ fontVariationSettings: '"wdth" 100' }}
          >
            L&apos;ÂME DU FOOTBALL VINTAGE.
          </h1>
        </div>
        <p className="font-lato text-base sm:text-xl lg:text-2xl text-[#524848] max-w-3xl leading-relaxed">
          Chez <strong className="text-vintage-dark font-bold">S7 LÉGENDES</strong>, chaque maillot est plus qu&apos;un tissu : c&apos;est une archive vivante, un souvenir d&apos;émotion pure et l&apos;hommage à ceux qui ont marqué l&apos;histoire du ballon rond.
        </p>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-y border-vintage-border py-6">
          <div className="space-y-1">
            <span className="font-archivo font-black text-2xl sm:text-3xl lg:text-4xl text-vintage-dark">
              9 750+
            </span>
            <p className="text-xs uppercase tracking-wider font-semibold text-[#71717A]">
              Passionnés sur Facebook
            </p>
          </div>
          <div className="space-y-1">
            <span className="font-archivo font-black text-2xl sm:text-3xl lg:text-4xl text-vintage-red">
              100%
            </span>
            <p className="text-xs uppercase tracking-wider font-semibold text-[#71717A]">
              Sélection Vintage & Rétro
            </p>
          </div>
          <div className="space-y-1">
            <span className="font-archivo font-black text-2xl sm:text-3xl lg:text-4xl text-vintage-dark">
              Paris → Monde
            </span>
            <p className="text-xs uppercase tracking-wider font-semibold text-[#71717A]">
              Expédition soignée & suivie
            </p>
          </div>
          <div className="space-y-1">
            <span className="font-archivo font-black text-2xl sm:text-3xl lg:text-4xl text-vintage-dark">
              Direct WA
            </span>
            <p className="text-xs uppercase tracking-wider font-semibold text-[#71717A]">
              Service client personnalisé
            </p>
          </div>
        </div>
      </section>

      {/* Brand Story & Visual Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-vintage-red">
            <Users className="w-4 h-4" />
            <span>Notre Mission & Origine</span>
          </div>

          <h2
            className="font-archivo font-black text-2xl sm:text-3xl md:text-4xl lg:text-[40px] xl:text-5xl uppercase text-vintage-dark tracking-tight leading-tight wrap-break-word"
            style={{ fontVariationSettings: '"wdth" 95' }}
          >
            DE LA PASSION D&apos;ENFANCE AU VESTIAIRE DES LÉGENDES.
          </h2>

          <div className="font-lato text-sm sm:text-base lg:text-lg text-[#524848] space-y-4 leading-relaxed">
            <p>
              Fondée par des amoureux inconditionnels du football des années 90 et 2000, S7 LÉGENDES est née d&apos;un constat simple : la nostalgie des maillots d&apos;anthologie mérite d&apos;être célébrée avec authenticité et exigence.
            </p>
            <p>
              De la frappe de Zidane en 1998 aux chevauchées de Kaká en 2007, en passant par les prouesses de Messi et l&apos;impact foudroyant de Ronaldo R9, nous traquons les pièces rares, les éditions de Coupe du Monde et les tenues de Ligue des Champions qui font vibrer les supporters de toutes générations.
            </p>
            <p>
              Nous croyons au football authentique, à l&apos;odeur des maillots d&apos;époque et au plaisir d&apos;arborer une pièce vintage unique lors d&apos;un match entre amis ou dans son quotidien streetwear.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-vintage-border text-xs font-bold text-vintage-dark uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-vintage-red" />
              <span>Pièces rares sélectionnées à la main</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-vintage-border text-xs font-bold text-vintage-dark uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-vintage-red" />
              <span>Réponse ultra-rapide par WhatsApp</span>
            </div>
          </div>
        </div>

        {/* Editorial Visual Card */}
        <div className="lg:col-span-5 relative w-full">
          <div className="relative aspect-4/5 min-h-95 sm:min-h-110 lg:min-h-120 w-full rounded-2xl overflow-hidden border-2 border-vintage-dark shadow-xl bg-[#E8E4DA]">
            <Image
              src="/assets/editorial-street-figma.png"
              alt="S7 Légendes Maillot Vintage Football"
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

            <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
              <span className="inline-block bg-vintage-red text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-xs shadow-xs">
                ARCHIVE S7
              </span>
              <p className="font-archivo font-black text-xl sm:text-2xl uppercase tracking-wide drop-shadow-xs">
                L&apos;ÉLÉGANCE RÉTRO AU QUOTIDIEN
              </p>
              <p className="font-lato text-xs sm:text-sm text-white/90 font-medium">
                Porter un maillot de légende, c&apos;est porter un pan d&apos;histoire.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our 4 Pillars */}
      <section className="space-y-10">
        <div className=" space-y-3">
          <VintageBadge text="ENGAGEMENT & CONFIANCE" initialRotate={-1} />
          <h2
            className="font-archivo font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase text-vintage-dark tracking-tight wrap-break-word"
            style={{ fontVariationSettings: '"wdth" 95' }}
          >
            NOS PILIERS D&apos;EXCELLENCE.
          </h2>
          <p className="font-lato text-sm sm:text-base text-[#524848]">
            Pourquoi plus de 9 700 fans de football nous font confiance pour leurs pièces de collection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className=" border-2 border-vintage-border/80 rounded-2xl p-6 sm:p-7 space-y-4 hover:border-vintage-red hover:-translate-y-2 hover:shadow-md transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl border border-vintage-red  flex items-center justify-center text-vintage-red shadow-xs group-hover:scale-105 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-archivo font-black text-lg uppercase text-vintage-dark">
                  {pillar.title}
                </h3>
                <p className="font-lato text-sm text-[#524848] leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Iconic Kits Hall of Fame Showcase */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <VintageBadge text="COLLECTION CULTE" initialRotate={1} />
            <h2
              className="font-archivo font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase text-vintage-dark tracking-tight wrap-break-word"
              style={{ fontVariationSettings: '"wdth" 95' }}
            >
              LES MAILLOTS QUI FONT NOTRE FIERTÉ.
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-vintage-red hover:text-vintage-dark transition-colors"
          >
            <span>Voir toute la boutique</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* WhatsApp Concierge Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-vintage-dark text-white p-6 sm:p-10 lg:p-14 border border-[#333]">
        <div className="relative z-10 space-y-6">
          <span className="inline-block bg-vintage-red text-white text-[10px] sm:text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-sm">
            SERVICE DE RECHERCHE PERSONNALISÉ
          </span>

          <h2
            className="font-archivo font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase tracking-tight leading-tight wrap-break-word"
            style={{ fontVariationSettings: '"wdth" 95' }}
          >
            VOUS CHERCHEZ UN MAILLOT EN PARTICULIER ?
          </h2>

          <p className="font-lato max-w-4xl text-base sm:text-lg text-white/80 leading-relaxed">
            Un joueur d&apos;enfance ? Une saison spécifique ? Envoyez-nous directement une photo ou le nom du maillot sur WhatsApp. Nous activons notre réseau de collectionneurs pour le dénicher à votre taille.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                'Bonjour S7 Légendes, je cherche un maillot en particulier...'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-vintage-red hover:bg-[#a82e18] text-white text-xs sm:text-sm font-bold h-12 px-6 rounded-full inline-flex items-center gap-2.5 shadow-lg transition-all active:scale-95"
            >
              <WhatsAppIcon className="w-4 h-4 shrink-0" />
              <span className="uppercase tracking-wider">Discuter sur WhatsApp</span>
            </a>

            <Link
              href="/shop"
              className="border border-white/40 hover:bg-white/10 text-white text-xs sm:text-sm font-bold h-12 px-6 rounded-full inline-flex items-center gap-2 transition-colors uppercase tracking-wider"
            >
              <span>Explorer la boutique</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Global Social Section Component */}
      <SocialSection />
    </div>
  );
}
