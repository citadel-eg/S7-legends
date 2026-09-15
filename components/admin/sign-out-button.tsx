'use client';

import React, { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { signOutAdmin } from '@/lib/actions/auth-actions';
import { t } from '@/i18n';

export function AdminSignOutButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSignOut = () => {
    startTransition(async () => {
      await signOutAdmin();
      router.push('/admin/login');
      router.refresh();
    });
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isPending}
      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider text-red-400 hover:bg-red-500/10 transition-colors"
    >
      <LogOut className="w-4 h-4" />
      <span>{isPending ? t('common.loading') : t('admin.signOut')}</span>
    </button>
  );
}
