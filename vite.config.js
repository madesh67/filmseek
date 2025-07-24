import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base:'/filmseek/',
  plugins: [react()],
  server:{
    allowedHosts:[
      'sour-worlds-go.loca.lt'
    ]
  }
})