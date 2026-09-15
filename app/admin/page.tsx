'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Plus, Shirt, FolderTree, AlertTriangle, Eye, ArrowUpRight } from 'lucide-react';
import { fetchAdminMetrics, fetchAdminProducts } from '@/lib/queries/admin';
import { t } from '@/i18n';

export default function AdminDashboardPage() {
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: fetchAdminMetrics,
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: fetchAdminProducts,
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight uppercase text-vintage-dark">
            {t('admin.dashboard')}
          </h1>
          <p className="text-xs text-[#71717A] mt-0.5">
            {t('admin.overview')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-vintage-red hover:bg-[#A82E18] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>{t('admin.addProduct')}</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-vintage-border shadow-2xs">
          <div className="flex items-center justify-between text-[#71717A]">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {t('admin.totalProducts')}
            </span>
            <Shirt className="w-4 h-4 text-vintage-red" />
          </div>
          <div className="font-display text-3xl font-bold text-vintage-dark mt-3">
            {metricsLoading ? '...' : metrics?.totalProducts ?? 0}
          </div>
          <p className="text-[11px] text-[#71717A] mt-1">
            {metrics?.activeProducts ?? 0} {t('admin.activeProducts').toLowerCase()}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-vintage-border shadow-2xs">
          <div className="flex items-center justify-between text-[#71717A]">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {t('admin.featuredProducts')}
            </span>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <div className="font-display text-3xl font-bold text-vintage-dark mt-3">
            {metricsLoading ? '...' : metrics?.featuredProducts ?? 0}
          </div>
          <p className="text-[11px] text-[#71717A] mt-1">
            Affichés en vedette sur l’accueil
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-vintage-border shadow-2xs">
          <div className="flex items-center justify-between text-[#71717A]">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {t('admin.totalCategories')}
            </span>
            <FolderTree className="w-4 h-4 text-[#71717A]" />
          </div>
          <div className="font-display text-3xl font-bold text-vintage-dark mt-3">
            {metricsLoading ? '...' : metrics?.totalCategories ?? 0}
          </div>
          <p className="text-[11px] text-[#71717A] mt-1">
            Catégories actives dans la boutique
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-vintage-border shadow-2xs">
          <div className="flex items-center justify-between text-[#71717A]">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {t('admin.lowStock')}
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="font-display text-3xl font-bold text-amber-600 mt-3">
            {metricsLoading ? '...' : metrics?.lowStockVariants ?? 0}
          </div>
          <p className="text-[11px] text-[#71717A] mt-1">
            Tailles avec stock épuisé
          </p>
        </div>
      </div>

      {/* Recent Products Table */}
      <div className="bg-white rounded-xl border border-vintage-border overflow-hidden shadow-2xs">
        <div className="p-5 border-b border-vintage-border flex items-center justify-between">
          <h2 className="font-display text-base font-bold uppercase tracking-wide text-vintage-dark">
            Derniers Maillots
          </h2>
          <Link
            href="/admin/products"
            className="text-xs font-semibold uppercase tracking-wider text-vintage-red hover:underline inline-flex items-center gap-1"
          >
            <span>Voir tout</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {productsLoading ? (
          <div className="p-8 text-center text-xs text-[#71717A]">
            {t('common.loading')}
          </div>
        ) : products && products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] border-b border-vintage-border text-[#71717A] uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-5 py-3">Maillot</th>
                  <th className="px-5 py-3">Joueur / Année</th>
                  <th className="px-5 py-3">Prix</th>
                  <th className="px-5 py-3">Catégorie</th>
                  <th className="px-5 py-3">Tailles Dispo</th>
                  <th className="px-5 py-3">Statut</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-vintage-border">
                {products.slice(0, 5).map((p) => {
                  const availableSizes = p.variants
                    .filter((v) => v.available && v.stock > 0)
                    .map((v) => v.size)
                    .join(', ');

                  return (
                    <tr key={p.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                      <td className="px-5 py-3.5 font-semibold text-vintage-dark">
                        {p.name}
                      </td>
                      <td className="px-5 py-3.5 text-[#52525B]">
                        {p.player} ({p.year})
                      </td>
                      <td className="px-5 py-3.5 font-bold text-vintage-dark">
                        €{p.price}
                      </td>
                      <td className="px-5 py-3.5 text-[#71717A]">
                        {p.category?.name || '—'}
                      </td>
                      <td className="px-5 py-3.5 text-[#52525B]">
                        {availableSizes || <span className="text-red-500">Épuisé</span>}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            p.active
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-zinc-100 text-zinc-700'
                          }`}
                        >
                          {p.active ? t('common.active') : t('common.inactive')}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="font-bold text-vintage-red hover:underline"
                        >
                          {t('common.edit')}
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-[#71717A]">
            Aucun maillot trouvé.
          </div>
        )}
      </div>
    </div>
  );
}
