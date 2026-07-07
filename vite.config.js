import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  optimizeDeps: {
    include: [
      '@asgardeo/auth-react',
      '@asgardeo/auth-spa',
      '@tensorflow-models/mobilenet/dist/imagenet_classes',
    ],
  },
  build: {
    chunkSizeWarningLimit: 1500,
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  // Polyfill `global` for CJS packages that reference it in the browser
  define: {
    'global': 'globalThis',
  },
})
