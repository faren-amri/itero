import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  publicDir: 'public',
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: './index.html' // ONLY React app entry
    }
  }
});
