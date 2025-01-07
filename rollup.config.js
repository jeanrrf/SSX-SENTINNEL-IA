export default {
  // ...existing code...
  output: {
    // ...existing code...
    manualChunks(id) {
      if (id.includes('node_modules')) {
        return 'vendor';
      }
      if (id.includes('largeModule')) {
        return 'largeModule';
      }
    },
    // ...existing code...
  },
  // ...existing code...
};
