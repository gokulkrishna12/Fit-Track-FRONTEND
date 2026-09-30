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
    drop: ['console', 'debugger'], // Strips out logs for smaller KB
  },
  build: {
    target: 'esnext',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // 👇 NUCLEAR CHUNKING: Forces HTTP/2 parallel downloading 👇
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('socket.io')) return 'vendor-socket';
            if (id.includes('@reduxjs') || id.includes('react-redux')) return 'vendor-redux';
            if (id.includes('recharts') || id.includes('d3')) return 'vendor-charts';
            if (id.includes('lucide-react')) return 'vendor-icons';
            if (id.includes('react/') || id.includes('react-dom/') || id.includes('react-router')) return 'vendor-react';
            return 'vendor-core';
          }
        }
      }
    }
  }
});