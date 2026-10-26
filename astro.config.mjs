// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages project site. When a custom domain is added, set `site` to it
// and remove `base`.
export default defineConfig({
  site: 'https://sdrp.github.io',
  base: '/med-tables',
  trailingSlash: 'always',
  output: 'static',
  build: {
    format: 'directory',
  },
});
