import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Proxy PDF hosts in local dev (no CORS; force inline PDF).
  server: {
    proxy: {
      '/ebook-proxy': {
        target: 'https://ebooksnew.b-cdn.net',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/ebook-proxy/, ''),
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes, req) => {
            const path = req.url?.toLowerCase() ?? ''
            if (!path.includes('.pdf')) return
            proxyRes.headers['content-type'] = 'application/pdf'
            proxyRes.headers['content-disposition'] = 'inline'
            delete proxyRes.headers['x-frame-options']
            delete proxyRes.headers['content-security-policy']
          })
        },
      },
      '/yoga-ebook-proxy': {
        target: 'https://api.ameora.fun',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/yoga-ebook-proxy/, ''),
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes, req) => {
            const path = req.url?.toLowerCase() ?? ''
            if (!path.includes('.pdf')) return
            proxyRes.headers['content-type'] = 'application/pdf'
            proxyRes.headers['content-disposition'] = 'inline'
            delete proxyRes.headers['x-frame-options']
            delete proxyRes.headers['content-security-policy']
          })
        },
      },
    },
  },
})
