import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'S7 LÉGENDES — Maillots Rares & Archives de Football',
    short_name: 'S7 LÉGENDES',
    description:
      'Trouvailles originales, répliques authentiques et maillots de football vintage.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAF8F5',
    theme_color: '#C4371A',
    icons: [
      {
        src: '/assets/logo-crest.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/assets/logo-crest.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
