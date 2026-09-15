import { z } from 'zod';

export const variantSchema = z.object({
  id: z.string().optional(),
  size: z.string().min(1, 'Taille requise'),
  stock: z.coerce.number().min(0, 'Le stock doit être supérieur ou égal à 0'),
  available: z.boolean(),
});

export const imageSchema = z.object({
  id: z.string().optional(),
  image_url: z.string().url('URL d’image invalide'),
  alt_text: z.string().nullable().optional(),
  sort_order: z.coerce.number(),
  is_primary: z.boolean(),
});

export const productFormSchema = z.object({
  name: z.string().min(2, 'Le nom du maillot est requis'),
  slug: z.string().min(2, 'Le slug est requis'),
  player: z.string().min(1, 'Le joueur est requis'),
  team: z.string().min(1, 'L’équipe est requise'),
  year: z.coerce.number().min(1950, 'Année invalide').max(2030, 'Année invalide'),
  price: z.coerce.number().min(1, 'Le prix doit être supérieur à 0'),
  category_id: z.string().uuid('Veuillez sélectionner une catégorie valide'),
  product_type: z.string().min(1, 'Le type de maillot est requis'),
  condition: z.string().min(1, 'L’état est requis'),
  description: z.string().min(5, 'La description est requise'),
  shipping_text: z.string().optional().nullable(),
  featured: z.boolean(),
  active: z.boolean(),
  variants: z.array(variantSchema),
  images: z.array(imageSchema),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
