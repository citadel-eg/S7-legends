import React from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyAdminSession } from '@/lib/actions/auth-actions';
import { AdminLanguageProvider } from '@/lib/i18n/admin-i18n';
import { AdminLayoutShell } from '@/components/admin/admin-layout-shell';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';

  // If on login page, render children directly with admin i18n
  if (pathname.includes('/admin/login')) {
    return (
      <AdminLanguageProvider>
        <div className="admin-root font-cairo min-h-screen bg-vintage-cream">{children}</div>
      </AdminLanguageProvider>
    );
  }

  // Session verification
  const { isAdmin } = await verifyAdminSession();
  if (!isAdmin) {
    redirect('/admin/login');
  }

  return (
    <AdminLanguageProvider>
      <div className="admin-root font-cairo min-h-screen">
        <AdminLayoutShell>{children}</AdminLayoutShell>
      </div>
    </AdminLanguageProvider>
  );
}
