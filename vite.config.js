import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  esbuild: {
    legalComments: 'none',
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
  },
});
