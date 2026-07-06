import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  optimizeDeps: {
    include: ['@asgardeo/auth-react', '@asgardeo/auth-spa'],
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
})
