import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    // Добавляем точный хост из Preview URL
    allowedHosts: [
      'rushelp.preview.emergentagent.com',
      'localhost',
      '127.0.0.1',
      '.preview.emergentagent.com'
    ],
    strictPort: false,
    hmr: {
      port: 3000
    },
    cors: true
  },
  // Для Vite 5+ отключаем проверку хостов через preview
  preview: {
    host: true,
    port: 3000,
    strictPort: false
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env': process.env
  }
})