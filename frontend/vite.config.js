// Vite configuration for React development and build
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Enable React plugin for JSX support and fast refresh
  plugins: [react()],
  
  // Define global constants
  define: {
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      REACT_APP_API_URL: JSON.stringify(process.env.REACT_APP_API_URL || 'http://localhost:8000/api'),
      REACT_APP_FRONTEND_URL: JSON.stringify(process.env.REACT_APP_FRONTEND_URL || 'http://localhost:5173'),
    }
  },
  
  // Server configuration
  server: {
    port: 5173,
    host: true,
    open: true,
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild', // Use esbuild instead of terser for better compatibility
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
  },
})
