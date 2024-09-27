import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/monaco-editor')) {
            return 'monaco';  // Split Monaco Editor into a separate chunk
          }
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5000', // Proxy API requests to backend
    }
  }
});
