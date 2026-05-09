import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  publicDir: 'static',
  server: {
    hmr: {
      port: 24718,
    },
    proxy: {
      '/api': {
        target: 'https://my-memoryrisk.yangdengkui01.workers.dev',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
