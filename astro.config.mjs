// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://dogothocung.us', // TODO: Replace with your actual production domain
  output: 'server',
  integrations: [react(), sitemap()],
  adapter: vercel()
});