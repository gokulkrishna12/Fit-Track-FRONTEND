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
  build: {
    // 👇 PERFORMANCE FIX: Let Vite natively chunk based on React.lazy() 👇
    cssCodeSplit: true, // Splits CSS so the Login page doesn't load Dashboard CSS
    modulePreload: {
      polyfill: false, // Disables unnecessary polyfills on modern browsers
    },
    rollupOptions: {
      output: {
        // Removed the bulky manualChunks function to restore native Tree-Shaking
      }
    }
  }
});