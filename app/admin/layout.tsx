import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { LayoutDashboard, Shirt, FolderTree, ExternalLink } from 'lucide-react';
import { verifyAdminSession } from '@/lib/actions/auth-actions';
import { AdminSignOutButton } from '@/components/admin/sign-out-button';
import { t } from '@/i18n';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';

  // If on login page, render children directly without dashboard sidebar
  if (pathname.includes('/admin/login')) {
    return <div className="min-h-screen bg-vintage-cream">{children}</div>;
  }

  // Session verification
  const { isAdmin } = await verifyAdminSession();
  if (!isAdmin) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen flex bg-[#FAF8F5] text-vintage-dark">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-vintage-dark text-white flex flex-col justify-between shrink-0 border-r border-[#222222]">
        <div>
          {/* Brand */}
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <Image
                src="/assets/logo-crest.png"
                alt="S7"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="font-display text-sm font-bold tracking-wider uppercase">
                S7 LÉGENDES
              </h2>
              <span className="text-[10px] text-[#A1A1AA] uppercase tracking-widest">
                ADMIN PORTAL
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-[#D4D4D8] hover:bg-white/10 hover:text-white transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-vintage-red" />
              <span>{t('admin.dashboard')}</span>
            </Link>

            <Link
              href="/admin/products"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-[#D4D4D8] hover:bg-white/10 hover:text-white transition-colors"
            >
              <Shirt className="w-4 h-4 text-vintage-red" />
              <span>{t('admin.products')}</span>
            </Link>

            <Link
              href="/admin/categories"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-[#D4D4D8] hover:bg-white/10 hover:text-white transition-colors"
            >
              <FolderTree className="w-4 h-4 text-vintage-red" />
              <span>{t('admin.categories')}</span>
            </Link>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider text-[#A1A1AA] hover:bg-white/5 hover:text-white transition-colors"
          >
            <span>Boutique</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <AdminSignOutButton />
        </div>
      </aside>

      {/* Main Admin Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-vintage-border bg-white px-8 flex items-center justify-between">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#71717A]">
            S7 Football Jersey Management
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-[#52525B] font-medium">Connecté Admin</span>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
