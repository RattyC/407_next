import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Admissions Portal',
    short_name: 'Admissions',
    description: 'Harvard-style admissions flow with portfolio',
    theme_color: '#A51C30',
    background_color: '#ffffff',
    display: 'standalone',
    icons: [
      { src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
    ],
  };
}

