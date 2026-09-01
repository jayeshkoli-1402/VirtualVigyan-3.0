import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 5174,
    allowedHosts: true,
  },
})
