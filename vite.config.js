// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    minify: false
  },
  base: '/light_shadow/',
  server: {
    host: true,
    port: 5000
  },
})