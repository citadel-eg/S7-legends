'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Shirt, FolderTree, ExternalLink } from 'lucide-react';
import { AdminSignOutButton } from '@/components/admin/sign-out-button';
import { AdminLanguageToggle } from '@/components/admin/admin-lang-toggle';
import { useAdminI18n } from '@/lib/i18n/admin-i18n';

export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { tAdmin, isArabic } = useAdminI18n();

  const navLinks = [
    { href: '/admin', label: tAdmin('dashboard'), icon: LayoutDashboard, exact: true },
    { href: '/admin/products', label: tAdmin('products'), icon: Shirt, exact: false },
    { href: '/admin/categories', label: tAdmin('categories'), icon: FolderTree, exact: false },
  ];

  return (
    <div className="h-screen w-full overflow-hidden flex bg-[#FAF8F5] text-vintage-dark">
      {/* Admin Sidebar (Static in place) */}
      <aside className="w-64 h-full bg-vintage-dark text-white flex flex-col justify-between shrink-0 border-r border-[#222222] overflow-y-auto">
        <div>
          {/* Brand */}
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0">
              <Image
                src="/assets/logo-crest.png"
                alt="S7"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="font-display text-sm font-bold tracking-wider uppercase">
                {tAdmin('brand')}
              </h2>
              <span className="text-[10px] text-[#A1A1AA] uppercase tracking-widest block">
                {tAdmin('portalSubtitle')}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                    isActive
                      ? 'bg-vintage-red text-white shadow-xs font-bold'
                      : 'text-[#D4D4D8] hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-vintage-red'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider text-[#A1A1AA] hover:bg-white/5 hover:text-white transition-colors"
          >
            <span>{tAdmin('boutique')}</span>
            <ExternalLink className={`w-3.5 h-3.5 shrink-0 ${isArabic ? 'rotate-180' : ''}`} />
          </Link>

          <AdminSignOutButton />
        </div>
      </aside>

      {/* Main Admin Content Column */}
      <div className="flex-1 h-full flex flex-col min-w-0 overflow-hidden">
        {/* Fixed Header */}
        <header className="h-16 shrink-0 border-b border-vintage-border bg-white px-6 sm:px-8 flex items-center justify-between gap-4 z-10">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#71717A] truncate">
            {tAdmin('headerTitle')}
          </div>
          
          <div className="flex items-center gap-4 shrink-0">
            <AdminLanguageToggle />

            <div className="flex items-center gap-2 border-s border-vintage-border/70 ps-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-[#52525B] font-medium hidden sm:inline">
                {tAdmin('connectedAdmin')}
              </span>
            </div>
          </div>
        </header>

        {/* Scrollable Center Content */}
        <main className="flex-1 h-full p-6 sm:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
