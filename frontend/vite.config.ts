import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: true,
    port: process.env.PORT ? parseInt(process.env.PORT) : 4173,
    allowedHosts: process.env.RAILWAY_PUBLIC_DOMAIN 
      ? [process.env.RAILWAY_PUBLIC_DOMAIN, 'localhost', '127.0.0.1']
      : 'all'
  },
  define: {
    __API_BASE_URL__: JSON.stringify(
      process.env.VITE_API_URL || 
      (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : null) ||
      'http://localhost:3001'
    ),
  },
})
