// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  plugins: [react()]
  // ← no build.rollupOptions.input; Vite will copy /public/* to dist root
})
