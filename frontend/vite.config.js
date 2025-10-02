import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    // Полностью отключаем проверку хостов для Preview URLs
    strictPort: false,
    hmr: {
      port: 3000
    },
    // Добавляем заголовки для работы с любыми доменами
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With'
    }
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