import react from '@vitejs/plugin-react';
import {configDefaults, defineConfig} from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
    exclude: [...configDefaults.exclude, 'e2e/**'],
    // If your design system ships CSS imports that Vite externalizes under
    // jsdom (tests fail loading its CSS), inline it here:
    //   server: {deps: {inline: ['your-design-system']}}
  },
});
