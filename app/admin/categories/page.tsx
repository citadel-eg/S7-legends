'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { fetchAdminCategories } from '@/lib/queries/admin';
import { createCategory, updateCategory, deleteCategory } from '@/lib/actions/category-actions';
import { Category } from '@/types/database';
import { t } from '@/i18n';

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
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
        setError(res.error || 'Erreur lors de la création');
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
        setError(res.error || 'Erreur lors de la modification');
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
        setError(res.error || 'Erreur lors de la suppression');
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
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight uppercase text-vintage-dark">
            {t('admin.categories')}
          </h1>
          <p className="text-xs text-[#71717A] mt-0.5">
            Organisez vos maillots par catégories (Maillots Rares, Authentique, Coupe du Monde, UCL...)
          </p>
        </div>

        {!isCreating && (
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center gap-2 bg-vintage-red hover:bg-[#A82E18] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle Catégorie</span>
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
        <form onSubmit={handleCreate} className="bg-white p-5 rounded-xl border border-vintage-red/30 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-vintage-border pb-2">
            <h2 className="font-display text-sm font-bold uppercase text-vintage-dark">
              Ajouter une Catégorie
            </h2>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-[#71717A] hover:text-vintage-dark"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#52525B]">Nom *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                }}
                placeholder="Ex: Ligue des Champions"
                className="w-full px-3 py-2 text-xs border border-vintage-border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-vintage-red/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#52525B]">Slug *</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="ligue-des-champions"
                className="w-full px-3 py-2 text-xs border border-vintage-border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-vintage-red/20"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#52525B]">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Courte description de la catégorie"
              className="w-full px-3 py-2 text-xs border border-vintage-border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-vintage-red/20"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="rounded text-vintage-red focus:ring-vintage-red"
              />
              <span className="font-medium text-vintage-dark">Active (Visible en boutique)</span>
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-3 py-1.5 text-xs text-[#71717A] hover:text-vintage-dark"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="bg-vintage-red hover:bg-[#A82E18] text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-lg shadow-2xs disabled:opacity-50"
              >
                {createMutation.isPending ? 'Enregistrement...' : 'Créer'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Categories Table */}
      <div className="bg-white rounded-xl border border-vintage-border overflow-hidden shadow-2xs">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-[#71717A]">{t('common.loading')}</div>
        ) : categories && categories.length > 0 ? (
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-vintage-border text-[#71717A] uppercase font-bold tracking-wider">
              <tr>
                <th className="px-5 py-3">Nom</th>
                <th className="px-5 py-3">Slug</th>
                <th className="px-5 py-3">Description</th>
                <th className="px-5 py-3 text-center">Statut</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-vintage-border">
              {categories.map((cat) => {
                const isEditing = editingId === cat.id;

                if (isEditing) {
                  return (
                    <tr key={cat.id} className="bg-amber-50/40">
                      <td className="px-5 py-3">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-vintage-border rounded bg-white"
                        />
                      </td>
                      <td className="px-5 py-3">
                        <input
                          type="text"
                          value={editSlug}
                          onChange={(e) => setEditSlug(e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-vintage-border rounded bg-white"
                        />
                      </td>
                      <td className="px-5 py-3">
                        <input
                          type="text"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-vintage-border rounded bg-white"
                        />
                      </td>
                      <td className="px-5 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={editActive}
                          onChange={(e) => setEditActive(e.target.checked)}
                          className="rounded text-vintage-red focus:ring-vintage-red"
                        />
                      </td>
                      <td className="px-5 py-3 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(cat.id)}
                          className="p-1 text-emerald-600 hover:text-emerald-700"
                          title="Enregistrer"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="p-1 text-[#71717A] hover:text-vintage-dark"
                          title="Annuler"
                        >
                          <X className="w-4 h-4" />
                        </button>
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
                        {cat.active ? t('common.active') : t('common.inactive')}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(cat)}
                        className="p-1 text-[#52525B] hover:text-vintage-dark"
                        title="Modifier"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Supprimer la catégorie "${cat.name}" ?`)) {
                            deleteMutation.mutate(cat.id);
                          }
                        }}
                        className="p-1 text-red-500 hover:text-red-700"
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
        ) : (
          <div className="p-8 text-center text-xs text-[#71717A]">
            Aucune catégorie configurée.
          </div>
        )}
      </div>
    </div>
  );
}
