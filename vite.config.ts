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
        manualChunks: {
          // Split large dependencies into separate chunks
          react: ['react', 'react-dom'],
          vendor: ['lodash', 'axios'], // Adjust based on other large dependencies
        },
      },
    },
    // Adjust chunk size warning limit if needed
    chunkSizeWarningLimit: 1000,
  },
})
