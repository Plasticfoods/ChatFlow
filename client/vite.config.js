import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Your Client Port
    proxy: {
      // 1. Matches any request starting with "/api"
      '/api': {
        // 2. Forwards it to the Backend Server
        target: import.meta.env.VITE_API_URL, 
        changeOrigin: true,
        secure: false,
      },
      // 2. Proxy Socket.io (CRITICAL STEP)
      '/socket.io': {
        target: import.meta.env.VITE_API_URL,
        ws: true, // Enables WebSocket proxying
        changeOrigin: true,
        secure: false,
      },
    },
  },
})