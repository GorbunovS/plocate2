import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  esbuild: {
    legalComments: 'none',
  },
  build: {
    minify: 'terser',  // Переход на Terser вместо esbuild
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    terserOptions: {
      compress: true,  // Включите сжатие, если нужно
      mangle: true,    // Минификация имён
    },
  },
});
