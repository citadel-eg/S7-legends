import type { Metadata } from 'next';
import { Archivo, Lato, Cairo } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/components/providers/query-provider';

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const lato = Lato({
  subsets: ['latin'],
  variable: '--font-lato',
  display: 'swap',
  weight: ['400', '700', '900'],
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
  weight: ['400', '600', '700', '800', '900'],
});

const SITE_URL = 'https://s7-legends.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'S7 LÉGENDES — Maillots Rares & Archives de Football',
    template: '%s | S7 LÉGENDES',
  },
  description:
    'Trouvailles originales, répliques authentiques et maillots de football vintage. Commandez facilement via WhatsApp. Livraison rapide depuis la France.',
  keywords: [
    'maillots rares',
    'football vintage',
    'maillots de foot',
    'jersey rare',
    'vintage football shirts',
    'S7 Légendes',
    'maillots collection',
    'Ligue des Champions',
    'Coupe du Monde',
    'قمصان كرة قدم',
    'قمصان نادرة',
  ],
  authors: [{ name: 'S7 LÉGENDES' }],
  creator: 'S7 LÉGENDES',
  publisher: 'S7 LÉGENDES',
  icons: {
    icon: '/assets/logo-crest.png',
    apple: '/assets/logo-crest.png',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    alternateLocale: 'ar_DZ',
    url: SITE_URL,
    siteName: 'S7 LÉGENDES',
    title: 'S7 LÉGENDES — Maillots Rares & Archives de Football',
    description:
      'Trouvailles originales, répliques authentiques et maillots de football vintage. Commandez facilement via WhatsApp.',
    images: [
      {
        url: '/assets/banner-legends-figma.png',
        width: 1200,
        height: 630,
        alt: 'S7 LÉGENDES — Maillots Rares de Football',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'S7 LÉGENDES — Maillots Rares & Archives de Football',
    description:
      'Trouvailles originales, répliques authentiques et maillots de football vintage.',
    images: ['/assets/banner-legends-figma.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {},
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${archivo.variable} ${lato.variable} ${cairo.variable}`}>
      <body className="min-h-screen flex flex-col bg-vintage-cream text-vintage-dark antialiased selection:bg-vintage-red selection:text-white">
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
