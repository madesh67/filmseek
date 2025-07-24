import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/filmseek/',  // Must match your repository name
  plugins: [react()],
})
