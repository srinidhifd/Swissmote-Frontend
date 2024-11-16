import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/', // For proper asset loading
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Keeping your existing alias
    },
  },
  build: {
    outDir: 'dist', // Specify build output directory
    rollupOptions: {
      output: {
        manualChunks: {
          // Keeping your existing chunks configuration
          react: ['react', 'react-dom'],
          vendor: ['lodash', 'axios'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Keeping your existing limit
  },
})