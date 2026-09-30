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
    drop: ['console', 'debugger'],
  },
  build: {
    target: 'esnext',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // 👇 PERFORMANCE FIX: Surgical chunking to unblock the main thread 👇
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Split out the icons
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            // Split out core React dependencies
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor';
            }
            // Note: We leave recharts and redux alone so Vite dynamically imports them only when needed!
          }
        }
      }
    }
  }
});