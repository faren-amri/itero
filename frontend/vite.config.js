// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import replace from '@rollup/plugin-replace'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    replace({
      preventAssignment: true,
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
    })
  ]
})
