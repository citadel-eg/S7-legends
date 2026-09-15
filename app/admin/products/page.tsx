'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Trash2, Edit3, Eye, Star, Loader2, Filter, ChevronDown, Check } from 'lucide-react';
import { fetchAdminProducts, fetchAdminCategories } from '@/lib/queries/admin';
import { toggleProductActive, toggleProductFeatured, deleteProduct } from '@/lib/actions/product-actions';
import { useAdminI18n } from '@/lib/i18n/admin-i18n';

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const { tAdmin, isArabic } = useAdminI18n();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [isCatOpen, setIsCatOpen] = useState(false);
  const catDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (catDropdownRef.current && !catDropdownRef.current.contains(event.target as Node)) {
        setIsCatOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounce search query to prevent excessive backend queries
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Backend Supabase query
  const { data: products, isLoading, isFetching } = useQuery({
    queryKey: ['admin-products', debouncedSearch, selectedCat],
    queryFn: () => fetchAdminProducts({ search: debouncedSearch, categoryId: selectedCat }),
  });

  const { data: categories } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: fetchAdminCategories,
  });

  // Mutations
  const activeMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      toggleProductActive(id, active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-metrics'] });
    },
  });

  const featuredMutation = useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) =>
      toggleProductFeatured(id, featured),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-metrics'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-metrics'] });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm(tAdmin('confirmDelete'))) {
      deleteMutation.mutate(id);
    }
  };

  const selectedCatName =
    selectedCat === 'all'
      ? tAdmin('allCategories')
      : categories?.find((c) => c.id === selectedCat)?.name || tAdmin('allCategories');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight uppercase text-vintage-dark">
            {tAdmin('products')}
          </h1>
          <p className="text-xs text-[#71717A] mt-0.5">
            {tAdmin('manageProductsSubtitle')}
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-vintage-red hover:bg-[#A82E18] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg transition-colors shadow-2xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{tAdmin('addProduct')}</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-4 rounded-xl border border-vintage-border">
        {/* Search Box (takes all remaining flex width) */}
        <div className="relative flex-1">
          {isFetching ? (
            <Loader2 className={`w-4 h-4 text-vintage-red animate-spin absolute ${isArabic ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2`} />
          ) : (
            <Search className={`w-4 h-4 text-[#A1A1AA] absolute ${isArabic ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2`} />
          )}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={tAdmin('searchPlaceholder')}
            className={`w-full ${isArabic ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'} py-2.5 text-xs rounded-lg border border-vintage-border bg-[#FAF8F5]/40 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-vintage-red/20 focus:border-vintage-red/50 transition-all font-medium`}
          />
        </div>

        {/* Category Dropdown */}
        <div className="relative shrink-0" ref={catDropdownRef}>
          <button
            type="button"
            onClick={() => setIsCatOpen((prev) => !prev)}
            className={`inline-flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer shadow-2xs w-full sm:w-auto sm:min-w-55 ${
              selectedCat !== 'all'
                ? 'border-vintage-red/40 bg-vintage-red/5 text-vintage-red'
                : 'border-vintage-border bg-[#FAF8F5]/60 hover:bg-white text-vintage-dark'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <Filter className={`w-3.5 h-3.5 shrink-0 ${selectedCat !== 'all' ? 'text-vintage-red' : 'text-[#71717A]'}`} />
              <span className="truncate">{selectedCatName}</span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-[#A1A1AA] shrink-0 transition-transform duration-200 ${isCatOpen ? 'rotate-180' : ''}`} />
          </button>

          {isCatOpen && (
            <div
              className={`absolute z-30 mt-2 w-full sm:w-64 bg-white rounded-xl border border-vintage-border shadow-xl p-1.5 space-y-1 ${
                isArabic ? 'left-0' : 'right-0'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  setSelectedCat('all');
                  setIsCatOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedCat === 'all'
                    ? 'bg-vintage-red text-white'
                    : 'text-vintage-dark hover:bg-[#FAF8F5]'
                }`}
              >
                <span>{tAdmin('allCategories')}</span>
                {selectedCat === 'all' && <Check className="w-3.5 h-3.5" />}
              </button>

              <div className="h-px bg-vintage-border/70 my-1" />

              <div className="max-h-56 overflow-y-auto space-y-0.5">
                {categories?.map((cat) => {
                  const isSelected = selectedCat === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCat(cat.id);
                        setIsCatOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-vintage-red text-white font-bold'
                          : 'text-vintage-dark hover:bg-[#FAF8F5]'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-vintage-border overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className={`w-full ${isArabic ? 'text-right' : 'text-left'} text-xs`}>
            <thead className="bg-[#FAF8F5] border-b border-vintage-border text-[#71717A] uppercase font-bold tracking-wider">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">{tAdmin('colJersey')}</th>
                <th className="px-4 py-3">{tAdmin('colCategory')}</th>
                <th className="px-4 py-3">{tAdmin('colPrice')}</th>
                <th className="px-4 py-3">{tAdmin('colSizes')}</th>
                <th className="px-4 py-3 text-center">{tAdmin('featuredProducts')}</th>
                <th className="px-4 py-3 text-center">{tAdmin('colStatus')}</th>
                <th className="px-4 py-3 text-start">{tAdmin('colAction')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-vintage-border">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={`shimmer-${i}`} className="animate-pulse">
                    <td className="px-4 py-3">
                      <div className="w-12 h-14 rounded-lg bg-[#EBE7DF]" />
                    </td>
                    <td className="px-4 py-3 space-y-2">
                      <div className="w-40 h-3.5 bg-[#EBE7DF] rounded" />
                      <div className="w-24 h-2.5 bg-[#EBE7DF]/70 rounded" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-20 h-3 bg-[#EBE7DF] rounded" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-12 h-3.5 bg-[#EBE7DF] rounded" />
                    </td>
                    <td className="px-4 py-3 space-y-1.5">
                      <div className="w-28 h-3 bg-[#EBE7DF] rounded" />
                      <div className="w-16 h-2 bg-[#EBE7DF]/70 rounded" />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="w-7 h-7 rounded-lg bg-[#EBE7DF] mx-auto" />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="w-16 h-5 rounded-full bg-[#EBE7DF] mx-auto" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-start gap-1.5">
                        <div className="w-7 h-7 rounded-lg bg-[#EBE7DF]" />
                        <div className="w-7 h-7 rounded-lg bg-[#EBE7DF]" />
                        <div className="w-7 h-7 rounded-lg bg-[#EBE7DF]" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : products && products.length > 0 ? (
                products.map((p) => {
                  const primaryImg =
                    p.images.find((img) => img.is_primary)?.image_url ||
                    p.images[0]?.image_url ||
                    '/assets/logo-crest.png';

                  const totalStock = p.variants.reduce((acc, v) => acc + (v.stock || 0), 0);
                  const availableSizes = p.variants
                    .filter((v) => v.available && v.stock > 0)
                    .map((v) => `${v.size}(${v.stock})`)
                    .join(' · ');

                  return (
                    <tr key={p.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                      {/* Image Thumbnail */}
                      <td className="px-4 py-3">
                        <div className="relative w-12 h-14 rounded overflow-hidden border border-vintage-border bg-[#EBE7DF]">
                          <Image
                            src={primaryImg}
                            alt={p.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </td>

                      {/* Name & Player */}
                      <td className="px-4 py-3">
                        <div className="font-semibold text-vintage-dark">{p.name}</div>
                        <div className="text-[11px] text-[#71717A]">
                          {p.player} · {p.team} ({p.year})
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3 text-[#52525B]">
                        {p.category?.name || '—'}
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3 font-bold text-vintage-dark">
                        €{p.price}
                      </td>

                      {/* Sizes & Stock */}
                      <td className="px-4 py-3">
                        <div className="text-[11px] text-[#52525B]">
                          {availableSizes || <span className="text-red-500 font-semibold">{tAdmin('statusSoldOut')}</span>}
                        </div>
                        <div className="text-[10px] text-[#A1A1AA]">
                          {tAdmin('labelStock')}: {totalStock}
                        </div>
                      </td>

                      {/* Featured toggle */}
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          disabled={featuredMutation.isPending && featuredMutation.variables?.id === p.id}
                          onClick={() =>
                            featuredMutation.mutate({ id: p.id, featured: !p.featured })
                          }
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer inline-flex items-center justify-center ${
                            p.featured
                              ? 'border-amber-300 bg-amber-50 text-amber-500 hover:bg-amber-100 shadow-2xs'
                              : 'border-vintage-border bg-white text-zinc-300 hover:text-zinc-500 hover:border-zinc-400'
                          }`}
                          title={p.featured ? tAdmin('featuredProducts') : tAdmin('labelFeatured')}
                        >
                          {featuredMutation.isPending && featuredMutation.variables?.id === p.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                          ) : (
                            <Star className={`w-4 h-4 ${p.featured ? 'fill-current' : ''}`} />
                          )}
                        </button>
                      </td>

                      {/* Active toggle */}
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          disabled={activeMutation.isPending && activeMutation.variables?.id === p.id}
                          onClick={() =>
                            activeMutation.mutate({ id: p.id, active: !p.active })
                          }
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                            p.active
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-200'
                          }`}
                        >
                          {activeMutation.isPending && activeMutation.variables?.id === p.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <span className={`w-1.5 h-1.5 rounded-full ${p.active ? 'bg-emerald-500' : 'bg-zinc-400'}`} />
                          )}
                          <span>{p.active ? tAdmin('statusActive') : tAdmin('statusInactive')}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-start gap-1.5">
                          <Link
                            href={`/product/${p.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg border border-vintage-border bg-white text-[#71717A] hover:text-vintage-dark hover:border-[#71717A] hover:bg-[#FAF8F5] transition-colors shadow-2xs inline-flex items-center justify-center cursor-pointer"
                            title={tAdmin('actionView')}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>

                          <Link
                            href={`/admin/products/${p.id}/edit`}
                            className="p-1.5 rounded-lg border border-vintage-red/30 bg-vintage-red/5 text-vintage-red hover:bg-vintage-red hover:text-white hover:border-vintage-red transition-colors shadow-2xs inline-flex items-center justify-center cursor-pointer"
                            title={tAdmin('actionEdit')}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            type="button"
                            disabled={deleteMutation.isPending && deleteMutation.variables === p.id}
                            onClick={() => handleDelete(p.id)}
                            className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors shadow-2xs disabled:opacity-50 cursor-pointer inline-flex items-center justify-center"
                            title={tAdmin('actionDelete')}
                          >
                            {deleteMutation.isPending && deleteMutation.variables === p.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-xs text-[#71717A]">
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
