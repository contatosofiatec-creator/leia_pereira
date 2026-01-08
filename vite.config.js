import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://webhookn8n.sofiatec.com.br/webhook',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/webhook')
      }
    }
  }
})
