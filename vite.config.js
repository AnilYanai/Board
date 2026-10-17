import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import process from 'node:process';

// https://vite.dev/config/
export default defineConfig({
  base: process.env.GITHUB_PAGES ? '/Board/' : './', // Sets the base URL for the project(for github build)
  server: {
    port: 8001, // Desired port number
    strictPort: true, // Ensures the port isn't switched if unavailable
    host: '0.0.0.0', // Allows access from external devices
    open: true, // Automatically opens the browser
  },
  plugins: [react()],
});
