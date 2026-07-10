import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  ssr: {
    // @portfolio/shared ships raw TypeScript source (no build step) — force
    // Vite to transform it as part of the SSR bundle rather than trying to
    // `import` it as an external, unbuildable package at Node runtime.
    noExternal: ['@portfolio/shared'],
  },
  server: {
    port: 5173,
    proxy: {
      // Uploaded media is served by Express and loaded directly by the
      // browser (the one exception to "browser never calls Express" — see
      // README "Architecture"). In production, nginx routes /uploads to the
      // API upstream on the same public domain; this proxy reproduces that
      // for local dev so relative /uploads/* URLs work identically.
      '/uploads': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true,
      },
    },
  },
});
