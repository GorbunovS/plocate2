import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  server: {
    proxy: {
      '/dadata': {
        target: 'https://cleaner.dadata.ru',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/dadata/, '')
      }
    }
  },
  plugins: [vue(), tailwindcss()],
  esbuild: {
    legalComments: 'none',
  },
  build: {
    minify: false,  
    terserOptions: {
      compress: true,
      mangle: true,
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    chunkSizeWarningLimit: 1000,
  },
});
