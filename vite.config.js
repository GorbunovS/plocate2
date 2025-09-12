import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],

  esbuild: {
    legalComments: 'none',
  },

  resolve: {
    // Гарантируем единый экземпляр пакета в дереве зависимостей
    dedupe: ['@telegram-apps/sdk'],
  },

  optimizeDeps: {
    // Исключаем SDK из предварительной оптимизации в dev-режиме
    exclude: ['@telegram-apps/sdk'],
  },

  build: {
    minify: 'terser',
    terserOptions: {
      compress: true,
      mangle: true,
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      // Делаем SDK внешней зависимостью, чтобы избежать встраивания дубликатов
      external: ['@telegram-apps/sdk'],
    },
  },
});
