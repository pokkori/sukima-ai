import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'extension',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/index.tsx'),
        options: resolve(__dirname, 'src/options/index.tsx'),
        background: resolve(__dirname, 'src/background.ts'),
        content: resolve(__dirname, 'src/content.ts'),
      },
      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === 'popup') return 'popup/popup.js';
          if (chunk.name === 'options') return 'options/options.js';
          return '[name].js';
        },
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: (asset) => {
          if (asset.name?.endsWith('.css')) {
            return '[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
});
