import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(),  tailwindcss(),],
esbuild: {
    // Игнорировать определённые предупреждения или ошибки (если нужно)
    legalComments: 'none',
    // Или отключить минификацию для теста
    minify: false,
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true, // Это помогает с mixed ES/CJS модулями[5]
    },
  },
});