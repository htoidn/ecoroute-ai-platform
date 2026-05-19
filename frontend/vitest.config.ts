import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.tsx'],
    setupFiles: 'src/test/setupTests.ts',
    globals: true,
  },
});

