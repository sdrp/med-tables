import type { APIRoute } from 'astro';
import { SITE_NAME, SITE_DESCRIPTION, withBase } from '../lib/site';

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify(
      {
        name: SITE_NAME,
        short_name: SITE_NAME,
        description: SITE_DESCRIPTION,
        start_url: withBase(),
        scope: withBase(),
        display: 'standalone',
        background_color: '#f4efe5',
        theme_color: '#f4efe5',
        icons: [
          { src: withBase('icons/icon-192.png'), sizes: '192x192', type: 'image/png' },
          { src: withBase('icons/icon-512.png'), sizes: '512x512', type: 'image/png' },
          { src: withBase('icons/icon-512.png'), sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      null,
      2,
    ),
    { headers: { 'Content-Type': 'application/manifest+json' } },
  );
