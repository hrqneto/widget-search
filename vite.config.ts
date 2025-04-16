// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import path from 'path';
import { fileURLToPath } from 'url';

// Vite não define __dirname, isso resolve o problema:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), cssInjectedByJsPlugin()],
  define: {
    'process.env': {},
  },
  build: {
    rollupOptions: {
      input: {
        preview: path.resolve(__dirname, 'preview.html'), // usado no <iframe>
        widget: path.resolve(__dirname, 'src/widget.tsx'), // usado no ecommerce
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'widget') return 'embed.iife.js';
          return '[name].js';
        },
      },
    },
  },
});
