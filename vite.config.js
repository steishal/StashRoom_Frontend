import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'window',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Адрес твоего Spring Boot backend
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '/api'), // Оставляем как есть
      },
    },
  },
});

