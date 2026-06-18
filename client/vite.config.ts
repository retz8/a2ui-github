import react from '@vitejs/plugin-react';
import {defineConfig} from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
    server: {
      // Inline Primer so Vite transforms its internal CSS imports
      // (otherwise externalized .css hits Node's loader and throws).
      deps: {inline: ['@primer/react']},
    },
  },
});
