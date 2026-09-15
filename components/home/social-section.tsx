import React from 'react';
import Image from 'next/image';
import { VintageBadge } from '@/components/ui/vintage-badge';
import { t } from '@/i18n';

export function SocialSection() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '33658898860';
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');

  const channels = [
    {
      name: 'WHATS APP',
      handle: '@S7 LÉGENDES',
      href: `https://wa.me/${cleanPhone}`,
      icon: '/assets/icon-whatsapp.svg',
    },
    {
      name: 'INSTAGRAM',
      handle: '@legendess7',
      href: 'https://www.instagram.com/legendess7?igsi=aGJmZHpiaWhqZ2Vk&utm_source=qr',
      icon: '/assets/icon-instagram.svg',
    },
    {
      name: 'TIKTOK',
      handle: '@s7legendes',
      href: 'https://www.tiktok.com/@s7legendes?_r=1&_t=ZN-99OoV79ESNK',
      icon: '/assets/icon-tiktok.svg',
    },
    {
      name: 'FACEBOOK',
      handle: '@S7 Légendes',
      href: 'https://www.facebook.com/share/19QgcUkwfe/',
      icon: '/assets/icon-facebook.svg',
    },
  ];

  return (
    <section id="contact" className="py-10 sm:py-14 lg:py-18">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <VintageBadge text={t('home.socialBadge')} initialRotate={0} />
          <h2 className="font-archivo font-black text-2xl sm:text-4xl md:text-5xl lg:text-[54px] uppercase text-black tracking-tight sm:tracking-[-1.5px] pt-3 sm:pt-4 leading-tight" style={{ fontVariationSettings: '"wdth" 100' }}>
            {t('home.socialTitle')}
          </h2>
        </div>
        <p className="font-lato font-medium text-xs sm:text-sm md:text-base lg:text-lg text-[#524848] capitalize md:whitespace-nowrap shrink-0 md:text-right">
          {t('home.socialSubtitle')}
        </p>
      </div>

      {/* 4 Social Cards (2 in row for middle screens, 4 on xl desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 pt-6 sm:pt-8">
        {channels.map((ch) => (
          <a
            key={ch.name}
            href={ch.href}
            target="_blank"
            rel="noopener noreferrer"
            className="border-2 border-vintage-dark rounded-2xl p-6 sm:p-8 flex flex-col gap-4 hover:bg-[#f1ede6] transition-colors group"
          >
            <div className="flex flex-col">
              {/* Icon */}
              <div className="relative w-10 h-10">
                <Image
                  src={ch.icon}
                  alt={ch.name}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Title */}
              <h3 className="font-archivo font-black text-[24px] uppercase text-vintage-dark leading-8 pt-6" style={{ fontVariationSettings: '"wdth" 92' }}>
                {ch.name}
              </h3>

              {/* Handle */}
              <p className="font-lato font-bold text-[14px] tracking-[1px] uppercase text-[#524848] pt-1.5">
                {ch.handle}
              </p>
            </div>

            {/* Follow link */}
            <div className="flex items-center gap-3">
              <span className="font-lato font-bold text-[16px] tracking-[1.54px] uppercase text-vintage-dark group-hover:text-vintage-red transition-colors">
                {t('home.followUs')}
              </span>
              <span className="font-lato font-bold text-[16px] text-vintage-dark group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
