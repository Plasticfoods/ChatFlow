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
        target: 'http://localhost:7070', 
        changeOrigin: true,
        secure: false,
      },
      // 2. Proxy Socket.io (CRITICAL STEP)
      '/socket.io': {
        target: 'http://localhost:7070',
        ws: true, // Enables WebSocket proxying
        changeOrigin: true,
        secure: false,
      },
    },
  },
})