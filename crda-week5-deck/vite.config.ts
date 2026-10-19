import { defineConfig } from 'vite';

// Relative base so the built deck in dist/ also opens from a USB stick or a
// plain static file server without any path rewriting.
export default defineConfig({
  base: './',
  server: { port: 5173, open: false },
  build: { target: 'es2022', chunkSizeWarningLimit: 1500 },
});
