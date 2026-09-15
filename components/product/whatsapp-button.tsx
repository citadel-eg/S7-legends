'use client';

import React from 'react';
import { getWhatsAppOrderUrl, WhatsAppOrderParams } from '@/lib/whatsapp';
import { t } from '@/i18n';

interface WhatsAppButtonProps {
  orderParams: WhatsAppOrderParams;
  disabled?: boolean;
}

function WhatsAppWhiteIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10.3948 11.7138C7.25129 11.7131 4.69326 9.06832 4.69257 5.81891C4.69396 4.99535 5.34169 4.32495 6.13753 4.32495C6.21928 4.32495 6.30033 4.33218 6.37719 4.34663C6.54768 4.37552 6.70907 4.43548 6.8586 4.52506C6.88026 4.53806 6.89494 4.55973 6.89843 4.58502L7.23032 6.7501C7.23452 6.77538 7.22683 6.80066 7.21076 6.81945C7.02699 7.02967 6.79293 7.18066 6.533 7.25651L6.40723 7.29334L6.45474 7.41905C6.88375 8.54674 7.75575 9.44903 8.84715 9.89259L8.96873 9.94171L9.00437 9.81168C9.07773 9.54222 9.22377 9.30021 9.4271 9.11094C9.44177 9.09721 9.46134 9.08927 9.4816 9.08927C9.48579 9.08927 9.49068 9.08926 9.49487 9.09071L11.5882 9.43385C11.6134 9.43819 11.6337 9.45264 11.6469 9.47504C11.7329 9.62963 11.7909 9.79723 11.8195 9.97278C11.8328 10.0515 11.8398 10.1339 11.8398 10.2206C11.8398 11.0434 11.1914 11.7131 10.3948 11.7145V11.7138Z"
        fill="white"
      />
      <path
        d="M15.9693 7.28626C15.7995 5.3054 14.9219 3.46831 13.4979 2.11378C12.0655 0.750588 10.2062 0 8.26237 0C3.99598 0 0.52474 3.58895 0.52474 8C0.52474 9.48022 0.919507 10.9229 1.66714 12.1792L0 15.9957L5.33962 15.4076C6.26822 15.8006 7.25132 16 8.26237 16C8.52858 16 8.80107 15.9856 9.07427 15.9567C9.31533 15.9299 9.5585 15.8909 9.79816 15.8411C13.3714 15.0948 15.9797 11.8158 16 8.04262V8C16 7.75944 15.9895 7.5196 16.9686 7.28698L15.9693 7.28626ZM5.54434 13.7323L2.59016 14.0574L3.47264 12.0368L3.29656 11.7919C3.28328 11.7739 3.2707 11.7558 3.25603 11.7356C2.49023 10.6426 2.08567 9.35091 2.08567 7.99928C2.08567 4.47751 4.85681 1.61314 8.26237 1.61314C11.4534 1.61314 14.1575 4.18711 14.4181 7.47264C14.4321 7.64891 14.4391 7.8259 14.4391 8C14.4391 8.04985 14.4384 8.09897 14.437 8.15098C14.3713 11.097 12.3806 13.5987 9.59623 14.2359C9.38382 14.285 9.16582 14.3218 8.94852 14.3464C8.72283 14.3731 8.49155 14.3861 8.26167 14.3861C7.44347 14.3861 6.64832 14.2221 5.89649 13.8985C5.81335 13.8638 5.7316 13.827 5.65474 13.7887L5.54296 13.7331L5.54434 13.7323Z"
        fill="white"
      />
    </svg>
  );
}

export function WhatsAppButton({ orderParams, disabled }: WhatsAppButtonProps) {
  const isReady = !disabled && Boolean(orderParams.size);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!orderParams.size) {
      e.preventDefault();
      alert(t('products.pleaseSelectSize'));
      return;
    }

    if (typeof window !== 'undefined') {
      const fullUrl = getWhatsAppOrderUrl({
        ...orderParams,
        productUrl: window.location.href,
      });
      window.open(fullUrl, '_blank', 'noopener,noreferrer');
      e.preventDefault();
    }
  };

  const url = isReady
    ? getWhatsAppOrderUrl(orderParams)
    : '#';

  return (
    <div className="w-full flex flex-col items-center gap-3">
      {/* Button matching Figma node 42:89 (active/hover) and 26:1901 */}
      <a
        href={url}
        onClick={handleClick}
        target={isReady ? '_blank' : undefined}
        rel={isReady ? 'noopener noreferrer' : undefined}
        className={`w-full h-14 rounded-lg flex items-center justify-center gap-2 px-3 py-2 transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.99] ${
          isReady
            ? 'bg-vintage-red hover:bg-[#a82e18] text-white shadow-md'
            : 'bg-[#747372] hover:bg-vintage-red text-white'
        }`}
      >
        <WhatsAppWhiteIcon className="w-4 h-4 shrink-0" />
        <span
          className="font-archivo font-bold text-[14px] text-white uppercase whitespace-nowrap tracking-wide"
          style={{ fontVariationSettings: '"wdth" 100' }}
        >
          Demandez des informations sur le produit
        </span>
      </a>

      {/* Helper text matching Figma */}
      <p className="font-lato text-[14px] text-[#562117] text-center leading-4.5">
        Envoyez-nous votre taille et nous confirmerons sa disponibilité avant le paiement.
      </p>
    </div>
  );
}
