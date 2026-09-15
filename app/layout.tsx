import type { Metadata } from 'next';
import { Archivo, Lato } from 'next/font/google';
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

export const metadata: Metadata = {
  title: 'S7 LÉGENDES — Maillots Rares & Archives de Football',
  description: 'Trouvailles originales, répliques authentiques et maillots de football vintage. Commandez facilement via WhatsApp.',
  icons: {
    icon: '/assets/logo-crest.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${archivo.variable} ${lato.variable}`}>
      <body className="min-h-screen flex flex-col bg-vintage-cream text-vintage-dark antialiased selection:bg-vintage-red selection:text-white">
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
