import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  root: './client',  // Set the project root to the client folder
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  plugins: [react()],
})
