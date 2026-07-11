import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Plugins instalados, referenciando para ser processado.

export default defineConfig({
  plugins: [react(), tailwindcss()],
})