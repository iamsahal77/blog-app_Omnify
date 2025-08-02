// Vite configuration for React development and build
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Enable React plugin for JSX support and fast refresh
  plugins: [react()],
})
