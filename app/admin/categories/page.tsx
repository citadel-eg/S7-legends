'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Edit2, Check, X, Loader2 } from 'lucide-react';
import { fetchAdminCategories } from '@/lib/queries/admin';
import { createCategory, updateCategory, deleteCategory } from '@/lib/actions/category-actions';
import { Category } from '@/types/database';
import { useAdminI18n } from '@/lib/i18n/admin-i18n';

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const { tAdmin, isArabic } = useAdminI18n();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New category form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);

  // Edit category form state
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editActive, setEditActive] = useState(true);

  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: fetchAdminCategories,
  });

  const createMutation = useMutation({
    mutationFn: (data: { name: string; slug: string; description: string; active: boolean }) =>
      createCategory(data),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
        queryClient.invalidateQueries({ queryKey: ['admin-metrics'] });
        setIsCreating(false);
        setName('');
        setSlug('');
        setDescription('');
        setError(null);
      } else {
        setError(res.error || 'Error creating category');
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { name: string; slug: string; description?: string | null; active?: boolean };
    }) => updateCategory(id, data),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
        setEditingId(null);
        setError(null);
      } else {
        setError(res.error || 'Error updating category');
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
        queryClient.invalidateQueries({ queryKey: ['admin-metrics'] });
        setError(null);
      } else {
        setError(res.error || 'Error deleting category');
      }
    },
  });

  const handleStartEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditSlug(cat.slug);
    setEditDescription(cat.description || '');
    setEditActive(cat.active);
  };

  const handleSaveEdit = (id: string) => {
    updateMutation.mutate({
      id,
      data: {
        name: editName,
        slug: editSlug,
        description: editDescription,
        active: editActive,
      },
    });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;
    createMutation.mutate({ name, slug, description, active });
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight uppercase text-vintage-dark">
            {tAdmin('categories')}
          </h1>
          <p className="text-xs text-[#71717A] mt-0.5">
            {tAdmin('manageCategoriesSubtitle')}
          </p>
        </div>

        {!isCreating && (
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center gap-2 bg-vintage-red hover:bg-[#A82E18] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{tAdmin('addCategory')}</span>
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
          {error}
        </div>
      )}

      {/* Create New Category Panel */}
      {isCreating && (
        <form onSubmit={handleCreate} className="bg-white p-6 rounded-2xl border border-vintage-red/30 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-vintage-border/70 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-vintage-red/10 border border-vintage-red/20 flex items-center justify-center">
                <Plus className="w-4 h-4 text-vintage-red" />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-vintage-dark">
                {tAdmin('addCategory')}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="p-1 text-[#71717A] hover:text-vintage-dark rounded-md hover:bg-[#FAF8F5] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#52525B]">{tAdmin('catName')} *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                }}
                placeholder={isArabic ? 'مثال: دوري أبطال أوروبا الكلاسيكي' : 'e.g. Champions League Vintage'}
                className="w-full px-3.5 py-2.5 text-xs font-medium border border-vintage-border rounded-lg bg-[#FAF8F5]/40 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-vintage-red/20 focus:border-vintage-red/50 text-vintage-dark"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#52525B]">{tAdmin('catSlug')} *</label>
              <div className="relative flex items-center" dir="ltr">
                <span className="absolute left-3 text-[11px] text-[#A1A1AA] font-mono pointer-events-none select-none">
                  /
                </span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="champions-league-vintage"
                  className="w-full pl-7 pr-3.5 py-2.5 text-xs font-mono text-left border border-vintage-border rounded-lg bg-[#FAF8F5]/40 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-vintage-red/20 focus:border-vintage-red/50 text-vintage-dark"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#52525B]">{tAdmin('catDescription')}</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={isArabic ? 'نبذة قصيرة وتفاصيل القسم...' : 'Short collection background and era details...'}
              className="w-full px-3.5 py-2.5 text-xs font-medium border border-vintage-border rounded-lg bg-[#FAF8F5]/40 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-vintage-red/20 focus:border-vintage-red/50 text-vintage-dark"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-vintage-border/70">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs select-none">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="w-4 h-4 rounded text-vintage-red focus:ring-vintage-red cursor-pointer"
              />
              <span className="font-bold text-vintage-dark">{tAdmin('catActive')}</span>
            </label>

            <div className="flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-xs font-semibold text-[#71717A] hover:text-vintage-dark hover:bg-[#FAF8F5] rounded-lg transition-colors cursor-pointer"
              >
                {tAdmin('btnCancel')}
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="inline-flex items-center gap-1.5 bg-vintage-red hover:bg-[#A82E18] text-white text-xs font-bold uppercase tracking-wider px-5 py-2 rounded-lg shadow-2xs disabled:opacity-50 transition-colors cursor-pointer"
              >
                {createMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{createMutation.isPending ? tAdmin('btnSaving') : tAdmin('btnCreateCategory')}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Categories Table */}
      <div className="bg-white rounded-xl border border-vintage-border overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className={`w-full ${isArabic ? 'text-right' : 'text-left'} text-xs`}>
            <thead className="bg-[#FAF8F5] border-b border-vintage-border text-[#71717A] uppercase font-bold tracking-wider">
              <tr>
                <th className="px-5 py-3">{tAdmin('catName')}</th>
                <th className="px-5 py-3">{tAdmin('catSlug')}</th>
                <th className="px-5 py-3">{tAdmin('catDescription')}</th>
                <th className="px-5 py-3 text-center">{tAdmin('colStatus')}</th>
                <th className="px-5 py-3 text-start">{tAdmin('colAction')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-vintage-border">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={`shimmer-${i}`} className="animate-pulse">
                    <td className="px-5 py-4">
                      <div className="w-36 h-3.5 bg-[#EBE7DF] rounded" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="w-24 h-3 bg-[#EBE7DF]/70 rounded" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="w-48 h-3 bg-[#EBE7DF]/70 rounded" />
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="w-16 h-5 rounded-full bg-[#EBE7DF] mx-auto" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-start gap-1.5">
                        <div className="w-7 h-7 rounded-lg bg-[#EBE7DF]" />
                        <div className="w-7 h-7 rounded-lg bg-[#EBE7DF]" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : categories && categories.length > 0 ? (
                categories.map((cat) => {
                const isEditing = editingId === cat.id;

                if (isEditing) {
                  return (
                    <tr key={cat.id} className="bg-vintage-red/5 border-y-2 border-vintage-red/30 transition-colors">
                      {/* Name input */}
                      <td className="px-5 py-3.5">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-[#71717A] uppercase block">
                            {tAdmin('catName')}
                          </span>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => {
                              setEditName(e.target.value);
                              if (!editSlug || editSlug === cat.slug) {
                                setEditSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                              }
                            }}
                            className="w-full px-3 py-1.5 text-xs font-bold text-vintage-dark border border-vintage-border rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-vintage-red/20 focus:border-vintage-red/50 shadow-2xs"
                          />
                        </div>
                      </td>

                      {/* Slug input */}
                      <td className="px-5 py-3.5">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-[#71717A] uppercase block">
                            {tAdmin('catSlug')}
                          </span>
                          <input
                            type="text"
                            value={editSlug}
                            onChange={(e) => setEditSlug(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs font-mono text-vintage-dark border border-vintage-border rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-vintage-red/20 focus:border-vintage-red/50 shadow-2xs"
                          />
                        </div>
                      </td>

                      {/* Description input */}
                      <td className="px-5 py-3.5">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-[#71717A] uppercase block">
                            {tAdmin('catDescription')}
                          </span>
                          <input
                            type="text"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            placeholder={tAdmin('catDescription')}
                            className="w-full px-3 py-1.5 text-xs text-vintage-dark border border-vintage-border rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-vintage-red/20 focus:border-vintage-red/50 shadow-2xs"
                          />
                        </div>
                      </td>

                      {/* Active switch button */}
                      <td className="px-5 py-3.5 text-center">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-[#71717A] uppercase block">
                            {tAdmin('colStatus')}
                          </span>
                          <button
                            type="button"
                            onClick={() => setEditActive(!editActive)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                              editActive
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-200'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${editActive ? 'bg-emerald-500' : 'bg-zinc-400'}`} />
                            <span>{editActive ? tAdmin('statusActive') : tAdmin('statusInactive')}</span>
                          </button>
                        </div>
                      </td>

                      {/* Action buttons (Save & Cancel) */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-start gap-1.5 pt-4">
                          <button
                            type="button"
                            disabled={updateMutation.isPending && updateMutation.variables?.id === cat.id}
                            onClick={() => handleSaveEdit(cat.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs transition-colors disabled:opacity-50 cursor-pointer"
                            title={tAdmin('btnSave')}
                          >
                            {updateMutation.isPending && updateMutation.variables?.id === cat.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Check className="w-3.5 h-3.5" />
                            )}
                            <span>{tAdmin('btnSave')}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-vintage-border bg-white text-[#71717A] hover:bg-[#FAF8F5] hover:text-vintage-dark font-semibold text-xs shadow-2xs transition-colors cursor-pointer"
                            title={tAdmin('btnCancel')}
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>{tAdmin('btnCancel')}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={cat.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-vintage-dark">
                      {cat.name}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-[11px] text-[#71717A]">
                      {cat.slug}
                    </td>
                    <td className="px-5 py-3.5 text-[#52525B]">
                      {cat.description || '—'}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          cat.active
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-zinc-100 text-zinc-600'
                        }`}
                      >
                        {cat.active ? tAdmin('statusActive') : tAdmin('statusInactive')}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-start gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(cat)}
                          className="p-1.5 rounded-lg border border-vintage-red/30 bg-vintage-red/5 text-vintage-red hover:bg-vintage-red hover:text-white hover:border-vintage-red transition-colors shadow-2xs cursor-pointer inline-flex items-center justify-center"
                          title={tAdmin('actionEdit')}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          disabled={deleteMutation.isPending && deleteMutation.variables === cat.id}
                          onClick={() => {
                            if (confirm(tAdmin('confirmDeleteCat'))) {
                              deleteMutation.mutate(cat.id);
                            }
                          }}
                          className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors shadow-2xs disabled:opacity-50 cursor-pointer inline-flex items-center justify-center"
                          title={tAdmin('actionDelete')}
                        >
                          {deleteMutation.isPending && deleteMutation.variables === cat.id ? (
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
                <td colSpan={5} className="p-8 text-center text-xs text-[#71717A]">
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
