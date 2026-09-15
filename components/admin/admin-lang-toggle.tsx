'use client';

import React from 'react';
import { useAdminI18n } from '@/lib/i18n/admin-i18n';

export function AdminLanguageToggle() {
  const { language, setLanguage } = useAdminI18n();

  return (
    <div dir="ltr" className="inline-flex items-center p-0.5 rounded-lg bg-[#EBE7DF] border border-vintage-border text-xs font-semibold select-none">
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 rounded-md transition-all cursor-pointer font-cairo ${
          language === 'en'
            ? 'bg-white text-vintage-dark font-bold shadow-2xs'
            : 'text-[#71717A] hover:text-vintage-dark'
        }`}
      >
        EN
      </button>

      <button
        type="button"
        onClick={() => setLanguage('ar')}
        className={`px-2.5 py-1 rounded-md transition-all cursor-pointer font-cairo ${
          language === 'ar'
            ? 'bg-white text-vintage-dark font-bold shadow-2xs'
            : 'text-[#71717A] hover:text-vintage-dark'
        }`}
      >
        العربية
      </button>
    </div>
  );
}
