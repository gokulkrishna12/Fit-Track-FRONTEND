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
  esbuild: {
    drop: ['console', 'debugger'], // Keeps the JS bundle ultra-light
  },
  build: {
    target: 'esnext',
    cssCodeSplit: true,
    // 👇 THE CRITICAL FIX: Stops Vite from downloading charts on the login page 👇
    modulePreload: false,
    rollupOptions: {
      output: {
        // We leave this empty! Let React.lazy() naturally handle the code splitting.
        manualChunks: undefined
      }
    }
  }
});