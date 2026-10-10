// @ts-check
import { defineConfig } from 'astro/config';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://shreeve.dev',
  adapter: node({
    mode: 'standalone'
  }),
  build: {
    // The Content Security Policy in server.mjs forbids inline styles.
    inlineStylesheets: 'never'
  }
});
