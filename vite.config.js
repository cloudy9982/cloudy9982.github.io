import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // 因為儲存庫是 cloudy9982.github.io，網站會運行在根目錄
  base: '/', 
})