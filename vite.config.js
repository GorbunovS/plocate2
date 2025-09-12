import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import terser from 'vite-plugin-terser';

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    terser(),  // Плагин для Terser
  ],
  esbuild: {
    // Отключить esbuild для JS-трансформации
    drop: ['console', 'debugger'],  // Удалить console для теста
    legalComments: 'none',
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,  // Удалить console, чтобы уменьшить код
      },
      mangle: true,
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    // Игнорировать дубликаты в chunk'ах
    chunkSizeWarningLimit: 1000,
  },
});
