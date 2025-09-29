import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  // logLevel: 'warn', // "info" | "warn" | "error" | "silent"
  plugins: [react(), tailwindcss(), svgr()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      // You can add more aliases for specific directories, e.g.:
      // "@components": resolve(__dirname, "src/components"),
      // "@utils": resolve(__dirname, "src/utils"),
      // '@': path.resolve(process.cwd(), 'src'),
      // '@': path.resolve(__dirname, './src'),
    },
  },
});
