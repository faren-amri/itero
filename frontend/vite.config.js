import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  publicDir: 'public', // ✅ ensure this is set explicitly
  plugins: [react()]
});
