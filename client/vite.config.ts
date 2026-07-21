import {fileURLToPath} from 'node:url';
import react from '@vitejs/plugin-react';
import {configDefaults, defineConfig} from 'vitest/config';

// Dev server only: resolve `primer-a2ui-adapter` to its TypeScript source instead of its built
// `dist`. The client consumes the adapter's `dist` everywhere else (its published entry), but the
// dev server serving `dist` means an adapter edit only shows up after a `dist` rebuild — and
// rebuilding while the dev server runs corrupts Vite's module cache and blanks the page. Pointing
// dev at the source lets Vite transform the adapter directly: real HMR on adapter edits, no rebuild.
// The build (`command === 'build'`) and Vitest (`process.env.VITEST`) keep consuming `dist`.
const adapterSrc = fileURLToPath(new URL('../primer-a2ui-adapter/src/index.ts', import.meta.url));

export default defineConfig(({command}) => ({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Three pages: the chat client (default), the fixture dev page, and the examples showcase.
      input: {
        index: fileURLToPath(new URL('./index.html', import.meta.url)),
        dev: fileURLToPath(new URL('./dev.html', import.meta.url)),
        examples: fileURLToPath(new URL('./examples.html', import.meta.url)),
      },
    },
  },
  server: {
    fs: {
      // The examples page reads the curated corpus from the sibling `agent/` subproject (outside
      // the yarn workspace) via import.meta.glob. Allow the repo root so `vite dev` can serve those
      // JSON files. (The production build inlines them through the glob and never hits fs.allow.)
      allow: [fileURLToPath(new URL('..', import.meta.url))],
    },
  },
  resolve:
    command === 'serve' && !process.env.VITEST
      ? {alias: [{find: /^primer-a2ui-adapter$/, replacement: adapterSrc}]}
      : {},
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
    exclude: [...configDefaults.exclude, 'e2e/**'],
    server: {
      // Inline Primer so Vite transforms its internal CSS imports
      // (otherwise externalized .css hits Node's loader and throws).
      deps: {inline: ['@primer/react']},
    },
  },
}));
