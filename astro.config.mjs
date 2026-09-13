// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://pflege-direkt.netlify.app',
  integrations: [
    sitemap({
      // Bestätigungsseite ist kein Ziel für Suchmaschinen (nur nach
      // erfolgreicher Bewerbung erreichbar). Admin-Bereich ist intern,
      // nie öffentlich indexierbar (siehe auch robots.txt).
      filter: (page) => !page.includes('/bewerbung-erfolgreich') && !page.includes('/admin'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
