import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],// Specify the custom port number here
  strictPort: true, // Ensures the port isn't switched if unavailable
  host: '0.0.0.0', // Optional: Allows access from external devices
  open: true, // Optional: Automatically opens the browser
})
