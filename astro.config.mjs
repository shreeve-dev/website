// @ts-check
import { defineConfig } from 'astro/config';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://shreeve.dev',
  adapter: node({
    mode: 'standalone'
  })
});
