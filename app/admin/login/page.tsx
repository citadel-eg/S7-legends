'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';
import { signInAdmin, verifyAdminSession } from '@/lib/actions/auth-actions';
import { t } from '@/i18n';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already authenticated, forward directly to tables
  useEffect(() => {
    verifyAdminSession().then(({ isAdmin }) => {
      if (isAdmin) {
        router.replace('/admin/products');
      }
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signInAdmin({ email, password });
      if (res.success) {
        router.push('/admin/products');
        router.refresh();
      } else {
        setError(res.error || 'Identifiants invalides');
      }
    } catch {
      setError('Une erreur est survenue lors de la connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-vintage-cream">
      <div className="w-full max-w-md bg-white rounded-2xl border border-vintage-border p-8 shadow-sm space-y-6">
        {/* Brand Crest */}
        <div className="text-center space-y-3">
          <div className="relative w-16 h-16 mx-auto rounded-full overflow-hidden border border-[#D5CEBF] shadow-xs">
            <Image
              src="/assets/logo-crest.png"
              alt="S7 Légendes"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-wider uppercase text-vintage-dark">
              {t('admin.loginTitle')}
            </h1>
            <p className="text-xs text-[#71717A] mt-1">
              {t('admin.loginSubtitle')}
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#52525B]">
              {t('admin.email')}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#A1A1AA] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@s7legendes.fr"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-vintage-border text-sm text-vintage-dark focus:outline-hidden focus:ring-2 focus:ring-vintage-red/20"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#52525B]">
              {t('admin.password')}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#A1A1AA] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-vintage-border text-sm text-vintage-dark focus:outline-hidden focus:ring-2 focus:ring-vintage-red/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-vintage-dark hover:bg-vintage-red text-white font-display text-sm font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
          >
            <span>{loading ? t('common.loading') : t('admin.signIn')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-vintage-border text-center">
          <span className="text-[11px] text-[#A1A1AA] inline-flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Admin Authorization: public.is_admin()
          </span>
        </div>
      </div>
    </div>
  );
}
