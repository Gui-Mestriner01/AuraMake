import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// O site usa endereços de verdade (/produto/p01), então os arquivos saem com caminho
// absoluto. Em hospedagem estática é preciso o redirect de SPA (já está no netlify.toml).
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: { port: 5173, open: true }
})
