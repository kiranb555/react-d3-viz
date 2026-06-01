import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Use the automatic JSX runtime so test files don't need to import React.
  esbuild: { jsx: 'automatic' },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['test/**/*.test.{ts,tsx}', 'src/**/*.test.{ts,tsx}'],
  },
});
