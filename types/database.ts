export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  player: string;
  team: string;
  year: number | string;
  description: string;
  price: number;
  category_id: string;
  product_type: string;
  condition: string;
  featured: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
  shipping_text?: string | null;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | string;
  stock: number;
  available: boolean;
  created_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface ProductWithDetails extends Product {
  category?: Category | null;
  variants: ProductVariant[];
  images: ProductImage[];
}
