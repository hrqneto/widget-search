import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
  plugins: [react(), cssInjectedByJsPlugin()],
  define: {
    'process.env': {},
  },
  build: {
    rollupOptions: {
      input: './src/widget.tsx',
      output: {
        entryFileNames: 'embed.iife.js',
        assetFileNames: '[name].[ext]',
      },
    },
    lib: {
      entry: './src/widget.tsx',
      name: 'BuscaFlexWidget',
      fileName: () => 'embed.iife.js',
      formats: ['iife'],
    },
  },
  
});
