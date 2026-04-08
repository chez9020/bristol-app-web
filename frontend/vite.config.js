import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Needed for external access from ngrok/mobile
    allowedHosts: true, // Needed for ngrok urls in newer Vite versions
    proxy: {
      // Forward all /api requests from React directly to FastAPI on localhost
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
