// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
  plugins: [react(),
    cssInjectedByJsPlugin()

  ],
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
