import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/sobral-news/',
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api-feed': {
        target: 'https://www.sobralnoticias.com.br',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-feed/, '/feeds/posts/default')
      }
    }
  },
  preview: {
    host: true,
    port: 4173
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      manifest: {
        name: 'Sobral News',
        short_name: 'Sobral News',
        description: 'Portal de notícias de Sobral e da região norte do Ceará',
        theme_color: '#D32F2F',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/sobral-news/',
        scope: '/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/www\.sobralnoticias\.com\.br\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'sobral-noticias-feed',
              expiration: { maxEntries: 50, maxAgeSeconds: 3600 }
            }
          }
        ]
      }
    })
  ]
})