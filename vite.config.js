import { defineConfig } from 'vite';
import { resolve } from 'node:path';
export default defineConfig({
 cacheDir: resolve('.cache/vite'),
 build: { rollupOptions: { input: { main: resolve('index.html'), react: resolve('react.html') } } }
});
