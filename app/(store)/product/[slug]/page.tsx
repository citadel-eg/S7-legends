import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug, getActiveProducts } from '@/lib/queries/storefront';
import { ProductDetailView } from '@/components/product/product-detail-view';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Maillot non trouvé — S7 LÉGENDES',
    };
  }

  const primaryImage = product.images[0]?.image_url || '/assets/logo-crest.png';

  return {
    title: `${product.player.toUpperCase()} ${product.year} — ${product.team} | S7 LÉGENDES`,
    description: product.description,
    openGraph: {
      title: `${product.name} — S7 LÉGENDES`,
      description: product.description,
      images: [{ url: primaryImage }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Fetch related products (e.g., from same category or active products)
  const allActive = await getActiveProducts({ limit: 5 });
  const relatedProducts = allActive
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <ProductDetailView
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
