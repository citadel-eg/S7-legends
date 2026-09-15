'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Plus, Shirt, FolderTree, AlertTriangle, ArrowUpRight, ArrowUpLeft, Edit3, Star } from 'lucide-react';
import { fetchAdminMetrics, fetchAdminProducts } from '@/lib/queries/admin';
import { useAdminI18n } from '@/lib/i18n/admin-i18n';

export default function AdminDashboardPage() {
  const { tAdmin, isArabic } = useAdminI18n();

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: () => fetchAdminMetrics(),
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => fetchAdminProducts(),
  });

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight uppercase text-vintage-dark">
            {tAdmin('dashboard')}
          </h1>
          <p className="text-xs text-[#71717A] mt-0.5">
            {tAdmin('overview')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-vintage-red hover:bg-[#A82E18] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{tAdmin('addProduct')}</span>
          </Link>
        </div>
      </div>

      {/* Redesigned Metrics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Jerseys Card */}
        <Link
          href="/admin/products"
          className="group bg-white p-5 rounded-2xl border border-vintage-border shadow-2xs hover:shadow-md hover:border-vintage-red/40 transition-all duration-200 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717A] block">
                {tAdmin('totalProducts')}
              </span>
              <div className="text-3xl font-extrabold text-vintage-dark mt-2 tracking-tight">
                {metricsLoading ? '—' : metrics?.totalProducts ?? 0}
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-vintage-red/10 border border-vintage-red/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Shirt className="w-5 h-5 text-vintage-red" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-vintage-border/50">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{metrics?.activeProducts ?? 0} {tAdmin('activeProducts')}</span>
            </span>
          </div>
        </Link>

        {/* Featured Jerseys Card */}
        <Link
          href="/admin/products"
          className="group bg-white p-5 rounded-2xl border border-vintage-border shadow-2xs hover:shadow-md hover:border-amber-400/50 transition-all duration-200 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717A] block">
                {tAdmin('featuredProducts')}
              </span>
              <div className="text-3xl font-extrabold text-vintage-dark mt-2 tracking-tight">
                {metricsLoading ? '—' : metrics?.featuredProducts ?? 0}
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-vintage-border/50">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>{tAdmin('featuredDesc')}</span>
            </span>
          </div>
        </Link>

        {/* Total Categories Card */}
        <Link
          href="/admin/categories"
          className="group bg-white p-5 rounded-2xl border border-vintage-border shadow-2xs hover:shadow-md hover:border-blue-400/50 transition-all duration-200 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717A] block">
                {tAdmin('totalCategories')}
              </span>
              <div className="text-3xl font-extrabold text-vintage-dark mt-2 tracking-tight">
                {metricsLoading ? '—' : metrics?.totalCategories ?? 0}
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <FolderTree className="w-5 h-5 text-blue-600" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-vintage-border/50">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>{tAdmin('categoriesDesc')}</span>
            </span>
          </div>
        </Link>

        {/* Out of Stock Card */}
        <div className="bg-white p-5 rounded-2xl border border-vintage-border shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717A] block">
                {tAdmin('lowStock')}
              </span>
              <div className={`text-3xl font-extrabold mt-2 tracking-tight ${
                (metrics?.lowStockVariants ?? 0) > 0 ? 'text-rose-600' : 'text-emerald-600'
              }`}>
                {metricsLoading ? '—' : metrics?.lowStockVariants ?? 0}
              </div>
            </div>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
              (metrics?.lowStockVariants ?? 0) > 0 ? 'bg-rose-50 border-rose-200/60' : 'bg-emerald-50 border-emerald-200/60'
            }`}>
              <AlertTriangle className={`w-5 h-5 ${(metrics?.lowStockVariants ?? 0) > 0 ? 'text-rose-500' : 'text-emerald-500'}`} />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-vintage-border/50">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
              (metrics?.lowStockVariants ?? 0) > 0
                ? 'bg-rose-50 text-rose-800 border-rose-200/60'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200/60'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${(metrics?.lowStockVariants ?? 0) > 0 ? 'bg-rose-500' : 'bg-emerald-500'}`} />
              <span>{tAdmin('lowStockDesc')}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Recent Products Table */}
      <div className="bg-white rounded-xl border border-vintage-border overflow-hidden shadow-2xs">
        <div className="p-5 border-b border-vintage-border flex items-center justify-between">
          <h2 className="font-display text-base font-bold uppercase tracking-wide text-vintage-dark">
            {tAdmin('recentJerseys')}
          </h2>
          <Link
            href="/admin/products"
            className="text-xs font-semibold uppercase tracking-wider text-vintage-red hover:underline inline-flex items-center gap-1"
          >
            <span>{tAdmin('viewAll')}</span>
            {isArabic ? <ArrowUpLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className={`w-full ${isArabic ? 'text-right' : 'text-left'} text-xs`}>
            <thead className="bg-[#FAF8F5] border-b border-vintage-border text-[#71717A] uppercase font-bold tracking-wider">
              <tr>
                <th className="px-5 py-3">{tAdmin('colJersey')}</th>
                <th className="px-5 py-3">{tAdmin('colPlayerYear')}</th>
                <th className="px-5 py-3">{tAdmin('colPrice')}</th>
                <th className="px-5 py-3">{tAdmin('colCategory')}</th>
                <th className="px-5 py-3">{tAdmin('colSizes')}</th>
                <th className="px-5 py-3">{tAdmin('colStatus')}</th>
                <th className="px-5 py-3 text-start">{tAdmin('colAction')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-vintage-border">
              {productsLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={`shimmer-recent-${i}`} className="animate-pulse">
                    <td className="px-5 py-4">
                      <div className="w-36 h-3.5 bg-[#EBE7DF] rounded" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="w-24 h-3 bg-[#EBE7DF]/70 rounded" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="w-12 h-3.5 bg-[#EBE7DF] rounded" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="w-20 h-3 bg-[#EBE7DF] rounded" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="w-24 h-3 bg-[#EBE7DF] rounded" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="w-16 h-5 rounded-full bg-[#EBE7DF]" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="w-7 h-7 rounded-lg bg-[#EBE7DF]" />
                    </td>
                  </tr>
                ))
              ) : products && products.length > 0 ? (
                products.slice(0, 5).map((p) => {
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
                        {availableSizes || <span className="text-red-500 font-semibold">{tAdmin('statusSoldOut')}</span>}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            p.active
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-zinc-100 text-zinc-700'
                          }`}
                        >
                          {p.active ? tAdmin('statusActive') : tAdmin('statusInactive')}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-start gap-1.5">
                          <Link
                            href={`/admin/products/${p.id}/edit`}
                            className="p-1.5 rounded-lg border border-vintage-red/30 bg-vintage-red/5 text-vintage-red hover:bg-vintage-red hover:text-white hover:border-vintage-red transition-colors shadow-2xs inline-flex items-center justify-center cursor-pointer"
                            title={tAdmin('actionEdit')}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-xs text-[#71717A]">
                    {tAdmin('noJerseysFound')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
