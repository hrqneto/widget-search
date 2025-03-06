// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
  },
   /*  build: {
    lib: {
      entry: './src/widget.tsx',
      name: 'BuscaFlexWidget',
      fileName: 'embed',
      formats: ['iife'],
    },
  },*/
});
