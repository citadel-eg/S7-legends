'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Trash2, Edit3, ExternalLink, Star } from 'lucide-react';
import { fetchAdminProducts, fetchAdminCategories } from '@/lib/queries/admin';
import { toggleProductActive, toggleProductFeatured, deleteProduct } from '@/lib/actions/product-actions';
import { t } from '@/i18n';

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: fetchAdminProducts,
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

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le maillot "${name}" ? Cette action est irréversible.`)) {
      deleteMutation.mutate(id);
    }
  };

  // Filtering
  const filteredProducts = (products || []).filter((p) => {
    const matchesCat = selectedCat === 'all' || p.category_id === selectedCat;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.player.toLowerCase().includes(q) ||
      p.team.toLowerCase().includes(q) ||
      String(p.year).includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight uppercase text-vintage-dark">
            {t('admin.products')}
          </h1>
          <p className="text-xs text-[#71717A] mt-0.5">
            Gérez votre catalogue de maillots, prix, tailles et statuts
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-vintage-red hover:bg-[#A82E18] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg transition-colors shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          <span>{t('admin.addProduct')}</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-vintage-border">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher joueur, équipe, année..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-vintage-border focus:outline-hidden focus:ring-2 focus:ring-vintage-red/20"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="text-xs border border-vintage-border rounded-lg px-3 py-2 bg-white text-vintage-dark font-medium"
          >
            <option value="all">Toutes les catégories</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-vintage-border overflow-hidden shadow-2xs">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-[#71717A]">
            {t('common.loading')}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] border-b border-vintage-border text-[#71717A] uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">Maillot / Joueur</th>
                  <th className="px-4 py-3">Catégorie</th>
                  <th className="px-4 py-3">Prix</th>
                  <th className="px-4 py-3">Stock Tailles</th>
                  <th className="px-4 py-3 text-center">En Vedette</th>
                  <th className="px-4 py-3 text-center">Actif (Public)</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-vintage-border">
                {filteredProducts.map((p) => {
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
                          {availableSizes || <span className="text-red-500 font-semibold">Rupture totale</span>}
                        </div>
                        <div className="text-[10px] text-[#A1A1AA]">
                          Total stock: {totalStock}
                        </div>
                      </td>

                      {/* Featured toggle */}
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            featuredMutation.mutate({ id: p.id, featured: !p.featured })
                          }
                          className={`p-1.5 rounded-full transition-colors ${
                            p.featured
                              ? 'text-amber-500 hover:text-amber-600 bg-amber-50'
                              : 'text-zinc-300 hover:text-zinc-400'
                          }`}
                          title={p.featured ? 'Retirer des vedettes' : 'Mettre en vedette'}
                        >
                          <Star className={`w-4 h-4 ${p.featured ? 'fill-current' : ''}`} />
                        </button>
                      </td>

                      {/* Active toggle */}
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            activeMutation.mutate({ id: p.id, active: !p.active })
                          }
                          className={`inline-block px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${
                            p.active
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                          }`}
                        >
                          {p.active ? t('common.active') : t('common.inactive')}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right space-x-2">
                        <Link
                          href={`/product/${p.slug}`}
                          target="_blank"
                          className="inline-block p-1 text-[#71717A] hover:text-vintage-dark"
                          title="Voir sur le site"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="inline-block p-1 text-vintage-red hover:text-[#A82E18]"
                          title="Modifier"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDelete(p.id, p.name)}
                          className="inline-block p-1 text-red-500 hover:text-red-700"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-[#71717A]">
            Aucun maillot ne correspond à vos critères.
          </div>
        )}
      </div>
    </div>
  );
}
