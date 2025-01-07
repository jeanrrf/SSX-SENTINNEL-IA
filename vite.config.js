import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  // ...existing code...
  plugins: [
    // ...existing plugins...
    nodePolyfills()
  ],
  // ...existing code...
  server: {
    mimeTypes: {
      'application/wasm': ['.wasm']
    }
  }
});
