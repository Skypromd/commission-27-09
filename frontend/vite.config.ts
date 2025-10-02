import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable React Fast Refresh
      fastRefresh: true,
      // Enable automatic JSX runtime
      jsxRuntime: 'automatic',
      // Babel plugins for modern features
      babel: {
        plugins: [
          // Add any Babel plugins here if needed
        ]
      }
    })
  ],

  // Path resolution for clean imports
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/components': resolve(__dirname, './src/components'),
      '@/pages': resolve(__dirname, './src/pages'),
      '@/hooks': resolve(__dirname, './src/hooks'),
      '@/utils': resolve(__dirname, './src/utils'),
      '@/types': resolve(__dirname, './src/types'),
      '@/services': resolve(__dirname, './src/services'),
      '@/styles': resolve(__dirname, './src/styles'),
      '@/store': resolve(__dirname, './src/store'),
      '@/contexts': resolve(__dirname, './src/contexts')
    }
  },

  // Development server configuration
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true,
    cors: true,
    // Proxy for API calls
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      }
    },
    // Hot Module Replacement
    hmr: {
      overlay: true
    }
  },

  // Preview server (for production testing)
  preview: {
    host: '0.0.0.0',
    port: 3001,
    cors: true
  },

  // Build optimizations
  build: {
    // Target modern browsers
    target: 'esnext',

    // Output directory
    outDir: 'dist',

    // Source maps for debugging
    sourcemap: true,

    // Minification
    minify: 'esbuild',

    // Chunk size warning limit
    chunkSizeWarningLimit: 1000,

    // Rollup options for advanced bundling
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom'],
          'vendor-ui': ['framer-motion', 'lucide-react', '@headlessui/react'],
          'vendor-forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'vendor-data': ['@tanstack/react-query', '@tanstack/react-table', 'axios'],
          'vendor-utils': ['date-fns', 'clsx', 'tailwind-merge']
        },

        // Asset naming
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          let extType = info[info.length - 1];

          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img';
          } else if (/woff|woff2|eot|ttf|otf/i.test(extType)) {
            extType = 'fonts';
          }

          return `assets/${extType}/[name]-[hash][extname]`;
        },

        // Chunk naming
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js'
      }
    },

    // Optimize dependencies
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'framer-motion',
        'lucide-react',
        '@tanstack/react-query',
        '@tanstack/react-table'
      ]
    }
  },

  // CSS configuration
  css: {
    // PostCSS configuration is handled by postcss.config.js
    postcss: {},

    // CSS modules (if needed)
    modules: {
      localsConvention: 'camelCase'
    },

    // Dev source maps
    devSourcemap: true
  },

  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString())
  },

  // Performance optimizations
  esbuild: {
    // Remove console.log in production
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : []
  },

  // Worker configuration
  worker: {
    format: 'es'
  }
});
