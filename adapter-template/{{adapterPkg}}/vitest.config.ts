import {defineConfig} from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    css: true,
    // If your design system ships CSS imports that Vite externalizes under
    // jsdom (tests fail loading its CSS), inline it here:
    //   server: {deps: {inline: [/your-design-system/]}}
  },
});
