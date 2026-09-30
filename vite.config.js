import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    css: true,
  },
  // 👇 TURBO CHARGE JS BUNDLE 👇
  esbuild: {
    drop: ['console', 'debugger'], // Strips all console.logs in production to save KB
  },
  build: {
    target: 'esnext', // Builds only for modern browsers, removing heavy legacy polyfills
    cssCodeSplit: true,
    modulePreload: {
      polyfill: false,
    }
  }
});