import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Ensure "@" points to "src" directory
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react';
            if (id.includes('lodash')) return 'lodash';
            if (id.includes('axios')) return 'axios';
            return 'vendor'; // other dependencies
          }
        },
      },
    },
    // Adjust chunk size warning limit to 1500kB for more flexibility
    chunkSizeWarningLimit: 1500,
  },
})
